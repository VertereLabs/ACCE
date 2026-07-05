/**
 * Story 2.2 AC3, AC5 — Unit tests for the pure AD-5 occupancy helpers.
 *
 * Imports ONLY src/lib/class-occupancy.ts — a pure module with no db/Prisma
 * runtime dependency. Runs safely in jsdom without DATABASE_URL or a live DB.
 *
 * Tests:
 *   - occupiedEnrollmentWhere: shape of the Prisma relation-filter (status.in,
 *     OR clause covering null and gt-now, exclusion of non-occupying statuses).
 *   - computeSeatsLeft: arithmetic, zero-clamp, never-negative.
 */

import { describe, expect, it } from "vitest";
import {
  occupiedEnrollmentWhere,
  computeSeatsLeft,
} from "../../src/lib/class-occupancy";

// ---------------------------------------------------------------------------
// occupiedEnrollmentWhere
// ---------------------------------------------------------------------------

describe("occupiedEnrollmentWhere", () => {
  const now = new Date("2026-07-06T00:00:00Z");
  const filter = occupiedEnrollmentWhere(now);

  describe("status filter", () => {
    it("contains exactly PENDING and CONFIRMED", () => {
      const statusFilter = filter.status as { in: string[] };
      expect(statusFilter.in).toContain("PENDING");
      expect(statusFilter.in).toContain("CONFIRMED");
      expect(statusFilter.in).toHaveLength(2);
    });

    it("does NOT include CANCELLED", () => {
      const statusFilter = filter.status as { in: string[] };
      expect(statusFilter.in).not.toContain("CANCELLED");
    });

    it("does NOT include ATTENDED", () => {
      const statusFilter = filter.status as { in: string[] };
      expect(statusFilter.in).not.toContain("ATTENDED");
    });

    it("does NOT include NO_SHOW", () => {
      const statusFilter = filter.status as { in: string[] };
      expect(statusFilter.in).not.toContain("NO_SHOW");
    });
  });

  describe("OR clause (pendingExpiresAt)", () => {
    it("has exactly 2 OR branches", () => {
      expect(Array.isArray(filter.OR)).toBe(true);
      expect((filter.OR as unknown[]).length).toBe(2);
    });

    it("one branch accepts null pendingExpiresAt (no expiry = still holds seat)", () => {
      const orClauses = filter.OR as Array<Record<string, unknown>>;
      const nullBranch = orClauses.find(
        (c) => c.pendingExpiresAt === null,
      );
      expect(nullBranch).toBeDefined();
    });

    it("one branch accepts pendingExpiresAt > now (hold not yet expired)", () => {
      const orClauses = filter.OR as Array<Record<string, unknown>>;
      const gtBranch = orClauses.find(
        (c) =>
          c.pendingExpiresAt !== null &&
          typeof c.pendingExpiresAt === "object" &&
          (c.pendingExpiresAt as Record<string, unknown>).gt instanceof Date,
      );
      expect(gtBranch).toBeDefined();
      const gtDate = (
        (gtBranch as Record<string, unknown>).pendingExpiresAt as Record<
          string,
          unknown
        >
      ).gt as Date;
      expect(gtDate).toEqual(now);
    });

    it("expired PENDING (pendingExpiresAt <= now) is excluded by construction", () => {
      // The filter only allows null OR > now.
      // An expired hold has pendingExpiresAt <= now — it matches neither branch,
      // so it is excluded from the _count without any UPDATE being issued.
      const orClauses = filter.OR as Array<Record<string, unknown>>;
      // Confirm there is no `lte`/`lt`/`gte` branch that would count expired holds.
      const hasLteBranch = orClauses.some((c) => {
        const pea = c.pendingExpiresAt as Record<string, unknown> | null;
        return pea !== null && typeof pea === "object" && ("lte" in pea || "lt" in pea);
      });
      expect(hasLteBranch).toBe(false);
    });
  });

  it("passes the exact `now` Date into the gt threshold", () => {
    const specificNow = new Date("2026-12-25T12:00:00Z");
    const specificFilter = occupiedEnrollmentWhere(specificNow);
    const orClauses = specificFilter.OR as Array<Record<string, unknown>>;
    const gtBranch = orClauses.find(
      (c) =>
        c.pendingExpiresAt !== null &&
        typeof c.pendingExpiresAt === "object",
    ) as Record<string, unknown> | undefined;
    expect(gtBranch).toBeDefined();
    const gtDate = (gtBranch!.pendingExpiresAt as Record<string, unknown>).gt;
    expect(gtDate).toBe(specificNow);
  });
});

// ---------------------------------------------------------------------------
// computeSeatsLeft
// ---------------------------------------------------------------------------

describe("computeSeatsLeft", () => {
  it("returns capacity - occupied when occupied < capacity", () => {
    expect(computeSeatsLeft(6, 2)).toBe(4);
  });

  it("returns 0 when fully booked (occupied === capacity)", () => {
    expect(computeSeatsLeft(4, 4)).toBe(0);
  });

  it("clamps to 0 when occupied exceeds capacity (never returns negative)", () => {
    expect(computeSeatsLeft(4, 5)).toBe(0);
  });

  it("returns full capacity when no enrollments", () => {
    expect(computeSeatsLeft(6, 0)).toBe(6);
  });
});
