// enrollment.ts — Story 3.4 (AC1, AC2, AC3, AC5) + Story 4.1 (AC1–AC4, AD-4/5/12/14)
//                 + Story 4.2 (AC2, AC3, AC4, AD-7/8/14/15).
//
// AD-14 — SOLE STATUS WRITER: This module is the ONLY place in the app that
// writes Enrollment.status. All seat acquisition (balance path AND Paystack
// PENDING path), confirm (webhook — 4.2), cancel, expire, attend/no-show all
// live here as separate exported functions added by future epics. No page,
// action, or reader writes Enrollment.status anywhere else.
//
// Story 4.2 ADDITIONS:
//   - `confirmPaidSeat(args)` — the webhook confirm seam (AD-7/8/14/15).
//     Owns the entire Serializable tx: Payment idempotency gate (P2002 → already_processed)
//     → GroupSession FOR UPDATE re-check → PENDING+room→CONFIRMED+TOPUP(captured)+BOOKING_CHARGE |
//     PENDING-refilled/CANCELLED→CANCELLATION_REFUND wallet credit (AD-15).
//     NOTE: the confirm path credits the captured card amount as a TOPUP BEFORE the
//     BOOKING_CHARGE debit — the Paystack path is only taken when balance < priceCents,
//     so debiting a wallet that never received the card money would trip mutate's NFR4
//     non-negative guard and fail every confirm forever. TOPUP funds the wallet first.
//     Reuses the same retry loop, lock pattern, and helpers as reserveSeat.
//   - `decideConfirmOutcome(args)` — pure exported decision function (unit-testable).
//   - Lock order: GroupSession FOR UPDATE → wallet advisory lock (same as reserveSeat → no deadlock).
//   - AD-15 orphan/CANCELLED path: flip still-PENDING → CANCELLED (AD-14 sole writer),
//     then credit captured amount as CANCELLATION_REFUND via wallet.mutate (AD-6).
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
import { computeRefund, hoursUntilStart } from "@/lib/cancellation";

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

// ---------------------------------------------------------------------------
// Story 4.2 — internal sentinel + confirmPaidSeat + decideConfirmOutcome
// ---------------------------------------------------------------------------

/** Sentinel thrown inside the tx callback when Payment.reference already exists (P2002). */
class AlreadyProcessedError extends Error {
  constructor() {
    super("ALREADY_PROCESSED");
    this.name = "AlreadyProcessedError";
  }
}

/**
 * Discriminated result from confirmPaidSeat (Story 4.2).
 *
 * ok:true paths:
 *   "confirmed"          — PENDING→CONFIRMED, BOOKING_CHARGE written
 *   "refunded_to_wallet" — seat gone/expired, captured amount credited (AD-15)
 *   "already_processed"  — Payment.reference already exists (idempotent replay)
 *   "noop"               — enrollment not found for reference; Payment recorded
 *
 * ok:false paths:
 *   "error"              — unrecoverable error; route returns 500 for Paystack retry
 */
export type ConfirmResult =
  | { ok: true; outcome: "confirmed" | "refunded_to_wallet" | "already_processed" | "noop" }
  | { ok: false; reason: "error" };

/**
 * Pure decision function for the confirm/refund/noop branch (AC2, AC3, AC4, Story 4.2).
 *
 * Called inside `confirmPaidSeat` after reading enrollment status and counting
 * OTHER occupancy under the GroupSession FOR UPDATE lock.
 *
 * Rules (per Dev Notes "The confirm control flow"):
 *   CONFIRMED/ATTENDED/NO_SHOW → noop (defensive; Payment gate normally prevents re-delivery reaching here)
 *   PENDING AND othersOccupied < capacity  → confirm
 *   PENDING AND othersOccupied >= capacity → refund_to_wallet (class refilled, AD-15)
 *   CANCELLED                              → refund_to_wallet (hold expired, AD-15)
 *
 * @param args.status          - current enrollment status (re-read under the lock)
 * @param args.othersOccupied  - count of OTHER occupying enrollments (excludes own row)
 * @param args.capacity        - class capacity from the locked GroupSession row
 * @returns                    - "confirm" | "refund_to_wallet" | "noop"
 */
export function decideConfirmOutcome(args: {
  status: string;
  othersOccupied: number;
  capacity: number;
}): "confirm" | "refund_to_wallet" | "noop" {
  const { status, othersOccupied, capacity } = args;

  if (status === "CONFIRMED" || status === "ATTENDED" || status === "NO_SHOW") {
    // Defensive noop — Payment gate should prevent re-delivery reaching here.
    return "noop";
  }

  if (status === "PENDING") {
    if (othersOccupied < capacity) {
      return "confirm";
    }
    // Seat count (excluding this row) >= capacity: class is full → conserve to wallet (AD-15).
    return "refund_to_wallet";
  }

  if (status === "CANCELLED") {
    // Hold expired and released (lazy flip or prior cancel) → conserve to wallet (AD-15).
    return "refund_to_wallet";
  }

  // Unknown status — treat as noop defensively.
  return "noop";
}

/**
 * The webhook confirm seam for the Paystack online-payment path (Story 4.2, AD-7).
 *
 * This is the ONLY function that processes a verified Paystack `charge.success`
 * event. It owns the entire Serializable tx, ordered per AD-7:
 *
 *   1. INSERT Payment(reference unique)                    — AD-7 idempotency GATE
 *      └─ P2002 → already_processed → caller returns 200
 *   2. findUnique Enrollment by paymentRef=reference
 *      └─ none → noop (Payment recorded; no student to credit safely)
 *   3. SELECT … FOR UPDATE GroupSession(enr.groupSessionId) — AD-4/5 re-check under lock
 *   4. decide(status, othersOccupied, capacity):
 *      CONFIRMED/ATTENDED/NO_SHOW           → noop
 *      PENDING & othersOccupied < capacity  → confirm  (PENDING→CONFIRMED + BOOKING_CHARGE)
 *      PENDING & othersOccupied >= capacity → refund_to_wallet (AD-15)
 *      CANCELLED                            → refund_to_wallet (AD-15)
 *   5. confirm:  Enrollment→CONFIRMED, pendingExpiresAt=null
 *                wallet.mutate TOPUP +amountCents (captured card payment funds the wallet)
 *                wallet.mutate BOOKING_CHARGE -priceCents (snapshot, AD-16), enrollmentId, paymentRef
 *                (TOPUP first so the debit never trips the NFR4 non-negative guard — the
 *                 Paystack path is only entered when balance < priceCents)
 *      refund:   if still PENDING → Enrollment→CANCELLED, pendingExpiresAt=null (AD-14)
 *                wallet.mutate CANCELLATION_REFUND +amountCents (captured), enrollmentId, paymentRef
 *   commit
 *
 * Lock order: GroupSession FOR UPDATE → wallet advisory lock (same as reserveSeat → no deadlock).
 *
 * Retry loop, helpers (MAX_RETRIES, backoffMs, isSerializationError), and
 * $transaction options are reused from reserveSeat per the story spec.
 *
 * @param args.reference  - Paystack `data.reference` (joins to Enrollment.paymentRef)
 * @param args.amountCents - Paystack `data.amount` (integer cents; used for AD-15 refund)
 * @param args.status      - Paystack `data.status` (stored in Payment row)
 * @param args.type        - Paystack `event` name (stored in Payment row)
 * @param args.raw         - the full parsed event object (stored in Payment.raw)
 */
export async function confirmPaidSeat(args: {
  reference: string;
  amountCents: number;
  status: string;
  type: string;
  raw: unknown;
}): Promise<ConfirmResult> {
  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    try {
      // ── Serializable interactive transaction (AD-7, mirrors reserveSeat AD-4) ─
      const result = await db.$transaction(
        async (tx) => {
          const now = new Date();

          // ── Step 1: Idempotency gate — INSERT Payment(reference unique) ────────
          // AD-7: the unique-insert is the atomic gate. Under Serializable SSI,
          // only one concurrent delivery commits; the loser gets P2002 (or a
          // serialization abort → retry → then P2002) and no-ops.
          // Catch P2002 INSIDE the callback: throw AlreadyProcessedError (sentinel)
          // so Prisma rolls back the (empty) tx, and the outer catch maps to
          // "already_processed". Non-P2002 errors are re-thrown as-is.
          try {
            await tx.payment.create({
              data: {
                reference: args.reference,
                amountCents: args.amountCents,
                status: args.status,
                type: args.type,
                raw: args.raw as import("@prisma/client").Prisma.InputJsonValue,
              },
            });
          } catch (createErr) {
            if (
              createErr instanceof Prisma.PrismaClientKnownRequestError &&
              createErr.code === "P2002"
            ) {
              // Reference already processed — throw sentinel to signal already_processed.
              throw new AlreadyProcessedError();
            }
            throw createErr; // re-throw non-P2002 errors for outer handler
          }

          // ── Step 2: Find the enrollment by paymentRef=reference ────────────────
          const enr = await tx.enrollment.findUnique({
            where: { paymentRef: args.reference },
            select: {
              id: true,
              studentId: true,
              groupSessionId: true,
              status: true,
              priceCents: true,
            },
          });

          if (!enr) {
            // No enrollment found for this reference — Payment recorded above;
            // no student to attribute. Log + return noop.
            console.error("[enrollment.confirmPaidSeat] no enrollment found for reference:", {
              reference: args.reference,
            });
            return { ok: true as const, outcome: "noop" as const };
          }

          // ── Step 3: Lock GroupSession row FOR UPDATE (AD-4 belt-and-braces) ────
          // Mirrors reserveSeat Step 1 exactly.
          const rows = await tx.$queryRaw<
            {
              id: string;
              status: string;
              start: Date;
              capacity: number;
              priceCents: number;
            }[]
          >`SELECT id, status, "start", capacity, "priceCents" FROM "GroupSession" WHERE id = ${enr.groupSessionId} FOR UPDATE`;

          if (rows.length === 0) {
            // GroupSession deleted — should not happen; conserve as refund if possible.
            console.error("[enrollment.confirmPaidSeat] GroupSession not found:", {
              groupSessionId: enr.groupSessionId,
              reference: args.reference,
            });
            // Fall through: treat as refund_to_wallet (money must not be kept).
            await tx.enrollment.update({
              where: { id: enr.id },
              data: { status: "CANCELLED", pendingExpiresAt: null },
            });
            await mutate(tx, enr.studentId, {
              type: "CANCELLATION_REFUND",
              amountCents: args.amountCents,
              enrollmentId: enr.id,
              paymentRef: args.reference,
            });
            return { ok: true as const, outcome: "refunded_to_wallet" as const };
          }

          const cls = rows[0];

          // Re-read enrollment status UNDER the lock (TOCTOU-safe).
          const freshEnr = await tx.enrollment.findUnique({
            where: { id: enr.id },
            select: { status: true },
          });
          const currentStatus = freshEnr?.status ?? enr.status;

          // ── Step 4: Decide — count OTHER occupancy excluding this enrollment ──
          const othersOccupied = await tx.enrollment.count({
            where: {
              groupSessionId: enr.groupSessionId,
              id: { not: enr.id },
              ...occupiedEnrollmentWhere(now),
            },
          });

          const decision = decideConfirmOutcome({
            status: currentStatus,
            othersOccupied,
            capacity: cls.capacity,
          });

          // ── Step 5 (confirm path) ──────────────────────────────────────────────
          if (decision === "confirm") {
            // PENDING → CONFIRMED (AD-14), then fund-and-charge the wallet ledger (AD-6).
            await tx.enrollment.update({
              where: { id: enr.id },
              data: { status: "CONFIRMED", pendingExpiresAt: null },
            });

            // ── Fund the wallet with the captured card payment (TOPUP) BEFORE the charge ──
            // The Paystack path is entered ONLY when wallet balance < priceCents
            // (reserveSeat's balance decision under the lock), and the card money is
            // captured by Paystack — it does NOT enter the wallet ledger. Writing the
            // BOOKING_CHARGE debit against a wallet that never received the card money
            // would drive the balance negative and trip wallet.mutate's NFR4 non-negative
            // guard (WalletInsufficientFundsError) — the whole confirm tx would roll back
            // on EVERY delivery, the route would return 500, and Paystack would retry
            // forever: the student pays by card but never gets their seat. So we first
            // credit the captured amount as a TOPUP (money in), then debit the class-price
            // snapshot as the single BOOKING_CHARGE (AD-8, AD-16). Net wallet effect =
            // captured − priceCents (0 when captured == price; any residual stays as
            // conserved balance). This mirrors the AD-15 orphan path, which also credits
            // the captured amount to the wallet.
            await mutate(tx, enr.studentId, {
              type: "TOPUP",
              amountCents: args.amountCents, // positive = credit the captured card payment (AD-9)
              enrollmentId: enr.id,
              paymentRef: args.reference,
            });
            await mutate(tx, enr.studentId, {
              type: "BOOKING_CHARGE",
              amountCents: -enr.priceCents, // negative = debit; uses snapshot (AD-16)
              enrollmentId: enr.id,
              paymentRef: args.reference,
            });
            return { ok: true as const, outcome: "confirmed" as const };
          }

          // ── Step 5 (refund_to_wallet path, AD-15) ─────────────────────────────
          if (decision === "refund_to_wallet") {
            // Flip still-PENDING row to CANCELLED (AD-14 sole status writer).
            // CANCELLED rows are left as-is (already CANCELLED).
            if (currentStatus === "PENDING") {
              await tx.enrollment.update({
                where: { id: enr.id },
                data: { status: "CANCELLED", pendingExpiresAt: null },
              });
            }
            // Credit captured amount to wallet (AD-15; never keep the money).
            await mutate(tx, enr.studentId, {
              type: "CANCELLATION_REFUND",
              amountCents: args.amountCents, // positive = credit (captured amount from event)
              enrollmentId: enr.id,
              paymentRef: args.reference,
            });
            return { ok: true as const, outcome: "refunded_to_wallet" as const };
          }

          // ── Step 5 (noop path) ────────────────────────────────────────────────
          // Already CONFIRMED/ATTENDED/NO_SHOW — Payment recorded; nothing further.
          return { ok: true as const, outcome: "noop" as const };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 5000,
          timeout: 15000,
        },
      );

      return result;
    } catch (err) {
      // ── Already-processed sentinel (P2002 on Payment.reference unique) ────────
      if (err instanceof AlreadyProcessedError) {
        return { ok: true, outcome: "already_processed" };
      }

      // ── Serialization failure: retry with backoff (AD-4, mirrors reserveSeat) ─
      if (isSerializationError(err) && attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, backoffMs(attempt)));
        attempt++;
        continue;
      }

      // ── Non-retryable error: log and return failure (Paystack will retry) ──────
      // Structured log — never swallow a real failure (Consistency Conventions).
      // Never log the secret or PII.
      console.error("[enrollment.confirmPaidSeat] unrecoverable error:", {
        reference: args.reference,
        attempt,
        error: err,
      });
      return { ok: false, reason: "error" };
    }
  }

  // Exhausted all retries (all serialization failures).
  console.error("[enrollment.confirmPaidSeat] exhausted retries:", {
    reference: args.reference,
  });
  return { ok: false, reason: "error" };
}

// ---------------------------------------------------------------------------
// Story 5.2 — cancelEnrollment — AD-14 CANCELLED-transition sole writer
// ---------------------------------------------------------------------------
//
// cancelEnrollment is the SOLE function that writes the CONFIRMED→CANCELLED
// transition (AD-14 sole status writer). It runs inside the same Serializable
// + GroupSession FOR UPDATE + retry envelope as reserveSeat/confirmPaidSeat,
// preserving ONE seat-mutation pattern and the lock order (GroupSession FOR
// UPDATE → wallet advisory lock inside mutate) with no deadlock risk.
//
// Ledger model (BINDING — from Dev Notes "Ledger model"):
//   BOOKING_CHARGE = -priceCents is already on the books for this enrollment.
//   To leave net cost at feeCents:
//     CANCELLATION_REFUND = +refundCents (the tier refund credited back to wallet)
//     CANCELLATION_FEE    = amountCents 0 (audit-only; fee already captured by BOOKING_CHARGE)
//   Writing -feeCents for CANCELLATION_FEE would double-count the fee → wrong balance.
//   Only the CANCELLATION_REFUND row is balance-affecting; NFR4 never trips (positive credit).
//
// Lock order: GroupSession FOR UPDATE → wallet advisory (inside mutate). Same
//   as reserveSeat → no deadlock (consistent lock ordering across all seat mutations).

/**
 * Discriminated result from cancelEnrollment (Story 5.2).
 *
 * ok:true  — seat cancelled, refund (if any) credited, feeCents (if any) logged
 * ok:false — reasons:
 *   "not_found"      — no enrollment with that id+studentId (IDOR guard or invalid id)
 *   "not_cancellable"— enrollment is not CONFIRMED or class start <= now (double-cancel, past)
 *   "error"          — unrecoverable or non-retryable failure
 */
export type CancelResult =
  | { ok: true; refundCents: number; feeCents: number }
  | { ok: false; reason: "not_found" | "not_cancellable" | "error" };

/**
 * Cancel a CONFIRMED upcoming enrollment, applying the tiered refund (AD-11, Story 5.2).
 *
 * AD-14: this is the SOLE function that writes the CONFIRMED→CANCELLED transition.
 * AD-11: refund is computed authoritatively here via computeRefund (single source,
 *         same pure fn used by the 5.1 advisory preview — cannot diverge).
 * AD-16: uses enrollment.priceCents (the reserve-time snapshot), never the class price.
 * AD-6:  all ledger writes go through wallet.mutate (never tx.ledgerEntry.create directly).
 * AD-5:  no seat counter — flipping to CANCELLED removes this row from occupiedEnrollmentWhere.
 * AD-4:  same Serializable + retry envelope as reserveSeat/confirmPaidSeat.
 *
 * @param studentId    - from requireSession().user.id (never client-supplied — IDOR guard, AD-3)
 * @param enrollmentId - the enrollment to cancel (Zod-validated by the action)
 */
export async function cancelEnrollment(
  studentId: string,
  enrollmentId: string,
): Promise<CancelResult> {
  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    try {
      // ── Serializable interactive transaction (AD-4, mirrors reserveSeat) ──────
      const result = await db.$transaction(
        async (tx) => {
          const now = new Date();

          // ── Step 1: IDOR-safe lookup — keyed on BOTH id AND studentId (AC4a) ───
          // A client-supplied enrollmentId from another student will not match and
          // returns not_found (no write, no status reveal).
          const enr = await tx.enrollment.findFirst({
            where: { id: enrollmentId, studentId },
            select: {
              id: true,
              status: true,
              priceCents: true,
              groupSessionId: true,
              session: { select: { start: true } },
            },
          });

          if (!enr) {
            return { ok: false as const, reason: "not_found" as const };
          }

          // ── Step 2: Lock the GroupSession row (AD-4 belt-and-braces, AD-14) ───
          // Cancel is a seat-affecting transition; must take the same lock that
          // reserve/confirm use so concurrent mutations serialize correctly.
          // Also provides a TOCTOU-safe reading point for the enrollment re-check below.
          const rows = await tx.$queryRaw<
            { id: string; start: Date; capacity: number }[]
          >`SELECT id, "start", capacity FROM "GroupSession" WHERE id = ${enr.groupSessionId} FOR UPDATE`;

          if (rows.length === 0) {
            // GroupSession deleted (should not happen in normal operation).
            return { ok: false as const, reason: "not_cancellable" as const };
          }

          const session = rows[0];

          // ── Step 3: Re-read enrollment status UNDER the lock (TOCTOU-safe) (AC4b) ─
          // A concurrent second cancel or a webhook confirm serializes behind this lock;
          // after acquiring, the fresh status may differ from what Step 1 saw.
          const freshEnr = await tx.enrollment.findUnique({
            where: { id: enr.id },
            select: { status: true },
          });
          const currentStatus = freshEnr?.status ?? enr.status;

          // Guard: only CONFIRMED + upcoming (AC4b/AC4c).
          //   - not CONFIRMED → already cancelled, PENDING, ATTENDED, etc. → not_cancellable
          //   - start <= now  → class has begun; cancellation no longer applies → not_cancellable
          if (currentStatus !== "CONFIRMED" || session.start <= now) {
            return { ok: false as const, reason: "not_cancellable" as const };
          }

          // ── Step 4: Compute refund authoritatively (AD-11, AC1) ───────────────
          // Use the enrollment's immutable priceCents snapshot (AD-16), not the class price.
          // Same computeRefund that the 5.1 advisory preview uses — single source guarantee.
          const hours = hoursUntilStart(session.start, now);
          const { refundCents, feeCents } = computeRefund(enr.priceCents, hours);

          // ── Step 5: Flip enrollment to CANCELLED (AD-14 sole writer) ──────────
          await tx.enrollment.update({
            where: { id: enr.id },
            data: { status: "CANCELLED", pendingExpiresAt: null },
          });

          // ── Step 6: Credit refund to wallet via mutate (AD-6, AC1) ────────────
          // CANCELLATION_REFUND = +refundCents (positive credit; NFR4 non-negative guard
          // is never tripped by a credit). Written only when refundCents > 0.
          if (refundCents > 0) {
            await mutate(tx, studentId, {
              type: "CANCELLATION_REFUND",
              amountCents: refundCents,
              enrollmentId: enr.id,
            });
          }

          // ── Step 7: Write fee audit row (AD-6, AC1) ──────────────────────────
          // CANCELLATION_FEE amountCents = 0 deliberately:
          //   The fee was already captured by the original BOOKING_CHARGE = -priceCents.
          //   Crediting only +refundCents leaves net cost = feeCents correctly.
          //   Writing -feeCents here would double-count the fee → incorrect balance.
          //   This row is an immutable audit marker that a fee was retained.
          //   (balanceAfterCents is unchanged by a 0-amount entry — valid LedgerEntry.)
          if (feeCents > 0) {
            await mutate(tx, studentId, {
              type: "CANCELLATION_FEE",
              amountCents: 0, // audit-only; fee already captured by BOOKING_CHARGE (AC1)
              enrollmentId: enr.id,
            });
          }

          // ── Step 8: Return success ────────────────────────────────────────────
          return { ok: true as const, refundCents, feeCents };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 5000, // ms to wait for a connection
          timeout: 15000, // ms for the tx to complete
        },
      );

      return result;
    } catch (err) {
      // ── WalletInsufficientFundsError: defensive — a credit cannot trip NFR4 ──
      // Included for safety; should never occur since CANCELLATION_REFUND is positive.
      if (err instanceof WalletInsufficientFundsError) {
        console.error("[enrollment.cancelEnrollment] WalletInsufficientFundsError (unexpected — defensive):", {
          studentId,
          enrollmentId,
          attempt,
        });
        return { ok: false, reason: "error" };
      }

      // ── Serialization failure: retry with backoff (AD-4, mirrors reserveSeat) ─
      if (isSerializationError(err) && attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, backoffMs(attempt)));
        attempt++;
        continue;
      }

      // ── Non-retryable error: log and return generic failure ───────────────────
      console.error("[enrollment.cancelEnrollment] unrecoverable error:", {
        studentId,
        enrollmentId,
        attempt,
        error: err,
      });
      return { ok: false, reason: "error" };
    }
  }

  // Exhausted all retries (all serialization failures).
  console.error("[enrollment.cancelEnrollment] exhausted retries:", {
    studentId,
    enrollmentId,
  });
  return { ok: false, reason: "error" };
}
