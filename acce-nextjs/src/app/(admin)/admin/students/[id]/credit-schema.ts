// credit-schema.ts — Story 3.5 (Task 1, AC1, AC2, AC5).
// Pure, db-free Zod schema for the admin wallet-credit form.
// No Prisma/db import → vitest/jsdom can load this without DATABASE_URL.
//
// Mirrors 2.1's class-form-schema.ts (pure + toCents) and 3.4's reserve-schema.ts.
//
// AD-9: Rand→cents conversion lives here so there is exactly ONE conversion site.
// The server action calls toCents(parsed.amountRand) before the DB write.
// No float ever reaches the DB or domain layer.

import { z } from "zod";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

/**
 * Zod schema for the admin wallet-credit form.
 *
 * Fields:
 *   studentId  — the target user's id (non-empty string, passed as a hidden/prop value)
 *   amountRand — the credit amount in Rand; must be a positive number (AC2: 0/negative/empty all fail)
 *
 * z.coerce.number("") coerces "" to 0, which then fails .positive() — intended (mirrors priceRand in 2.1).
 */
export const creditWalletSchema = z.object({
  studentId: z
    .string()
    .min(1, "Student ID is required"),

  amountRand: z
    .coerce
    .number({ error: () => ({ message: "Amount must be a number" }) })
    .positive("Amount must be greater than 0"),
});

export type CreditWalletInput = z.infer<typeof creditWalletSchema>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert an amount in Rand (from the credit form) to integer cents for DB storage.
 * AD-9: Always Math.round — no floats in domain or DB.
 *
 * Examples:
 *   toCents(500)    → 50000
 *   toCents(10.5)   → 1050
 *   toCents(10.555) → 1056
 *
 * This is the canonical Rand→cents conversion rule for this story.
 * Identical to toCents in class-form-schema.ts (AD-9: one rule).
 */
export function toCents(amountRand: number): number {
  return Math.round(amountRand * 100);
}
