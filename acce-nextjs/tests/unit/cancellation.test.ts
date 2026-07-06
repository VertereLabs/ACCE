/**
 * Story 5.1 AC5 — Unit tests for the pure AD-11 cancellation-tier module.
 *
 * Imports ONLY src/lib/cancellation.ts — a pure module with no db/Prisma
 * runtime dependency. Runs safely in jsdom without DATABASE_URL or a live DB.
 *
 * Tests:
 *   - CANCELLATION_TIERS: structure and pinned comparator values.
 *   - hoursUntilStart: epoch-ms arithmetic (tz-independent).
 *   - refundTierForHours: boundary behaviour at 48.0, 47.99, 24.0, 23.99, 0, −5.
 *   - computeRefund: decomposition invariant (refundCents + feeCents === priceCents),
 *     integer outputs, 100% and 0% edge cases, representative price 29000.
 */

import { describe, expect, it } from "vitest";
import {
  CANCELLATION_TIERS,
  hoursUntilStart,
  refundTierForHours,
  computeRefund,
} from "../../src/lib/cancellation";

// ---------------------------------------------------------------------------
// CANCELLATION_TIERS constant
// ---------------------------------------------------------------------------

describe("CANCELLATION_TIERS", () => {
  it("has exactly 3 tiers", () => {
    expect(CANCELLATION_TIERS).toHaveLength(3);
  });

  it("first tier is h ≥ 48 → 100%", () => {
    expect(CANCELLATION_TIERS[0].minHours).toBe(48);
    expect(CANCELLATION_TIERS[0].refundPct).toBe(100);
  });

  it("second tier is 24 ≤ h < 48 → 70%", () => {
    expect(CANCELLATION_TIERS[1].minHours).toBe(24);
    expect(CANCELLATION_TIERS[1].refundPct).toBe(70);
  });

  it("third tier (catch-all) is h < 24 → 0%", () => {
    expect(CANCELLATION_TIERS[2].minHours).toBe(0);
    expect(CANCELLATION_TIERS[2].refundPct).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// hoursUntilStart
// ---------------------------------------------------------------------------

describe("hoursUntilStart", () => {
  it("returns 48 exactly when start is 48 hours in the future", () => {
    const now = new Date("2026-07-10T10:00:00Z");
    const start = new Date("2026-07-12T10:00:00Z"); // exactly 48h later
    expect(hoursUntilStart(start, now)).toBe(48);
  });

  it("returns 0 when start equals now", () => {
    const now = new Date("2026-07-10T10:00:00Z");
    expect(hoursUntilStart(now, now)).toBe(0);
  });

  it("returns a negative value when start is in the past", () => {
    const now = new Date("2026-07-10T10:00:00Z");
    const start = new Date("2026-07-10T08:00:00Z"); // 2 hours ago
    expect(hoursUntilStart(start, now)).toBe(-2);
  });

  it("returns fractional hours correctly", () => {
    const now = new Date("2026-07-10T10:00:00Z");
    const start = new Date("2026-07-10T10:30:00Z"); // 0.5 hours
    expect(hoursUntilStart(start, now)).toBe(0.5);
  });

  it("is timezone-independent (uses epoch-ms difference)", () => {
    // Same instant expressed in two notations should give the same result.
    const now = new Date(1_000_000_000_000); // arbitrary epoch ms
    const start = new Date(1_000_000_000_000 + 24 * 3_600_000); // +24h in ms
    expect(hoursUntilStart(start, now)).toBe(24);
  });
});

// ---------------------------------------------------------------------------
// refundTierForHours — AC5 pinned boundary tests
// ---------------------------------------------------------------------------

describe("refundTierForHours", () => {
  it("48.0 → 100% (exactly at the 48h boundary)", () => {
    expect(refundTierForHours(48.0).refundPct).toBe(100);
  });

  it("47.99 → 70% (just below 48h boundary)", () => {
    expect(refundTierForHours(47.99).refundPct).toBe(70);
  });

  it("24.0 → 70% (exactly at the 24h boundary)", () => {
    expect(refundTierForHours(24.0).refundPct).toBe(70);
  });

  it("23.99 → 0% (just below 24h boundary)", () => {
    expect(refundTierForHours(23.99).refundPct).toBe(0);
  });

  it("0 → 0% (at exactly 0 hours)", () => {
    expect(refundTierForHours(0).refundPct).toBe(0);
  });

  it("−5 → 0% (negative hours — class already started)", () => {
    expect(refundTierForHours(-5).refundPct).toBe(0);
  });

  it("100 → 100% (well above 48h threshold)", () => {
    expect(refundTierForHours(100).refundPct).toBe(100);
  });

  it("returns a CancellationTier object (has minHours and refundPct)", () => {
    const tier = refundTierForHours(48);
    expect(tier).toHaveProperty("minHours");
    expect(tier).toHaveProperty("refundPct");
  });
});

// ---------------------------------------------------------------------------
// computeRefund — AC5 decomposition and invariant tests
// ---------------------------------------------------------------------------

describe("computeRefund", () => {
  // Price used for representative invariant tests: R290 = 29000 cents
  const PRICE = 29000;

  describe("100% tier (h ≥ 48)", () => {
    const result = computeRefund(PRICE, 48);

    it("refundPct is 100", () => {
      expect(result.refundPct).toBe(100);
    });

    it("refundCents equals priceCents (full refund)", () => {
      expect(result.refundCents).toBe(PRICE);
    });

    it("feeCents is 0 (no fee at 100%)", () => {
      expect(result.feeCents).toBe(0);
    });

    it("refundCents + feeCents === priceCents (decomposition invariant)", () => {
      expect(result.refundCents + result.feeCents).toBe(PRICE);
    });
  });

  describe("70% tier (24 ≤ h < 48)", () => {
    const result = computeRefund(PRICE, 24);

    it("refundPct is 70", () => {
      expect(result.refundPct).toBe(70);
    });

    it("refundCents is Math.round(29000 * 70 / 100) = 20300", () => {
      // 29000 * 0.70 = 20300 exactly (no rounding needed)
      expect(result.refundCents).toBe(20300);
    });

    it("feeCents is 29000 − 20300 = 8700", () => {
      expect(result.feeCents).toBe(8700);
    });

    it("refundCents + feeCents === priceCents (decomposition invariant)", () => {
      expect(result.refundCents + result.feeCents).toBe(PRICE);
    });
  });

  describe("0% tier (h < 24)", () => {
    const result = computeRefund(PRICE, 0);

    it("refundPct is 0", () => {
      expect(result.refundPct).toBe(0);
    });

    it("refundCents is 0 (no refund)", () => {
      expect(result.refundCents).toBe(0);
    });

    it("feeCents equals priceCents (full fee)", () => {
      expect(result.feeCents).toBe(PRICE);
    });

    it("refundCents + feeCents === priceCents (decomposition invariant)", () => {
      expect(result.refundCents + result.feeCents).toBe(PRICE);
    });
  });

  describe("integer output (AD-9 — no floats)", () => {
    it("outputs integer refundCents at 70% for prices that divide evenly", () => {
      // 29000 * 70 / 100 = 20300.0 (exact)
      const r = computeRefund(29000, 24);
      expect(Number.isInteger(r.refundCents)).toBe(true);
      expect(Number.isInteger(r.feeCents)).toBe(true);
    });

    it("Math.round applied: 100 cents * 70% = 70 (no float leak)", () => {
      // 100 * 70 / 100 = 70 (exact)
      const r = computeRefund(100, 24);
      expect(r.refundCents).toBe(70);
      expect(r.feeCents).toBe(30);
      expect(r.refundCents + r.feeCents).toBe(100);
    });

    it("rounding: 1 cent * 70% = 0.7 → rounds to 1 → feeCents = 0", () => {
      // Math.round(1 * 70 / 100) = Math.round(0.7) = 1
      const r = computeRefund(1, 24);
      expect(r.refundCents).toBe(1);
      expect(r.feeCents).toBe(0);
      expect(r.refundCents + r.feeCents).toBe(1);
    });

    it("rounding: 3 cents * 70% = 2.1 → rounds to 2 → feeCents = 1", () => {
      // Math.round(3 * 70 / 100) = Math.round(2.1) = 2
      const r = computeRefund(3, 24);
      expect(r.refundCents).toBe(2);
      expect(r.feeCents).toBe(1);
      expect(r.refundCents + r.feeCents).toBe(3);
    });
  });

  describe("negative hours (edge: class already started)", () => {
    it("negative hours → 0% tier → full fee", () => {
      const r = computeRefund(PRICE, -1);
      expect(r.refundPct).toBe(0);
      expect(r.refundCents).toBe(0);
      expect(r.feeCents).toBe(PRICE);
      expect(r.refundCents + r.feeCents).toBe(PRICE);
    });
  });

  describe("decomposition invariant holds for varied prices", () => {
    const prices = [1000, 5000, 29000, 50050, 100000];
    const hourCases = [0, 24, 48, 72];

    for (const price of prices) {
      for (const hours of hourCases) {
        it(`refundCents + feeCents === ${price} at ${hours}h`, () => {
          const r = computeRefund(price, hours);
          expect(r.refundCents + r.feeCents).toBe(price);
        });
      }
    }
  });
});
