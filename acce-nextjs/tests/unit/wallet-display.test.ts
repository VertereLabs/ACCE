/**
 * Story 3.1 AC5 — Unit tests for pure wallet display-formatting helpers.
 *
 * Imports ONLY src/lib/wallet-display.ts — a pure module with no db/Prisma
 * runtime dependency. Runs safely in jsdom without DATABASE_URL or a live DB.
 *
 * Tests cover:
 *   - formatSignedZar: negative, positive, and zero cases; sign character pinned.
 *   - formatLedgerType: exhaustive — every LedgerType enum value is tested.
 *
 * IMPORTANT: The minus sign in the negative-amount test is U+2212 (MINUS SIGN),
 * NOT U+002D (HYPHEN-MINUS). This matches the implementation in wallet-display.ts.
 * Verify your editor/clipboard uses the correct Unicode point when editing.
 */

import { describe, expect, it } from "vitest";
import { formatSignedZar, formatLedgerType } from "../../src/lib/wallet-display";

// ---------------------------------------------------------------------------
// formatSignedZar (AD-9 signed Rand — ledger amount column)
// ---------------------------------------------------------------------------

describe("formatSignedZar", () => {
  it('formats a negative amount as "−R290.00" (U+2212 MINUS SIGN)', () => {
    // Pins the exact sign character — U+2212, not ASCII hyphen U+002D.
    expect(formatSignedZar(-29000)).toBe("−R290.00");
  });

  it('formats a positive amount as "+R500.00"', () => {
    expect(formatSignedZar(50000)).toBe("+R500.00");
  });

  it('formats zero as "R0.00" (no sign prefix for zero)', () => {
    expect(formatSignedZar(0)).toBe("R0.00");
  });

  it("formats a small negative amount correctly (−R0.01)", () => {
    expect(formatSignedZar(-1)).toBe("−R0.01");
  });

  it("formats a small positive amount correctly (+R0.01)", () => {
    expect(formatSignedZar(1)).toBe("+R0.01");
  });

  it("formats a large credit correctly (+R1000.00)", () => {
    expect(formatSignedZar(100000)).toBe("+R1000.00");
  });
});

// ---------------------------------------------------------------------------
// formatLedgerType (exhaustive over every LedgerType enum value)
// ---------------------------------------------------------------------------

describe("formatLedgerType", () => {
  it('maps BOOKING_CHARGE to "Class booking"', () => {
    expect(formatLedgerType("BOOKING_CHARGE")).toBe("Class booking");
  });

  it('maps CANCELLATION_REFUND to "Refund"', () => {
    expect(formatLedgerType("CANCELLATION_REFUND")).toBe("Refund");
  });

  it('maps CANCELLATION_FEE to "Cancellation fee"', () => {
    expect(formatLedgerType("CANCELLATION_FEE")).toBe("Cancellation fee");
  });

  it('maps ADJUSTMENT to "Adjustment"', () => {
    expect(formatLedgerType("ADJUSTMENT")).toBe("Adjustment");
  });

  it('maps TOPUP to "Top-up"', () => {
    expect(formatLedgerType("TOPUP")).toBe("Top-up");
  });

  it('maps PACKAGE_PURCHASE to "Package purchase"', () => {
    expect(formatLedgerType("PACKAGE_PURCHASE")).toBe("Package purchase");
  });

  it('maps WITHDRAWAL to "Withdrawal"', () => {
    expect(formatLedgerType("WITHDRAWAL")).toBe("Withdrawal");
  });
});
