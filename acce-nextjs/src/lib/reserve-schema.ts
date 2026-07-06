// reserve-schema.ts — Story 3.4 (Task 4, AC5).
// Pure, db-free module: Zod input schema + reason→user-message mapper.
//
// No Prisma/db import → vitest (jsdom) loads this safely without DATABASE_URL.
// Mirrors the pattern of class-form-schema.ts / class-occupancy.ts.
//
// Used by:
//   - reserveSeatAction (server action — validates input)
//   - PayWithBalanceButton (client island — maps reason to toast text)
//   - tests/unit/reserve-schema.test.ts (unit tests)

import { z } from "zod";

// ---------------------------------------------------------------------------
// Input schema
// ---------------------------------------------------------------------------

/**
 * Zod schema for the reserve-seat server action input.
 * Accepts { classId: non-empty string }.
 * The server action uses this to Zod-validate the unknown `input` argument.
 */
export const reserveInputSchema = z.object({
  classId: z.string().min(1, "classId is required"),
});

export type ReserveInput = z.infer<typeof reserveInputSchema>;

// ---------------------------------------------------------------------------
// Reason → user-facing message mapper (UX-DR5)
// ---------------------------------------------------------------------------

/**
 * Maps a ReserveSeatResult reason to the user-facing toast message shown
 * by the PayWithBalanceButton client island (UX-DR5).
 *
 * Specific messages per reason:
 *   success          — "You're enrolled — your class details are now unlocked"
 *   class_full       — "This class just filled up"
 *   insufficient_balance — "Not enough wallet balance"
 *   already_enrolled — "You're already enrolled"
 *   not_available    — "This class is no longer available"
 *   error            — "Something went wrong — please try again"
 */
export type ReserveFailureReason =
  | "class_full"
  | "already_enrolled"
  | "insufficient_balance"
  | "not_available"
  | "error";

export const RESERVE_SUCCESS_MESSAGE =
  "You're enrolled — your class details are now unlocked";

export const RESERVE_ERROR_MESSAGES: Record<ReserveFailureReason, string> = {
  class_full: "This class just filled up",
  insufficient_balance: "Not enough wallet balance",
  already_enrolled: "You're already enrolled",
  not_available: "This class is no longer available",
  error: "Something went wrong — please try again",
};

/**
 * Returns the user-facing error message for a given failure reason.
 * Falls back to the generic "error" message for any unknown reason.
 */
export function getReserveErrorMessage(reason: string): string {
  return (
    RESERVE_ERROR_MESSAGES[reason as ReserveFailureReason] ??
    RESERVE_ERROR_MESSAGES.error
  );
}
