"use client";

// mark-attendance-buttons.tsx — Story 6.2 (Task 4, AC1, AC2, UX-DR5/DR6/DR2, NFR10).
// Client island: renders two per-row buttons ("Attended" / "No-show") for CONFIRMED
// enrollments on the admin roster. Calls markAttendanceAction, shows a sonner toast,
// and refreshes the page on success so the row's status Badge updates and buttons disappear.
//
// RSC-500 safety (1.5 lesson): receives ONLY plain serialisable props (string) from the
// Server Component (page.tsx). Never a Client Component element through a non-children prop.
//
// UX-DR2: "Attended" = default/secondary variant (positive mark, not the gold CTA).
//         "No-show" = outline/subordinate variant (not destructive, attendance is low-stakes).
//         No hardcoded hex — token variants resolve to navy+gold per light/dark mode.
// UX-DR5: sonner toast for success (per-outcome message) and each failure reason.
// UX-DR6: label text carries the action intent (not colour alone).
// NFR10: keyboard-operable, visible focus ring, ≥44px touch target, aria-busy while pending.
// No AlertDialog needed — attendance is low-stakes and correctable-by-policy (unlike cancel).

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

import { markAttendanceAction } from "./actions";
import {
  MARK_ATTENDANCE_SUCCESS,
  getMarkAttendanceErrorMessage,
} from "@/lib/attendance-schema";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface MarkAttendanceButtonsProps {
  /** The enrollment id — a plain serialisable string (RSC-500 safe). */
  enrollmentId: string;
  /** The class/session id — passed to the action for precise revalidatePath. */
  classId: string;
  /** Student display label (name or email) — used for accessible aria-labels (NFR10). */
  studentLabel: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MarkAttendanceButtons({
  enrollmentId,
  classId,
  studentLabel,
}: MarkAttendanceButtonsProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleMark(outcome: "ATTENDED" | "NO_SHOW") {
    if (isPending) return; // guard against double-submit
    setIsPending(true);

    try {
      const result = await markAttendanceAction({ enrollmentId, classId, outcome });

      if (result.ok) {
        // Success: toast with outcome-specific message + refresh so row's Badge updates
        // and buttons disappear (row is no longer CONFIRMED after the server re-render).
        toast.success(MARK_ATTENDANCE_SUCCESS(result.status));
        router.refresh();
      } else {
        // Specific error toast per reason (UX-DR5).
        toast.error(getMarkAttendanceErrorMessage(result.reason));
      }
    } catch {
      // Unexpected client-side error (network failure, etc.).
      toast.error(getMarkAttendanceErrorMessage("error"));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex gap-2">
      {/* ── "Attended" button — primary/positive mark (secondary token, not gold CTA) ── */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => handleMark("ATTENDED")}
        disabled={isPending}
        aria-busy={isPending}
        aria-label={`Mark ${studentLabel} as attended`}
        className="min-h-[44px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {isPending ? "Saving…" : "Attended"}
      </Button>

      {/* ── "No-show" button — subordinate mark (outline token variant, UX-DR2) ── */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleMark("NO_SHOW")}
        disabled={isPending}
        aria-busy={isPending}
        aria-label={`Mark ${studentLabel} as no-show`}
        className="min-h-[44px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {isPending ? "Saving…" : "No-show"}
      </Button>
    </div>
  );
}
