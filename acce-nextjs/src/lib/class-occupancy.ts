// class-occupancy.ts — Story 2.2 (AC3, AC5).
// Pure, db-free helpers that encode the AD-5 occupancy definition.
//
// AD-5 rule: occupied = count(Enrollment where status ∈ {PENDING, CONFIRMED}
//   AND (pendingExpiresAt IS NULL OR pendingExpiresAt > now)).
// seatsLeft = max(0, capacity − occupied).
// Readers NEVER write — the lazy PENDING→CANCELLED flip belongs only inside a
// locked mutation in enrollment.ts (future epic).
//
// This module is the SINGLE source of the AD-5 occupancy predicate.
// Epic 3's portal browse (Story 3.2 "N seats left") will import it too.
//
// No PrismaClient runtime import here — only a type-only import so vitest
// (jsdom) can load this file without DATABASE_URL or a live DB.

import type { Prisma } from "@prisma/client";

/**
 * Returns the Prisma relation-filter that identifies an OCCUPYING enrollment
 * per AD-5:
 *   status ∈ {PENDING, CONFIRMED}
 *   AND (pendingExpiresAt IS NULL OR pendingExpiresAt > now)
 *
 * Pass the result to a filtered `_count` on `GroupSession.enrollments` so the
 * count runs in the DB without loading enrollment rows (no N+1).
 *
 * @param now - the instant to use as the expiry threshold (compute ONCE per
 *   request, outside the query builder, to avoid per-row evaluation drift).
 */
export function occupiedEnrollmentWhere(now: Date): Prisma.EnrollmentWhereInput {
  return {
    status: { in: ["PENDING", "CONFIRMED"] },
    OR: [
      { pendingExpiresAt: null },
      { pendingExpiresAt: { gt: now } },
    ],
  };
}

/**
 * Computes seats remaining, clamped to zero.
 * Never returns a negative number even when `occupied` exceeds `capacity`
 * (a guard against race conditions that this read path does not resolve).
 *
 * @param capacity - total seats in the session
 * @param occupied - count of occupying (PENDING/CONFIRMED, unexpired) enrollments
 */
export function computeSeatsLeft(capacity: number, occupied: number): number {
  return Math.max(0, capacity - occupied);
}
