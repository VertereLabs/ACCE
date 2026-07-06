/**
 * Story 3.1 AC3/AC5 — Unit tests for pure wallet arithmetic helpers.
 *
 * Imports ONLY src/lib/wallet-math.ts — a pure module with no db/Prisma
 * runtime dependency. Runs safely in jsdom without DATABASE_URL or a live DB.
 *
 * Tests cover:
 *   - sumLedgerAmounts: empty array, mixed-sign rows.
 *   - computeBalanceAfter: basic deduction, basic credit.
 *   - wouldGoNegative: exact-zero allowed (NFR4 edge), insufficient rejected,
 *     credit always allowed.
 */

import { describe, expect, it } from "vitest";
import {
  sumLedgerAmounts,
  computeBalanceAfter,
  wouldGoNegative,
} from "../../src/lib/wallet-math";

// ---------------------------------------------------------------------------
// sumLedgerAmounts (AD-6 balance definition — in-memory slice)
// ---------------------------------------------------------------------------

describe("sumLedgerAmounts", () => {
  it("returns 0 for an empty entry list", () => {
    expect(sumLedgerAmounts([])).toBe(0);
  });

  it("sums a single positive amount", () => {
    expect(sumLedgerAmounts([{ amountCents: 50000 }])).toBe(50000);
  });

  it("sums a single negative amount", () => {
    expect(sumLedgerAmounts([{ amountCents: -29000 }])).toBe(-29000);
  });

  it("sums mixed positive and negative amounts", () => {
    // 50000 credit − 29000 charge = 21000
    expect(
      sumLedgerAmounts([{ amountCents: 50000 }, { amountCents: -29000 }]),
    ).toBe(21000);
  });

  it("sums multiple rows correctly (story sample: purchase + 2 bookings + topup)", () => {
    const entries = [
      { amountCents: 100000 }, // package purchase
      { amountCents: -29000 }, // booking charge 1
      { amountCents: -29000 }, // booking charge 2
      { amountCents: 20000 }, // top-up
    ];
    expect(sumLedgerAmounts(entries)).toBe(62000);
  });
});

// ---------------------------------------------------------------------------
// computeBalanceAfter (used by mutate() under advisory lock, AD-6)
// ---------------------------------------------------------------------------

describe("computeBalanceAfter", () => {
  it("computes balance after a partial deduction: 50000 − 29000 = 21000", () => {
    expect(computeBalanceAfter(50000, -29000)).toBe(21000);
  });

  it("computes balance after a credit: 0 + 50000 = 50000", () => {
    expect(computeBalanceAfter(0, 50000)).toBe(50000);
  });

  it("computes exact spend-down to zero: 29000 − 29000 = 0", () => {
    expect(computeBalanceAfter(29000, -29000)).toBe(0);
  });

  it("computes balance that would go below zero: 28900 − 29000 = −100", () => {
    // This result feeds wouldGoNegative() — the negative value itself is correct
    // arithmetic; the guard function rejects the operation.
    expect(computeBalanceAfter(28900, -29000)).toBe(-100);
  });

  it("adds two credits: 50000 + 30000 = 80000", () => {
    expect(computeBalanceAfter(50000, 30000)).toBe(80000);
  });
});

// ---------------------------------------------------------------------------
// wouldGoNegative (NFR4 guard predicate)
// ---------------------------------------------------------------------------

describe("wouldGoNegative", () => {
  it("returns false when balance is exactly sufficient (spend-down to zero allowed)", () => {
    // 29000 − 29000 = 0 → NOT negative → allowed (NFR4: exact zero is fine)
    expect(wouldGoNegative(29000, -29000)).toBe(false);
  });

  it("returns true when balance is insufficient (NFR4 rejection case)", () => {
    // 28900 − 29000 = −100 → negative → rejected
    expect(wouldGoNegative(28900, -29000)).toBe(true);
  });

  it("returns false for a credit (adding funds never goes negative)", () => {
    // 0 + 50000 = 50000 → fine
    expect(wouldGoNegative(0, 50000)).toBe(false);
  });

  it("returns false when deducting from a large balance", () => {
    expect(wouldGoNegative(100000, -29000)).toBe(false);
  });

  it("returns true when balance is zero and a charge is attempted", () => {
    // 0 − 1 = −1 → rejected
    expect(wouldGoNegative(0, -1)).toBe(true);
  });

  it("returns false for a zero-amount mutation (no-op) at any balance", () => {
    // 0 + 0 = 0 → exactly zero → allowed (degenerate no-op case)
    expect(wouldGoNegative(0, 0)).toBe(false);
  });
});
