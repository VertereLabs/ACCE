-- ACCE Story 1.1 — Spine-driven schema deltas (AC3).
-- Applied after the init migration to complete the Phase 1a data model.
-- These are pure-constraint deltas on empty tables; no data migration needed.
--
-- Deltas (see ARCHITECTURE-SPINE):
--   1. GroupSession.updatedAt   — AD-16 optimistic-concurrency token
--   2. LedgerEntry partial index — AD-8 one BOOKING_CHARGE per enrollment (hand-added)
--   3. LedgerEntry.studentId FK — NFR5 referential integrity
--   4. Enrollment.paymentRef unique — AD-7 webhook→enrollment idempotency pin
--   (5. driverAdapters: Prisma 6.19.3 is GA; no schema change required)

-- ─────────────────────────────────────────────────────────────────────────────
-- Delta 1: GroupSession.updatedAt (AD-16)
-- ─────────────────────────────────────────────────────────────────────────────

-- AlterTable
ALTER TABLE "GroupSession" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- ─────────────────────────────────────────────────────────────────────────────
-- Delta 3: LedgerEntry.studentId → User FK (NFR5)
-- ─────────────────────────────────────────────────────────────────────────────

-- CreateIndex (FK backing index — NFR5)
CREATE INDEX "LedgerEntry_studentId_idx" ON "LedgerEntry"("studentId");

-- AddForeignKey (RESTRICT on delete — ledger rows must survive user deletion per AD-6)
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- Delta 4: Enrollment.paymentRef optional-unique (AD-7)
-- ─────────────────────────────────────────────────────────────────────────────

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_paymentRef_key" ON "Enrollment"("paymentRef");

-- ─────────────────────────────────────────────────────────────────────────────
-- Delta 2: Partial unique index — one BOOKING_CHARGE per enrollment (AD-8)
-- Hand-added: Prisma does not emit partial-unique indexes natively.
-- IMPORTANT: Do NOT remove — Epic 3/4 reserve-seat logic relies on this constraint.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE UNIQUE INDEX "LedgerEntry_enrollmentId_booking_charge_key"
  ON "LedgerEntry"("enrollmentId")
  WHERE "type" = 'BOOKING_CHARGE';
