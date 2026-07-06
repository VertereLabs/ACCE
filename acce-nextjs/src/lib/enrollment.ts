// enrollment.ts — Story 3.4 (AC1, AC2, AC3, AC5).
//
// AD-14 — SOLE STATUS WRITER: This module is the ONLY place in the app that
// writes Enrollment.status. All seat acquisition (balance path + future
// Paystack path), confirm (webhook), cancel, expire, attend/no-show all live
// here as separate exported functions added by future epics. No page, action,
// or reader writes Enrollment.status anywhere else.
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
// AD-6 — wallet.mutate() IS THE CHARGE PATH:
//   The BOOKING_CHARGE MUST go through wallet.mutate(tx, studentId, …).
//   Never tx.ledgerEntry.create() directly. mutate() owns the advisory lock,
//   balance read-under-lock, NFR4 non-negative guard, and immutable append.
//   Pass the caller's tx so the charge composes into the same Serializable tx.
//
// AD-8 — ENROLLMENT CREATED BEFORE CHARGE:
//   Create/reactivate the Enrollment row first so wallet.mutate() can receive
//   the enrollmentId. One BOOKING_CHARGE per enrollmentId (partial unique index
//   in migration 20260705203800_schema_deltas_spine).
//
// AD-12 — REACTIVATION (create-or-reactivate via @@unique):
//   @@unique([studentId, groupSessionId]) is status-agnostic — a student
//   re-booking a CANCELLED class MUST update the existing row (not INSERT).
//   UNREACHABLE IN 3.4: no cancel flow exists until Epic 5. Coded defensively.
//   ⚠ Cross-epic deferred: reactivating a row that already has a BOOKING_CHARGE
//   collides with AD-8's partial-unique index. Resolve when Epic 5 lands cancel.
//   See deferred-work.md#AD-12.
//
// EPIC-4 SEAM: When Epic 4 (Story 4.1) lands, extend reserveSeat() in place:
//   add an `else` branch after the balance check / WalletInsufficientFundsError
//   catch to create a PENDING enrollment + Paystack hold. Do NOT create a
//   second reservation function.
//
// AD-2: import { db } from "@/lib/db" — never new PrismaClient().
// AD-9: all money is integer cents. No floats.

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { occupiedEnrollmentWhere } from "@/lib/class-occupancy";
import { mutate, WalletInsufficientFundsError } from "@/lib/wallet";

// ---------------------------------------------------------------------------
// Public result type
// ---------------------------------------------------------------------------

export type ReserveSeatResult =
  | { ok: true; enrollmentId: string }
  | {
      ok: false;
      reason:
        | "class_full"
        | "already_enrolled"
        | "insufficient_balance"
        | "not_available"
        | "error";
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
 * Reserve a seat in a group class from the student's wallet balance.
 *
 * This is the ONLY seat-reservation function in the app (AD-4). Epic 4 extends
 * it with the Paystack PENDING branch — do NOT create a second function.
 *
 * Control flow (ARCHITECTURE-SPINE "Seat-purchase control flow"):
 *
 *   SELECT … FOR UPDATE GroupSession(classId)      — belt-and-braces (AD-4)
 *   guard status=SCHEDULED AND start>now            — AC1/AC3; closes 3.3 deep-link deferral
 *   findUnique Enrollment(studentId, classId)
 *     non-cancelled → return already_enrolled       — FR11/AC2
 *     CANCELLED     → reactivate branch (AD-12; unreachable in 3.4)
 *   count occupied (occupiedEnrollmentWhere) < cap  — AD-5 under lock; SSI prevents oversell
 *     occupied >= cap → return class_full           — AC3
 *   create/reactivate Enrollment CONFIRMED, priceCents snapshot — AC1/AD-16
 *   wallet.mutate(tx, studentId, BOOKING_CHARGE, -priceCents, enrollmentId) — AD-6/8
 *     WalletInsufficientFundsError throws → tx rolls back → insufficient_balance
 *   → { ok: true, enrollmentId }
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

          // ── Step 3: Existing-enrollment check (AC2, FR11, AD-12) ─────────
          const existing = await tx.enrollment.findUnique({
            where: {
              studentId_groupSessionId: { studentId, groupSessionId: classId },
            },
            select: { id: true, status: true },
          });

          if (existing && existing.status !== "CANCELLED") {
            // Non-cancelled enrollment: PENDING/CONFIRMED/ATTENDED/NO_SHOW → reject (FR11/AC2).
            // @@unique is the DB backstop; this check is the in-transaction guard.
            return { ok: false as const, reason: "already_enrolled" as const };
          }

          // ── Step 4: Capacity check under the lock (AC3, AD-5) ────────────
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

          // ── Step 5: Create or reactivate enrollment as CONFIRMED ──────────
          // priceCents is snapshotted from the locked row (AD-16: immutable).
          // Enrollment is created BEFORE the charge so wallet.mutate() receives
          // the enrollmentId (AD-8: one BOOKING_CHARGE per enrollmentId).
          let enrollmentId: string;

          if (existing && existing.status === "CANCELLED") {
            // AD-12 reactivation branch — UNREACHABLE IN 3.4.
            // (No cancel flow exists until Epic 5. Coded defensively.)
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

          // ── Step 6: Charge via wallet.mutate (AD-6, AD-8, NFR4) ──────────
          // mutate() takes the per-student advisory lock, reads balance under lock,
          // guards non-negative (NFR4), and appends the immutable LedgerEntry.
          //
          // CRITICAL: If WalletInsufficientFundsError is thrown here, we do NOT
          // catch it inside this callback. It propagates OUT of the callback →
          // Prisma rolls back the entire Serializable tx → the enrollment row
          // created/updated in Step 5 is NOT persisted. The outer try/catch
          // catches it and returns { ok: false, reason: "insufficient_balance" }.
          //
          // (Catching inside and returning a value would commit the tx with an
          //  orphaned CONFIRMED enrollment and no BOOKING_CHARGE — data corruption.)
          await mutate(tx, studentId, {
            type: "BOOKING_CHARGE",
            amountCents: -cls.priceCents, // negative = debit (AD-9)
            enrollmentId,
          });

          return { ok: true as const, enrollmentId };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 5000, // ms to wait for a connection
          timeout: 15000, // ms for the tx to complete
        },
      );

      return result;
    } catch (err) {
      // ── WalletInsufficientFundsError: tx already rolled back (AC3) ───────
      if (err instanceof WalletInsufficientFundsError) {
        // The tx rolled back (Step 6 threw before commit). No enrollment row
        // was persisted. Return the discriminated result to the caller.
        return { ok: false, reason: "insufficient_balance" };
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
