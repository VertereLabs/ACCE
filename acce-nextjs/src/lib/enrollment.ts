// enrollment.ts — Story 3.4 (AC1, AC2, AC3, AC5) + Story 4.1 (AC1–AC4, AD-4/5/12/14).
//
// AD-14 — SOLE STATUS WRITER: This module is the ONLY place in the app that
// writes Enrollment.status. All seat acquisition (balance path AND Paystack
// PENDING path), confirm (webhook — 4.2), cancel, expire, attend/no-show all
// live here as separate exported functions added by future epics. No page,
// action, or reader writes Enrollment.status anywhere else.
//
// AD-4 — ONE CANONICAL SEAT RESERVATION, Serializable SSI:
//   reserveSeat() is the SINGLE reservation function for ALL paths (balance
//   AND Paystack). Never create a second reservation path — AD-4 forbids it.
//   The no-oversell guarantee comes from Serializable SSI (the Postgres
//   snapshot-isolation conflict detection that aborts one of two concurrent
//   transactions racing for the last seat), NOT from the FOR UPDATE row lock
//   alone. The FOR UPDATE on GroupSession is belt-and-braces: it serializes
//   concurrent writes on the GroupSession row with 2.3's updateClassAction.
//   On a serialization failure (40001 raw / P2034 Prisma), reserveSeat()
//   retries with bounded backoff (AD-4 mandate).
//
// AD-5 — CAPACITY DERIVED; EXPIRY FLIP ONLY INSIDE A LOCKED MUTATION:
//   occupied = count(Enrollment where status ∈ {PENDING,CONFIRMED} AND
//   (pendingExpiresAt IS NULL OR > now)). Read paths already exclude expired
//   PENDING via occupiedEnrollmentWhere. The actual PENDING→CANCELLED flip
//   is performed ONLY inside reserveSeat under the GroupSession lock — never
//   in a reader — so it cannot race a 4.2 webhook confirming that same seat.
//
// AD-6 — wallet.mutate() IS THE CHARGE PATH:
//   The BOOKING_CHARGE MUST go through wallet.mutate(tx, studentId, …).
//   Never tx.ledgerEntry.create() directly. mutate() owns the advisory lock,
//   balance read-under-lock, NFR4 non-negative guard, and immutable append.
//   Pass the caller's tx so the charge composes into the same Serializable tx.
//
// AD-7 — PAYSTACK PATH WRITES NO BOOKING_CHARGE AT HOLD-TIME:
//   The PENDING enrollment is created WITHOUT a wallet.mutate call (AD-8 says
//   one BOOKING_CHARGE per CONFIRMED enrollment — the webhook (4.2) writes it
//   at confirm-time, not here).
//
// AD-8 — ENROLLMENT CREATED BEFORE CHARGE (balance path only):
//   Create/reactivate the Enrollment row first so wallet.mutate() can receive
//   the enrollmentId. One BOOKING_CHARGE per enrollmentId (partial unique index
//   in migration 20260705203800_schema_deltas_spine).
//
// AD-12 — REACTIVATION (create-or-reactivate via @@unique):
//   @@unique([studentId, groupSessionId]) is status-agnostic. Cases:
//   - Own CANCELLED → reactivate (coded defensively; no cancel flow until Epic 5).
//   - Own expired PENDING → reactivate into a fresh PENDING or CONFIRMED hold.
//   - Own unexpired PENDING → resume (return existing paymentRef; Paystack idempotent).
//   ⚠ Cross-epic deferred: reactivating a row that already has a BOOKING_CHARGE
//   collides with AD-8's partial-unique index. Resolve when Epic 5 lands cancel.
//   See deferred-work.md#AD-12.
//
// EPIC-4 SEAM FILLED (Story 4.1):
//   The insufficient-balance branch is now the PENDING hold path:
//     balance < priceCents → PENDING enrollment, pendingExpiresAt=now+15min,
//     paymentRef=generatePaymentRef(), NO wallet.mutate — outcome=pending_payment.
//   Also added: locked expiry flip of OTHER students' expired PENDING rows on
//   this class BEFORE the occupancy count (AD-5/AD-14).
//
// AD-2: import { db } from "@/lib/db" — never new PrismaClient().
// AD-9: all money is integer cents. No floats.

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { occupiedEnrollmentWhere } from "@/lib/class-occupancy";
import { getBalance, mutate, WalletInsufficientFundsError } from "@/lib/wallet";
import { generatePaymentRef } from "@/lib/paystack";

// ---------------------------------------------------------------------------
// Public result type
// ---------------------------------------------------------------------------

/**
 * Discriminated result from reserveSeat (Story 4.1 — outcome-tagged).
 *
 * ok:true paths:
 *   "confirmed"       — seat reserved, wallet charged via BOOKING_CHARGE (balance path)
 *   "pending_payment" — PENDING hold created, Paystack init required (Paystack path)
 *
 * ok:false paths:
 *   "class_full"      — capacity reached (under the lock)
 *   "already_enrolled"— non-cancelled enrollment already exists (FR11)
 *   "not_available"   — class not SCHEDULED or start is in the past
 *   "error"           — unexpected error or unrecoverable retry failure
 *
 * NOTE: "insufficient_balance" is removed (Story 4.1). A balance shortfall now
 * produces the "pending_payment" outcome (Paystack hold) rather than an error.
 * WalletInsufficientFundsError is still caught as a defensive safety net and
 * maps to "error" (should never trigger given the explicit getBalance check).
 */
export type ReserveSeatResult =
  | { ok: true; outcome: "confirmed"; enrollmentId: string }
  | {
      ok: true;
      outcome: "pending_payment";
      enrollmentId: string;
      paymentRef: string;
      amountCents: number;
    }
  | {
      ok: false;
      reason: "class_full" | "already_enrolled" | "not_available" | "error";
    };

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Max number of retry attempts after the initial try (total = MAX_RETRIES + 1). */
const MAX_RETRIES = 4;

/** Backoff in ms indexed by attempt number (clamped at last value). */
const RETRY_BACKOFF_MS = [50, 100, 200];

function backoffMs(attempt: number): number {
  return RETRY_BACKOFF_MS[Math.min(attempt, RETRY_BACKOFF_MS.length - 1)];
}

/**
 * Returns true when the error is a Postgres serialization failure that is safe
 * to retry:
 *   - Prisma P2034 (write conflict / deadlock — Prisma's translation of 40001/40P01)
 *   - Raw pg "40001" (serialization failure) — surfaced by @prisma/adapter-pg on
 *     some Prisma versions before it translates to P2034.
 */
function isSerializationError(err: unknown): boolean {
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2034") {
    return true;
  }
  if (
    err !== null &&
    typeof err === "object" &&
    "code" in err &&
    (err as { code: unknown }).code === "40001"
  ) {
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// reserveSeat — the single canonical seat reservation (AD-4)
// ---------------------------------------------------------------------------

/**
 * Reserve a seat in a group class — balance path or Paystack PENDING hold (AD-4).
 *
 * This is the ONLY seat-reservation function in the app (AD-4). Story 4.1 fills
 * the EPIC-4 seam: the insufficient-balance branch is now the PENDING path.
 *
 * Control flow (ARCHITECTURE-SPINE "Seat-purchase control flow"):
 *
 *   SELECT … FOR UPDATE GroupSession(classId)                     — AD-4 belt-and-braces
 *   guard status=SCHEDULED AND start>now                          — not_available
 *   updateMany OTHER expired PENDING → CANCELLED (this class)     — AD-5/AD-14 locked expiry flip (4.1)
 *   findUnique own Enrollment(studentId, classId):
 *     CONFIRMED/ATTENDED/NO_SHOW → already_enrolled               — FR11/AC4
 *     PENDING AND unexpired      → RESUME (return existing paymentRef, outcome=pending_payment) — AC4
 *     PENDING AND expired | CANCELLED | none → reactivate/create below
 *   count occupied (occupiedEnrollmentWhere) < cap                — AD-5 under lock
 *     occupied >= cap → class_full
 *   balance = getBalance(studentId, tx)                           — read UNDER lock (4.1)
 *     balance >= priceCents → CONFIRMED + wallet.mutate BOOKING_CHARGE  — outcome=confirmed
 *     balance <  priceCents → PENDING, pendingExpiresAt=now+15min,
 *                             paymentRef=generatePaymentRef(), NO charge — outcome=pending_payment
 *   commit
 *
 * The Paystack initializeTransaction call happens OUTSIDE this function
 * (in the server action), after the tx commits, so no lock is held across HTTP.
 *
 * @param studentId - the student's User.id (from requireSession(); NEVER client-supplied)
 * @param classId   - the GroupSession id (Zod-validated by the server action)
 */
export async function reserveSeat(
  studentId: string,
  classId: string,
): Promise<ReserveSeatResult> {
  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    try {
      // ── Serializable interactive transaction (AD-4) ─────────────────────
      // isolationLevel: Serializable — SSI is what prevents oversell on the
      // last seat (see module header). NOT omittable without reintroducing oversell.
      const result = await db.$transaction(
        async (tx) => {
          const now = new Date();

          // ── Step 1: Lock GroupSession row (AD-4 belt-and-braces) ─────────
          // Prisma has no findUnique...FOR UPDATE so we use $queryRaw.
          // Mirrors 2.3 updateClassAction's lock pattern exactly.
          const rows = await tx.$queryRaw<
            {
              id: string;
              status: string;
              start: Date;
              capacity: number;
              priceCents: number;
            }[]
          >`SELECT id, status, "start", capacity, "priceCents" FROM "GroupSession" WHERE id = ${classId} FOR UPDATE`;

          if (rows.length === 0) {
            return { ok: false as const, reason: "not_available" as const };
          }

          const cls = rows[0];

          // ── Step 2: State guard — SCHEDULED + future start ───────────────
          // Closes the 3.3-deferred "no status/start guard on detail fetch":
          // a deep-linked CANCELLED/past class's "Pay" button is now blocked here
          // under the lock. This is the REAL enforcement; the page still renders
          // the inert/unguarded detail view for a CANCELLED class (deferred item).
          if (cls.status !== "SCHEDULED" || cls.start <= now) {
            return { ok: false as const, reason: "not_available" as const };
          }

          // ── Step 3 (NEW 4.1): Lazy expiry flip — other students (AD-5, AD-14) ──
          // Flip OTHER students' expired PENDING rows on this class to CANCELLED.
          // This runs INSIDE the lock so it cannot race a 4.2 webhook confirming
          // that same seat (AD-14 — sole status writer). Read paths already exclude
          // expired PENDING via occupiedEnrollmentWhere; this makes the write
          // authoritative for the occupancy count in Step 5.
          // Own row is NOT flipped here — the own-row logic handles it below.
          await tx.enrollment.updateMany({
            where: {
              groupSessionId: classId,
              status: "PENDING",
              pendingExpiresAt: { lte: now },
              // Exclude the current student's own row (handled in Step 4).
              studentId: { not: studentId },
            },
            data: { status: "CANCELLED", pendingExpiresAt: null },
          });

          // ── Step 4: Existing-enrollment check (AC2, AC4, FR11, AD-12) ────
          const existing = await tx.enrollment.findUnique({
            where: {
              studentId_groupSessionId: { studentId, groupSessionId: classId },
            },
            select: { id: true, status: true, pendingExpiresAt: true, paymentRef: true, priceCents: true },
          });

          if (existing) {
            const status = existing.status;

            if (status === "CONFIRMED" || status === "ATTENDED" || status === "NO_SHOW") {
              // FR11: already holds an active/historical confirmed enrollment → reject.
              return { ok: false as const, reason: "already_enrolled" as const };
            }

            if (status === "PENDING") {
              const isExpired = existing.pendingExpiresAt !== null && existing.pendingExpiresAt <= now;

              if (!isExpired) {
                // AC4: own UNEXPIRED PENDING → RESUME.
                // Return the existing paymentRef so the action re-inits Paystack with
                // the same reference (Paystack `initialize` is idempotent by reference).
                // Do NOT create a second row.
                return {
                  ok: true as const,
                  outcome: "pending_payment" as const,
                  enrollmentId: existing.id,
                  paymentRef: existing.paymentRef!, // set when PENDING was created
                  amountCents: existing.priceCents,
                };
              }

              // Own EXPIRED PENDING → treat as reactivatable (fall through to Step 5/6 below).
              // The row already exists; we'll update it in the create/reactivate logic.
            }

            // status === "CANCELLED" OR own expired PENDING: reactivate below.
          }

          // ── Step 5: Capacity check under the lock (AC3, AD-5) ────────────
          // Count INSIDE the lock so a concurrent buyer racing for the last seat
          // reads the same snapshot. SSI serializes the commit order; whoever loses
          // gets a 40001 and retries, finding the seat taken.
          const occupied = await tx.enrollment.count({
            where: {
              groupSessionId: classId,
              ...occupiedEnrollmentWhere(now),
            },
          });

          if (occupied >= cls.capacity) {
            return { ok: false as const, reason: "class_full" as const };
          }

          // ── Step 6 (NEW 4.1): Balance decision under the lock ─────────────
          // Read balance INSIDE the Serializable tx (under the GroupSession lock)
          // to determine the path. getBalance(studentId, tx) uses the tx client.
          const balance = await getBalance(studentId, tx);

          if (balance >= cls.priceCents) {
            // ── Balance sufficient: create/reactivate as CONFIRMED ────────
            // priceCents is snapshotted from the locked row (AD-16: immutable).
            // Enrollment is created BEFORE the charge so wallet.mutate() receives
            // the enrollmentId (AD-8: one BOOKING_CHARGE per enrollmentId).
            let enrollmentId: string;

            if (existing) {
              // AD-12 reactivation branch — own CANCELLED or expired PENDING.
              // ⚠ DEFERRED: reactivating a row that already carries a BOOKING_CHARGE
              // will hit the AD-8 partial-unique index on the next step. When Epic 5
              // lands, resolve this cross-epic collision. See deferred-work.md#AD-12.
              const reactivated = await tx.enrollment.update({
                where: { id: existing.id },
                data: {
                  status: "CONFIRMED",
                  priceCents: cls.priceCents,
                  pendingExpiresAt: null,
                  paymentRef: null,
                },
                select: { id: true },
              });
              enrollmentId = reactivated.id;
            } else {
              // Fresh enrollment (no existing row).
              const created = await tx.enrollment.create({
                data: {
                  studentId,
                  groupSessionId: classId,
                  status: "CONFIRMED",
                  priceCents: cls.priceCents,
                  pendingExpiresAt: null,
                  paymentRef: null,
                },
                select: { id: true },
              });
              enrollmentId = created.id;
            }

            // ── Step 7: Charge via wallet.mutate (AD-6, AD-8, NFR4) ──────
            // mutate() takes the per-student advisory lock, reads balance under lock,
            // guards non-negative (NFR4), and appends the immutable LedgerEntry.
            //
            // CRITICAL: If WalletInsufficientFundsError is thrown here, we do NOT
            // catch it inside this callback. It propagates OUT of the callback →
            // Prisma rolls back the entire Serializable tx → the enrollment row
            // created/updated above is NOT persisted. The outer try/catch
            // catches it and returns { ok: false, reason: "error" } (defensive net —
            // should not trigger given the getBalance check above).
            //
            // (Catching inside and returning a value would commit the tx with an
            //  orphaned CONFIRMED enrollment and no BOOKING_CHARGE — data corruption.)
            await mutate(tx, studentId, {
              type: "BOOKING_CHARGE",
              amountCents: -cls.priceCents, // negative = debit (AD-9)
              enrollmentId,
            });

            return { ok: true as const, outcome: "confirmed" as const, enrollmentId };
          } else {
            // ── Balance insufficient: PENDING hold (Story 4.1, AC1, AD-7, AD-8) ──
            // Create or reactivate the enrollment as PENDING with a 15-minute hold.
            // NO wallet.mutate — no BOOKING_CHARGE here (AD-8). The charge is the
            // 4.2 webhook's job after HMAC-verified payment confirmation (AD-7).
            const paymentRef = generatePaymentRef();
            const pendingExpiresAt = new Date(now.getTime() + 15 * 60 * 1000); // now + 15 min
            let enrollmentId: string;

            if (existing) {
              // Reactivate own CANCELLED or expired PENDING row (AD-12).
              const reactivated = await tx.enrollment.update({
                where: { id: existing.id },
                data: {
                  status: "PENDING",
                  priceCents: cls.priceCents,
                  pendingExpiresAt,
                  paymentRef,
                },
                select: { id: true },
              });
              enrollmentId = reactivated.id;
            } else {
              // Fresh enrollment as PENDING (no existing row).
              const created = await tx.enrollment.create({
                data: {
                  studentId,
                  groupSessionId: classId,
                  status: "PENDING",
                  priceCents: cls.priceCents,
                  pendingExpiresAt,
                  paymentRef,
                },
                select: { id: true },
              });
              enrollmentId = created.id;
            }

            return {
              ok: true as const,
              outcome: "pending_payment" as const,
              enrollmentId,
              paymentRef,
              amountCents: cls.priceCents,
            };
          }
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 5000, // ms to wait for a connection
          timeout: 15000, // ms for the tx to complete
        },
      );

      return result;
    } catch (err) {
      // ── WalletInsufficientFundsError: tx already rolled back (defensive) ─
      // With Story 4.1's explicit getBalance check, this should never trigger
      // (balance shortfall is now the PENDING path, not an error). Kept as a
      // defensive safety net per the story mandate. Maps to "error" since
      // "insufficient_balance" is no longer a valid result reason.
      if (err instanceof WalletInsufficientFundsError) {
        console.error("[enrollment.reserveSeat] WalletInsufficientFundsError (unexpected — defensive net):", {
          studentId,
          classId,
          attempt,
        });
        return { ok: false, reason: "error" };
      }

      // ── Serialization failure: retry with backoff (AD-4) ─────────────────
      if (isSerializationError(err) && attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, backoffMs(attempt)));
        attempt++;
        continue;
      }

      // ── Non-retryable error: log and return generic failure ───────────────
      // Structured log on failure — never swallow (Consistency Conventions).
      console.error("[enrollment.reserveSeat] unrecoverable error:", {
        studentId,
        classId,
        attempt,
        error: err,
      });
      return { ok: false, reason: "error" };
    }
  }

  // Exhausted all retries (all MAX_RETRIES attempts were serialization failures).
  console.error("[enrollment.reserveSeat] exhausted retries:", { studentId, classId });
  return { ok: false, reason: "error" };
}
