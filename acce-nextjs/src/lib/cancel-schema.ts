// cancel-schema.ts — Story 5.2 (Task 1, AC5, AC6).
// Pure, db-free module: Zod input schema + reason→user-message mapper.
//
// No Prisma/db import → vitest (jsdom) loads this safely without DATABASE_URL.
// Mirrors the pattern of reserve-schema.ts / credit-schema.ts.
//
// Used by:
//   - cancelEnrollmentAction (server action — validates input)
//   - CancelEnrollmentButton (client island — maps reason to toast text)
//   - tests/unit/cancel-schema.test.ts (unit tests)

import { z } from "zod";

// ---------------------------------------------------------------------------
// Input schema
// ---------------------------------------------------------------------------

/**
 * Zod schema for the cancel-enrollment server action input.
 * Accepts { enrollmentId: non-empty string }.
 * The server action uses this to Zod-validate the unknown `input` argument.
 */
export const cancelInputSchema = z.object({
  enrollmentId: z.string().min(1, "enrollmentId is required"),
});

export type CancelInput = z.infer<typeof cancelInputSchema>;

// ---------------------------------------------------------------------------
// Reason → user-facing message mapper (UX-DR5)
// ---------------------------------------------------------------------------

/**
 * Maps a cancelEnrollment failure reason to the user-facing toast message shown
 * by the CancelEnrollmentButton client island (UX-DR5).
 *
 * Specific messages per reason:
 *   not_found      — "We couldn't find that booking"
 *   not_cancellable — "This class can no longer be cancelled"
 *   error          — "Something went wrong — please try again"
 */
export type CancelFailureReason = "not_found" | "not_cancellable" | "error";

export const CANCEL_SUCCESS_MESSAGE =
  "Your booking has been cancelled and your refund is on its way to your wallet";

export const CANCEL_ERROR_MESSAGES: Record<CancelFailureReason, string> = {
  not_found: "We couldn't find that booking",
  not_cancellable: "This class can no longer be cancelled",
  error: "Something went wrong — please try again",
};

/**
 * Returns the user-facing error message for a given failure reason.
 * Falls back to the generic "error" message for any unknown reason.
 */
export function getCancelErrorMessage(reason: string): string {
  return (
    CANCEL_ERROR_MESSAGES[reason as CancelFailureReason] ??
    CANCEL_ERROR_MESSAGES.error
  );
}
