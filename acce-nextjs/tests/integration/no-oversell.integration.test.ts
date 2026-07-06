// tests/integration/no-oversell.integration.test.ts — Story 4.3 (AC1–AC4).
//
// The AD-4-mandated real-Postgres no-oversell concurrency integration test.
//
// AD-4 mandate: "Verification MUST include a real-Postgres concurrency
// integration test (unit mocks can't exercise 40001)."
//
// What this suite proves (against a real live Postgres):
//   AC1a — N+1 concurrent reserveSeat on N-seat class, balance path:
//            exactly N "confirmed", 1 "class_full", N BOOKING_CHARGEs, occupancy=N
//   AC1b — N+1 concurrent reserveSeat on N-seat class, PENDING/Paystack path:
//            exactly N "pending_payment", 1 "class_full", 0 BOOKING_CHARGEs, occupancy=N
//   AC2  — confirmPaidSeat cannot oversell a refilled class; AD-15 CANCELLATION_REFUND
//   AC3a — idempotent confirmPaidSeat replay: exactly 1 Payment, 1 BOOKING_CHARGE (NFR3)
//   AC3b — FR11: second reserveSeat returns already_enrolled, no duplicate row/charge
//   AC3c — NFR4: R0-balance → PENDING (no charge); direct debit rollback → 0 ledger rows
//
// Sandbox posture (AC4, AC5):
//   DATABASE_URL unset → entire suite skips cleanly (describe.skipIf).
//   `npm test` (jsdom unit run) NEVER collects this file.
//   `npm run test:integration` runs this file; skips when DATABASE_URL is unset.
//   Live green run is deferred to CI ephemeral-Postgres (see deferred-work.md).
//
// Test data: all ids prefixed `it43-`, fully torn down in afterAll.
// AD-2: dynamic import of @/lib/db (and modules that import it) is performed
//       inside beforeAll — AFTER the skip guard — so db.ts is never loaded
//       when DATABASE_URL is unset.
// AD-13: no new runtime dependency. Uses existing vitest, @prisma/adapter-pg, pg.

import { occupiedEnrollmentWhere } from "@/lib/class-occupancy"; // no db import — safe
import { hasDb } from "./helpers";

// ── Constants ────────────────────────────────────────────────────────────────

/** Capacity for the concurrent race. N+1 callers race for N seats. */
const N = 2;

/** Price per class in integer cents (AD-9). R100 = fast test, no floats. */
const PRICE_CENTS = 10_000;

/** Shared test Subject id. Created in beforeAll, destroyed in afterAll. */
const SUBJ_ID = "it43-subject-1";

// ── Accumulated test-data IDs for FK-safe afterAll teardown ─────────────────
const allStudentIds: string[] = [];
const allClassIds: string[] = [];
const allPaymentRefs: string[] = [];

// ── Skip-gated integration suite ─────────────────────────────────────────────
// describe.skipIf(!hasDb()) is evaluated at module-load time. When DATABASE_URL
// is unset, the entire suite (including beforeAll/afterAll hooks) is skipped —
// no db import is ever triggered. When DATABASE_URL is set, beforeAll runs
// the dynamic imports (after the guard) per AD-2.

describe.skipIf(!hasDb())(
  "no-oversell integration suite (real Postgres, AD-4)",
  () => {
    // Module refs — populated by dynamic imports in beforeAll.
    // Type annotations only (no runtime imports at module scope — AD-2 guard).
    let db: Awaited<typeof import("@/lib/db")>["db"];
    let reserveSeat: typeof import("@/lib/enrollment")["reserveSeat"];
    let confirmPaidSeat: typeof import("@/lib/enrollment")["confirmPaidSeat"];
    let mutate: typeof import("@/lib/wallet")["mutate"];
    let WalletInsufficientFundsError: typeof import("@/lib/wallet")["WalletInsufficientFundsError"];

    // ── Seed helpers (available after beforeAll) ──────────────────────────────

    /** Create a test User (STUDENT) with a deterministic id. */
    async function mkStudent(scope: string, index: number): Promise<string> {
      const id = `it43-${scope}-${index}`;
      await db.user.create({
        data: {
          id,
          name: `IT43 ${scope} ${index}`,
          email: `it43-${scope}-${index}@test.local`,
          emailVerified: true,
          role: "STUDENT",
        },
      });
      allStudentIds.push(id);
      return id;
    }

    /**
     * Create a SCHEDULED GroupSession 2 hours in the future.
     * Capacity and priceCents are parameterised; other fields are fixed test values.
     */
    async function mkClass(scope: string, capacity: number): Promise<string> {
      const id = `it43-cls-${scope}`;
      const start = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 h from now
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
      await db.groupSession.create({
        data: {
          id,
          subjectId: SUBJ_ID,
          level: "CTA/PGDA",
          title: `IT43 Class ${scope}`,
          start,
          end,
          capacity,
          priceCents: PRICE_CENTS,
          status: "SCHEDULED",
          mode: "ONLINE",
        },
      });
      allClassIds.push(id);
      return id;
    }

    /**
     * Fund a student's wallet with a TOPUP credit.
     * Uses wallet.mutate inside a db.$transaction per AD-6.
     */
    async function fund(studentId: string, amountCents: number): Promise<void> {
      await db.$transaction((tx) =>
        mutate(tx, studentId, { type: "TOPUP", amountCents }),
      );
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    beforeAll(async () => {
      // Dynamic imports AFTER the DATABASE_URL skip guard (AD-2).
      // db.ts throws on missing DATABASE_URL — never load it at module scope.
      ({ db } = await import("@/lib/db"));
      ({ reserveSeat, confirmPaidSeat } = await import("@/lib/enrollment"));
      ({ mutate, WalletInsufficientFundsError } = await import("@/lib/wallet"));

      // Shared Subject (FK parent for all test GroupSessions).
      // upsert is idempotent across re-runs if a prior teardown was incomplete.
      await db.subject.upsert({
        where: { id: SUBJ_ID },
        create: { id: SUBJ_ID, name: "IT43 Test Subject" },
        update: {},
      });
    });

    afterAll(async () => {
      if (!db) return; // safety: beforeAll may not have run (e.g., import error)

      // FK-safe teardown order (mirrors global-setup.ts finally block):
      //   LedgerEntry → Payment → Enrollment → GroupSession → User → Subject
      // LedgerEntry.enrollmentId has no Prisma FK relation, so order is safe.
      if (allStudentIds.length > 0) {
        await db.ledgerEntry.deleteMany({
          where: { studentId: { in: allStudentIds } },
        });
      }
      if (allPaymentRefs.length > 0) {
        await db.payment.deleteMany({
          where: { reference: { in: allPaymentRefs } },
        });
      }
      if (allClassIds.length > 0) {
        await db.enrollment.deleteMany({
          where: { groupSessionId: { in: allClassIds } },
        });
        await db.groupSession.deleteMany({
          where: { id: { in: allClassIds } },
        });
      }
      if (allStudentIds.length > 0) {
        await db.user.deleteMany({ where: { id: { in: allStudentIds } } });
      }
      // Subject last (FK parent of GroupSession).
      await db.subject.deleteMany({ where: { id: SUBJ_ID } });

      // Close the pg Pool so the process does not hang (mirrors global-setup.ts finally).
      await db.$disconnect();
    });

    // ── AC1a: N+1 concurrent reserveSeat — balance path ──────────────────────
    //
    // N+1 funded students race for an N-seat class. Exactly N win (CONFIRMED),
    // exactly 1 loses (class_full). Occupancy = N. BOOKING_CHARGEs = N (AD-8).

    it(
      "AC1a: balance path — exactly N confirmed, 1 class_full, N BOOKING_CHARGEs, occupancy=N",
      async () => {
        const classId = await mkClass("ac1b", N);
        const students = await Promise.all(
          Array.from({ length: N + 1 }, (_, i) => mkStudent("ac1b", i)),
        );

        // Fund every student with exactly PRICE_CENTS — balance path.
        for (const s of students) await fund(s, PRICE_CENTS);

        // Fire N+1 concurrent reserveSeat calls (genuine Promise.all race).
        const results = await Promise.all(
          students.map((s) => reserveSeat(s, classId)),
        );

        const confirmed = results.filter(
          (r) => r.ok === true && (r as { outcome: string }).outcome === "confirmed",
        );
        const full = results.filter(
          (r) => r.ok === false && (r as { reason: string }).reason === "class_full",
        );

        // Exactly N winners, exactly 1 loser (after SSI retry).
        expect(confirmed.length).toBe(N);
        expect(full.length).toBe(1);

        // Occupancy re-count via occupiedEnrollmentWhere (AD-5 single predicate).
        const occupancy = await db.enrollment.count({
          where: {
            groupSessionId: classId,
            ...occupiedEnrollmentWhere(new Date()),
          },
        });
        expect(occupancy).toBe(N);

        // Exactly N BOOKING_CHARGEs — one per confirmed enrollment (AD-8).
        const confirmedEnrollmentIds = confirmed.map(
          (r) => (r as { enrollmentId: string }).enrollmentId,
        );
        const charges = await db.ledgerEntry.count({
          where: { type: "BOOKING_CHARGE", enrollmentId: { in: confirmedEnrollmentIds } },
        });
        expect(charges).toBe(N);
      },
    );

    // ── AC1b: N+1 concurrent reserveSeat — PENDING/Paystack path ─────────────
    //
    // N+1 students at R0 balance race for an N-seat class. Exactly N win
    // (pending_payment holds), exactly 1 loses (class_full). Occupancy = N.
    // Zero BOOKING_CHARGEs (AD-7 — PENDING path writes no charge).

    it(
      "AC1b: PENDING path — exactly N pending_payment, 1 class_full, 0 BOOKING_CHARGEs, occupancy=N",
      async () => {
        const classId = await mkClass("ac1p", N);
        const students = await Promise.all(
          Array.from({ length: N + 1 }, (_, i) => mkStudent("ac1p", i)),
        );

        // No wallet funding — all students at R0 → PENDING path.
        const results = await Promise.all(
          students.map((s) => reserveSeat(s, classId)),
        );

        const pending = results.filter(
          (r) =>
            r.ok === true &&
            (r as { outcome: string }).outcome === "pending_payment",
        );
        const full = results.filter(
          (r) =>
            r.ok === false &&
            (r as { reason: string }).reason === "class_full",
        );

        expect(pending.length).toBe(N);
        expect(full.length).toBe(1);

        const occupancy = await db.enrollment.count({
          where: {
            groupSessionId: classId,
            ...occupiedEnrollmentWhere(new Date()),
          },
        });
        expect(occupancy).toBe(N);

        // Zero BOOKING_CHARGEs — PENDING holds do not charge (AD-7/AD-8).
        const pendingEnrollmentIds = pending.map(
          (r) => (r as { enrollmentId: string }).enrollmentId,
        );
        const charges = await db.ledgerEntry.count({
          where: {
            type: "BOOKING_CHARGE",
            enrollmentId: { in: pendingEnrollmentIds },
          },
        });
        expect(charges).toBe(0);
      },
    );

    // ── AC2: confirmPaidSeat cannot oversell a refilled class (AD-15) ─────────
    //
    // Class is at capacity (N CONFIRMED). An extra student holds a PENDING
    // enrollment on the same class (directly inserted to bypass the capacity
    // check — test-setup only). confirmPaidSeat sees others_occupied=N >= capacity
    // and conserves the captured amount as a CANCELLATION_REFUND (AD-15).

    it(
      "AC2: confirmPaidSeat refunds when class is full — no oversell, AD-15 CANCELLATION_REFUND",
      async () => {
        const classId = await mkClass("ac2", N);

        // Fill class: N funded students → N CONFIRMED enrollments.
        const confirmedStudents = await Promise.all(
          Array.from({ length: N }, (_, i) => mkStudent("ac2c", i)),
        );
        for (const s of confirmedStudents) await fund(s, PRICE_CENTS);
        await Promise.all(confirmedStudents.map((s) => reserveSeat(s, classId)));

        // Extra student: direct PENDING enrollment insert (test setup, bypasses
        // capacity check to put a PENDING hold on a full class). This is the
        // "force it past capacity (its own row is the N+1th)" scenario.
        const extraStudentId = await mkStudent("ac2e", 0);
        const extraPaymentRef = `it43-ac2-ref-${Date.now()}`;
        allPaymentRefs.push(extraPaymentRef);

        await db.enrollment.create({
          data: {
            studentId: extraStudentId,
            groupSessionId: classId,
            status: "PENDING",
            priceCents: PRICE_CENTS,
            pendingExpiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min hold
            paymentRef: extraPaymentRef,
          },
        });

        // confirmPaidSeat: Payment gate passes → find PENDING enrollment →
        // lock GroupSession → others_occupied=N (N CONFIRMED, excl. own row) >=
        // capacity=N → decideConfirmOutcome → refund_to_wallet (AD-15).
        const result = await confirmPaidSeat({
          reference: extraPaymentRef,
          amountCents: PRICE_CENTS,
          status: "success",
          type: "charge.success",
          raw: {},
        });

        expect(result).toEqual({ ok: true, outcome: "refunded_to_wallet" });

        // Extra student wallet: CANCELLATION_REFUND = PRICE_CENTS credited.
        const refundEntry = await db.ledgerEntry.findFirst({
          where: { studentId: extraStudentId, type: "CANCELLATION_REFUND" },
        });
        expect(refundEntry).toBeTruthy();
        expect(refundEntry!.amountCents).toBe(PRICE_CENTS);

        // Extra student enrollment flipped to CANCELLED (AD-14 sole status writer).
        const enr = await db.enrollment.findFirst({
          where: { studentId: extraStudentId, groupSessionId: classId },
        });
        expect(enr?.status).toBe("CANCELLED");

        // Class is NOT oversold — occupancy stays at N.
        const occupancy = await db.enrollment.count({
          where: {
            groupSessionId: classId,
            ...occupiedEnrollmentWhere(new Date()),
          },
        });
        expect(occupancy).toBe(N);
      },
    );

    // ── AC3(a): Idempotent confirmPaidSeat replay (NFR3) ─────────────────────
    //
    // Same reference delivered twice → exactly one Payment, one BOOKING_CHARGE,
    // enrollment CONFIRMED once. Second delivery → already_processed.

    it(
      "AC3a: idempotent confirmPaidSeat replay — 1 Payment + 1 BOOKING_CHARGE, both ok:true (NFR3)",
      async () => {
        const classId = await mkClass("ac3a", 3); // plenty of seats
        const student = await mkStudent("ac3a", 0);
        // R0 balance → PENDING hold (no charge at reserve time — AD-7).
        const reserveResult = await reserveSeat(student, classId);
        expect(reserveResult.ok).toBe(true);
        expect((reserveResult as { outcome: string }).outcome).toBe("pending_payment");

        const { paymentRef } = reserveResult as { paymentRef: string };
        allPaymentRefs.push(paymentRef);

        const confirmArgs = {
          reference: paymentRef,
          amountCents: PRICE_CENTS,
          status: "success",
          type: "charge.success",
          raw: {},
        };

        // First delivery — confirms the seat.
        const r1 = await confirmPaidSeat(confirmArgs);
        expect(r1).toEqual({ ok: true, outcome: "confirmed" });

        // Second delivery (same reference) — idempotency gate: P2002 → already_processed.
        const r2 = await confirmPaidSeat(confirmArgs);
        expect(r2).toEqual({ ok: true, outcome: "already_processed" });

        // Exactly one Payment row (unique-insert idempotency gate — NFR3).
        const paymentCount = await db.payment.count({ where: { reference: paymentRef } });
        expect(paymentCount).toBe(1);

        // Exactly one BOOKING_CHARGE (AD-8 — one per confirmed enrollment).
        const chargeCount = await db.ledgerEntry.count({
          where: { type: "BOOKING_CHARGE", studentId: student },
        });
        expect(chargeCount).toBe(1);

        // Enrollment is CONFIRMED.
        const enr = await db.enrollment.findFirst({
          where: { studentId: student, groupSessionId: classId },
        });
        expect(enr?.status).toBe("CONFIRMED");
      },
    );

    // ── AC3(b): FR11 — already_enrolled (no duplicate row/charge) ────────────
    //
    // A funded student reserves once (CONFIRMED), then reserves the same class
    // again. Second call → already_enrolled; no second Enrollment row; no second charge.

    it(
      "AC3b: FR11 — second reserveSeat returns already_enrolled, no duplicate row or charge",
      async () => {
        const classId = await mkClass("ac3b", 3);
        const student = await mkStudent("ac3b", 0);
        await fund(student, PRICE_CENTS * 2); // double-fund to rule out balance as the differentiator

        // First reserve → CONFIRMED.
        const r1 = await reserveSeat(student, classId);
        expect(r1).toMatchObject({ ok: true, outcome: "confirmed" });

        // Second reserve → already_enrolled (FR11).
        const r2 = await reserveSeat(student, classId);
        expect(r2).toEqual({ ok: false, reason: "already_enrolled" });

        // Exactly one Enrollment row.
        const enrollmentCount = await db.enrollment.count({
          where: { studentId: student, groupSessionId: classId },
        });
        expect(enrollmentCount).toBe(1);

        // Exactly one BOOKING_CHARGE — no duplicate charge on the second call.
        const chargeCount = await db.ledgerEntry.count({
          where: { type: "BOOKING_CHARGE", studentId: student },
        });
        expect(chargeCount).toBe(1);
      },
    );

    // ── AC3(c): NFR4 — insufficient-balance rollback + PENDING outcome ────────
    //
    // (i)  R0-balance student reserves a seat → PENDING outcome (no BOOKING_CHARGE).
    // (ii) A direct wallet.mutate debit beyond balance inside a $transaction throws
    //      WalletInsufficientFundsError; the tx rolls back; zero ledger rows written.

    it(
      "AC3c: NFR4 — R0-balance → PENDING (no charge); direct debit rollback writes zero ledger rows",
      async () => {
        const classId = await mkClass("ac3c", 3);
        const student = await mkStudent("ac3c", 0);
        // R0 balance — no funding.

        // (i) reserveSeat → PENDING (balance < priceCents → PENDING path).
        const r = await reserveSeat(student, classId);
        expect(r).toMatchObject({ ok: true, outcome: "pending_payment" });

        // PENDING path writes NO BOOKING_CHARGE (AD-7).
        const chargesAfterPending = await db.ledgerEntry.count({
          where: { type: "BOOKING_CHARGE", studentId: student },
        });
        expect(chargesAfterPending).toBe(0);

        // (ii) Direct debit attempt: wallet.mutate with -PRICE_CENTS on R0 balance
        // → WalletInsufficientFundsError → $transaction rolls back → 0 ledger rows.
        await expect(
          db.$transaction(async (tx) => {
            // amountCents negative = debit; NFR4 guard fires when result < 0.
            await mutate(tx, student, {
              type: "BOOKING_CHARGE",
              amountCents: -PRICE_CENTS,
            });
          }),
        ).rejects.toThrow(WalletInsufficientFundsError);

        // Transaction was rolled back — zero ledger rows persisted.
        const totalEntries = await db.ledgerEntry.count({
          where: { studentId: student },
        });
        expect(totalEntries).toBe(0);
      },
    );
  },
);
