// attendance-schema.ts — Story 6.2 (Task 1, AC3, AC4, AC5).
// Pure, db-free module: Zod input schema + reason→user-message mapper.
//
// No Prisma/db import → vitest (jsdom) loads this safely without DATABASE_URL.
// Mirrors the pattern of cancel-schema.ts / reserve-schema.ts / credit-schema.ts.
//
// The z.enum(["ATTENDED","NO_SHOW"]) guard in the schema makes it impossible for
// markAttendanceAction to be coerced into writing any other EnrollmentStatus value (AC3).
//
// Used by:
//   - markAttendanceAction (server action — validates input)
//   - MarkAttendanceButtons (client island — maps reason to toast text)
//   - tests/unit/attendance-schema.test.ts (unit tests)

import { z } from "zod";

// ---------------------------------------------------------------------------
// Input schema
// ---------------------------------------------------------------------------

/**
 * Zod schema for the mark-attendance server action input.
 * Accepts {
 *   enrollmentId: non-empty string,
 *   classId: non-empty string (for precise revalidatePath),
 *   outcome: "ATTENDED" | "NO_SHOW"
 * }.
 *
 * The `outcome` z.enum is the AC3 guard — only the two attendance values
 * can pass Zod-validation; no other EnrollmentStatus can be written by this action.
 */
export const markAttendanceInputSchema = z.object({
  enrollmentId: z.string().min(1, "enrollmentId is required"),
  classId: z.string().min(1, "classId is required"),
  outcome: z.enum(["ATTENDED", "NO_SHOW"]),
});

export type MarkAttendanceInput = z.infer<typeof markAttendanceInputSchema>;

// ---------------------------------------------------------------------------
// Reason → user-facing message mapper (UX-DR5)
// ---------------------------------------------------------------------------

/**
 * Maps a markAttendance failure reason to the user-facing toast message shown
 * by the MarkAttendanceButtons client island (UX-DR5).
 *
 * Specific messages per reason:
 *   not_found    — "We couldn't find that enrollment"
 *   not_markable — "This enrollment can no longer be marked"
 *   error        — "Something went wrong — please try again"
 */
export type MarkAttendanceFailureReason = "not_found" | "not_markable" | "error";

/**
 * Returns the user-facing success message for a given attendance outcome (UX-DR5).
 */
export function MARK_ATTENDANCE_SUCCESS(outcome: "ATTENDED" | "NO_SHOW"): string {
  return outcome === "ATTENDED" ? "Marked as attended" : "Marked as no-show";
}

export const MARK_ATTENDANCE_ERROR_MESSAGES: Record<
  MarkAttendanceFailureReason,
  string
> = {
  not_found: "We couldn't find that enrollment",
  not_markable: "This enrollment can no longer be marked",
  error: "Something went wrong — please try again",
};

/**
 * Returns the user-facing error message for a given failure reason.
 * Falls back to the generic "error" message for any unknown reason.
 */
export function getMarkAttendanceErrorMessage(reason: string): string {
  return (
    MARK_ATTENDANCE_ERROR_MESSAGES[reason as MarkAttendanceFailureReason] ??
    MARK_ATTENDANCE_ERROR_MESSAGES.error
  );
}
