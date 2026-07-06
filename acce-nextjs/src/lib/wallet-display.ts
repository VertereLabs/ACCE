// wallet-display.ts — Story 3.1 (AC1, AC2, AC5).
// Pure, db-free display-formatting helpers for the student wallet UI.
//
// AD-9 rule: money is stored as integer cents (ZAR); format to Rand ONLY at the
// UI edge. This is the wallet-specific edge formatter — analogous to class-display.ts
// (formatZar) for the admin class list.
//
// Two helpers:
//   - formatSignedZar: signed Rand string for ledger amounts (positive credit,
//     negative charge). Reuses formatZar from class-display.ts for the R/toFixed logic.
//   - formatLedgerType: human-readable label for every LedgerType enum value.
//     Exhaustive switch so tsc catches any future enum extension.
//
// No PrismaClient runtime import — type-only import of LedgerType so vitest (jsdom)
// loads this file without DATABASE_URL or a live DB.

import type { LedgerType } from "@prisma/client";
import { formatZar } from "@/lib/class-display";

/**
 * Format a signed integer cents value as a Rand string at the UI edge (AD-9).
 *
 * Signs:
 *   negative  → "−R290.00"  (minus sign U+2212, then formatZar(abs))
 *   positive  → "+R500.00"
 *   zero      → "R0.00"     (unsigned — no leading +/−)
 *
 * Reuses formatZar from class-display.ts for the R/toFixed(2) logic so that
 * the canonical Rand format is defined once.
 *
 * NOTE: The minus sign is U+2212 (MINUS SIGN), not U+002D (HYPHEN-MINUS), for
 * typographic correctness. Tests pin the exact character — ensure the test file
 * also uses U+2212 for the negative assertion.
 *
 * Input MUST be integer cents; never pass a float.
 *
 * Examples:
 *   formatSignedZar(-29000) → "−R290.00"
 *   formatSignedZar(50000)  → "+R500.00"
 *   formatSignedZar(0)      → "R0.00"
 */
export function formatSignedZar(cents: number): string {
  if (cents === 0) {
    return formatZar(0);
  }
  if (cents < 0) {
    // U+2212 MINUS SIGN (not ASCII hyphen)
    return `−${formatZar(-cents)}`;
  }
  return `+${formatZar(cents)}`;
}

/**
 * Human-readable label for every LedgerType enum value.
 *
 * Exhaustive switch — tsc (strict mode) will error if a new enum value is added
 * to the schema without updating this mapping. Mirrors formatStatus() in class-display.ts.
 *
 *   BOOKING_CHARGE      → "Class booking"
 *   CANCELLATION_REFUND → "Refund"
 *   CANCELLATION_FEE    → "Cancellation fee"
 *   ADJUSTMENT          → "Adjustment"
 *   TOPUP               → "Top-up"
 *   PACKAGE_PURCHASE    → "Package purchase"
 *   WITHDRAWAL          → "Withdrawal"
 */
export function formatLedgerType(type: LedgerType): string {
  switch (type) {
    case "BOOKING_CHARGE":
      return "Class booking";
    case "CANCELLATION_REFUND":
      return "Refund";
    case "CANCELLATION_FEE":
      return "Cancellation fee";
    case "ADJUSTMENT":
      return "Adjustment";
    case "TOPUP":
      return "Top-up";
    case "PACKAGE_PURCHASE":
      return "Package purchase";
    case "WITHDRAWAL":
      return "Withdrawal";
  }
}
