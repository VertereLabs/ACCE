// reserve-schema.ts — Story 3.4 (Task 4, AC5) + Story 4.1 (Task 5, AC5, AC6).
// Pure, db-free module: Zod input schema + reason→user-message mapper.
//
// No Prisma/db import → vitest (jsdom) loads this safely without DATABASE_URL.
// Mirrors the pattern of class-form-schema.ts / class-occupancy.ts.
//
// Story 4.1 update:
//   - "insufficient_balance" removed from ReserveFailureReason (balance shortfall
//     is now the Paystack PENDING path, not an error — see enrollment.ts#ReserveSeatResult).
//   - PAYSTACK_REDIRECT_MESSAGE added (label text while redirecting to Paystack).
//
// Used by:
//   - reserveSeatAction (server action — validates input)
//   - payWithPaystackAction (server action — validates input + maps reasons)
//   - PayWithBalanceButton (client island — maps reason to toast text)
//   - PayOnlineButton (client island — maps reason to toast text + redirect message)
//   - tests/unit/reserve-schema.test.ts (unit tests)
//   - tests/unit/paystack.test.ts (unit tests)

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
 * by the PayWithBalanceButton and PayOnlineButton client islands (UX-DR5).
 *
 * Specific messages per reason:
 *   success          — "You're enrolled — your class details are now unlocked"
 *   class_full       — "This class just filled up"
 *   already_enrolled — "You're already enrolled"
 *   not_available    — "This class is no longer available"
 *   error            — "Something went wrong — please try again"
 *
 * NOTE: "insufficient_balance" is intentionally absent (Story 4.1). A balance
 * shortfall now creates a PENDING hold and initiates the Paystack redirect flow
 * instead of showing an error toast.
 */
export type ReserveFailureReason =
  | "class_full"
  | "already_enrolled"
  | "not_available"
  | "error";

export const RESERVE_SUCCESS_MESSAGE =
  "You're enrolled — your class details are now unlocked";

/**
 * Message shown in the PayOnlineButton while it is pending (redirecting to Paystack).
 * Label text carries the state per UX-DR6 (not colour alone).
 */
export const PAYSTACK_REDIRECT_MESSAGE = "Redirecting to Paystack…";

export const RESERVE_ERROR_MESSAGES: Record<ReserveFailureReason, string> = {
  class_full: "This class just filled up",
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
