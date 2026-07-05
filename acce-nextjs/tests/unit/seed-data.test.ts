/**
 * Story 1.4 AC4 — Seed dataset shape validation.
 *
 * Imports ONLY prisma/seed-data.ts (pure constants, no Prisma/db import).
 * This keeps the suite safe in the jsdom environment where DATABASE_URL is
 * not set and db.ts would throw at import time.
 *
 * Asserts:
 *   - 4 subjects with exact names
 *   - 2 canonical level values
 *   - 6 classes total
 *   - subject mix: 2 × Accounting, 2 × Tax, 1 × Auditing, 1 × Mgmt Acct & Finance
 *   - every class priceCents === 29000 (AD-9)
 *   - every class capacity in 4..6 (AC1)
 *   - every class level ∈ LEVELS
 *   - deterministic ids are unique across all 6 classes
 *   - computeStart / computeEnd produce sane future dates with 2 h duration
 */

import { describe, expect, it } from "vitest";
import {
  ADMIN_USER,
  CLASSES,
  LEVELS,
  SUBJECTS,
  computeEnd,
  computeStart,
} from "../../prisma/seed-data";

describe("seed-data constants — Story 1.4 AC1 / AC4", () => {
  // ── Subjects ────────────────────────────────────────────────────────────────

  describe("SUBJECTS", () => {
    it("has exactly 4 entries", () => {
      expect(SUBJECTS).toHaveLength(4);
    });

    it("contains exactly the required names", () => {
      expect(SUBJECTS).toContain("Accounting");
      expect(SUBJECTS).toContain("Management Accounting & Finance");
      expect(SUBJECTS).toContain("Auditing");
      expect(SUBJECTS).toContain("Tax");
    });
  });

  // ── Levels ──────────────────────────────────────────────────────────────────

  describe("LEVELS", () => {
    it("has exactly 2 entries", () => {
      expect(LEVELS).toHaveLength(2);
    });

    it("contains Undergrad and CTA/PGDA", () => {
      expect(LEVELS).toContain("Undergrad");
      expect(LEVELS).toContain("CTA/PGDA");
    });
  });

  // ── Admin user ───────────────────────────────────────────────────────────────

  describe("ADMIN_USER", () => {
    it("has a stable deterministic id", () => {
      expect(ADMIN_USER.id).toBe("seed-priyanka-admin");
    });

    it("is marked as ADMIN role", () => {
      expect(ADMIN_USER.role).toBe("ADMIN");
    });

    it("has emailVerified = true", () => {
      expect(ADMIN_USER.emailVerified).toBe(true);
    });

    it("has a non-empty email", () => {
      expect(typeof ADMIN_USER.email).toBe("string");
      expect(ADMIN_USER.email.length).toBeGreaterThan(0);
      expect(ADMIN_USER.email).toContain("@");
    });
  });

  // ── Classes ─────────────────────────────────────────────────────────────────

  describe("CLASSES", () => {
    it("has exactly 6 entries", () => {
      expect(CLASSES).toHaveLength(6);
    });

    it("subject mix: 2 × Accounting", () => {
      const count = CLASSES.filter((c) => c.subject === "Accounting").length;
      expect(count).toBe(2);
    });

    it("subject mix: 2 × Tax", () => {
      const count = CLASSES.filter((c) => c.subject === "Tax").length;
      expect(count).toBe(2);
    });

    it("subject mix: 1 × Auditing", () => {
      const count = CLASSES.filter((c) => c.subject === "Auditing").length;
      expect(count).toBe(1);
    });

    it("subject mix: 1 × Management Accounting & Finance", () => {
      const count = CLASSES.filter(
        (c) => c.subject === "Management Accounting & Finance"
      ).length;
      expect(count).toBe(1);
    });

    it("every class has priceCents === 29000 (AD-9: R290)", () => {
      CLASSES.forEach((c) => {
        expect(c.priceCents).toBe(29000);
      });
    });

    it("every class capacity is in range 4..6", () => {
      CLASSES.forEach((c) => {
        expect(c.capacity).toBeGreaterThanOrEqual(4);
        expect(c.capacity).toBeLessThanOrEqual(6);
      });
    });

    it("every class level is one of the canonical LEVELS values", () => {
      const levelSet = new Set<string>(LEVELS);
      CLASSES.forEach((c) => {
        expect(levelSet.has(c.level)).toBe(true);
      });
    });

    it("all class ids are unique (deterministic idempotency keys)", () => {
      const ids = CLASSES.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("all class ids are non-empty strings", () => {
      CLASSES.forEach((c) => {
        expect(typeof c.id).toBe("string");
        expect(c.id.length).toBeGreaterThan(0);
      });
    });

    it("all class subjects reference a known SUBJECT name", () => {
      const subjectSet = new Set<string>(SUBJECTS);
      CLASSES.forEach((c) => {
        expect(subjectSet.has(c.subject)).toBe(true);
      });
    });

    it("all class titles are non-empty", () => {
      CLASSES.forEach((c) => {
        expect(c.title.length).toBeGreaterThan(0);
      });
    });
  });

  // ── Date helpers ─────────────────────────────────────────────────────────────

  describe("computeStart / computeEnd", () => {
    it("computeStart returns a Date in the future relative to now", () => {
      const start = computeStart(7, 9);
      expect(start.getTime()).toBeGreaterThan(Date.now());
    });

    it("computeEnd returns start + exactly 2 hours", () => {
      const start = computeStart(7, 9);
      const end = computeEnd(start);
      const diffMs = end.getTime() - start.getTime();
      expect(diffMs).toBe(2 * 60 * 60 * 1000);
    });

    it("daysOffset correctly separates two class starts", () => {
      const start1 = computeStart(7, 9);
      const start2 = computeStart(10, 9);
      const diffDays =
        (start2.getTime() - start1.getTime()) / (24 * 60 * 60 * 1000);
      expect(diffDays).toBe(3);
    });
  });
});
