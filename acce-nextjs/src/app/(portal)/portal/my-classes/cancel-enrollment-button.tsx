"use client";

// cancel-enrollment-button.tsx — Story 5.2 (Task 4, AC5, UX-DR5, UX-DR6, NFR10).
// Client island: calls cancelEnrollmentAction on confirm, shows a sonner toast,
// refreshes the page on success so the cancelled row disappears and wallet updates.
//
// RSC-500 safety (1.5 lesson): this component receives only plain serialisable
// props (string, number) — never a Client Component element through a non-children
// prop. The Server Component (page.tsx) safely renders <CancelEnrollmentButton …/>.
//
// UX-DR5: sonner toast for success and each specific failure reason.
// UX-DR6 / NFR10: keyboard-operable, visible focus ring, ≥44px hit target,
//   aria-busy while pending, both-mode contrast, label text (not colour) carries
//   the refund state ("100% refund" / "70% refund" / "no refund").
// UX-DR2: Cancel is subordinate/destructive — uses "outline" or "destructive"
//   variant via tokens (NOT the gold CTA; no hardcoded hex).

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { cancelEnrollmentAction } from "./actions";
import {
  CANCEL_SUCCESS_MESSAGE,
  getCancelErrorMessage,
} from "@/lib/cancel-schema";
import { formatZar } from "@/lib/class-display";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CancelEnrollmentButtonProps {
  /** The enrollment id — a plain serialisable string (RSC-500 safe). */
  enrollmentId: string;
  /** Refund amount in integer cents for the confirm dialog copy (AD-9). */
  refundCents: number;
  /** Refund percentage (0, 70, or 100) for the button label text (UX-DR6). */
  refundPct: number;
  /** Class title for the confirm dialog heading (user-facing). */
  classTitle: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CancelEnrollmentButton({
  enrollmentId,
  refundCents,
  refundPct,
  classTitle,
}: CancelEnrollmentButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  // Button label carries the refund state in text (UX-DR6: not colour alone).
  const buttonLabel =
    refundPct === 100
      ? "Cancel — 100% refund"
      : refundPct === 70
        ? "Cancel — 70% refund"
        : "Cancel — no refund";

  // Confirm dialog body copy describing what the student will get back.
  const refundDescription =
    refundCents > 0
      ? `You'll get ${formatZar(refundCents)} back to your wallet.`
      : "No refund applies at this notice.";

  async function handleConfirm() {
    if (isPending) return; // guard against double-submit
    setIsPending(true);

    try {
      const result = await cancelEnrollmentAction({ enrollmentId });

      if (result.ok) {
        // AC5: success toast + router.refresh() to re-render without the cancelled row.
        // revalidatePath in the action invalidated the RSC cache; refresh() fetches
        // the fresh server output which no longer includes this enrollment.
        toast.success(CANCEL_SUCCESS_MESSAGE);
        router.refresh();
      } else {
        // AC5: specific error toast per reason (UX-DR5).
        toast.error(getCancelErrorMessage(result.reason));
      }
    } catch {
      // Unexpected client-side error (network failure, etc.).
      toast.error(getCancelErrorMessage("error"));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <AlertDialog>
      {/* ── Trigger: the "Cancel — {pct}% refund" button ─────────────────── */}
      <AlertDialogTrigger asChild>
        {/* UX-DR2: outline/subordinate variant — NOT the gold CTA (UX-DR2).
            UX-DR6/NFR10: min-h-[44px] hit target, focus-visible ring, aria-busy. */}
        <Button
          variant="outline"
          aria-busy={isPending}
          disabled={isPending}
          aria-label={`${buttonLabel} for ${classTitle}`}
          className="min-h-[44px] min-w-[160px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {isPending ? "Cancelling…" : buttonLabel}
        </Button>
      </AlertDialogTrigger>

      {/* ── Confirm dialog ─────────────────────────────────────────────────── */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this class?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="block font-medium text-foreground">{classTitle}</span>
            <span className="block mt-1">{refundDescription}</span>
            <span className="block mt-1 text-xs">
              This action cannot be undone. Your seat will be returned to the pool.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* Cancel/dismiss: UX-DR2 outline, keyboard-operable (NFR10) */}
          <AlertDialogCancel
            className="focus-visible:ring-2 focus-visible:ring-ring"
          >
            Keep my seat
          </AlertDialogCancel>
          {/* Confirm cancel: destructive variant via tokens (no hardcoded hex, UX-DR2) */}
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none min-h-[44px]"
            aria-busy={isPending}
          >
            {isPending ? "Cancelling…" : "Yes, cancel booking"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
