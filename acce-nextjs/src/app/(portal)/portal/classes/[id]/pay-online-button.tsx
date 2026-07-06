"use client";

// PayOnlineButton — Story 4.1 (Task 4, AC5, UX-DR5, UX-DR6, NFR10).
// Client island: calls payWithPaystackAction on click; on redirect performs
// a full-page navigation to Paystack (window.location.href); on failure shows
// a sonner toast with the specific reason message.
//
// RSC-500 safety (1.5 lesson): receives a plain string prop `classId` — never
// a Client Component element through a non-children prop.
//
// UX-DR5: sonner toast for each specific failure reason; redirect is full-page
//   navigation (toast is optional — page navigates away on success).
// UX-DR6 / NFR10: keyboard-operable, visible focus ring, ≥44px hit target,
//   aria-busy while pending, label text carries the state ("Redirecting…").
// UX-DR2: gold CTA via `bg-accent text-accent-foreground hover:bg-accent/90`
//   tokens (not hardcoded hex) so the palette flips correctly in dark mode.
//   Only ONE gold CTA is visible at a time: insufficient-balance users see this;
//   balance-sufficient users see PayWithBalanceButton (mutually exclusive branches).
// AD-3: payWithPaystackAction calls requireSession() FIRST — classId is the
//   only client-supplied value; the student id and email come from the session.

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

import { payWithPaystackAction } from "./actions";
import { PAYSTACK_REDIRECT_MESSAGE, getReserveErrorMessage } from "@/lib/reserve-schema";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface PayOnlineButtonProps {
  /** The GroupSession id — a plain serialisable string (RSC-500 safe, 1.5 lesson). */
  classId: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PayOnlineButton({ classId }: PayOnlineButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    if (isPending) return; // guard against double-submit
    setIsPending(true);

    try {
      const result = await payWithPaystackAction({ classId });

      if (result.ok && "redirect" in result) {
        // AC5: full-page navigation to Paystack (NOT next/navigation redirect —
        // that only works for same-origin routes; window.location.href works for
        // external URLs). The toast is skipped — the page navigates away.
        window.location.href = result.redirect;
        // Do not setIsPending(false) here — the page is navigating away.
        return;
      }

      if (result.ok && "confirmed" in result) {
        // Edge case: balance became sufficient since page render — seat confirmed.
        // Show success toast + refresh so the CONFIRMED state renders.
        toast.success("You're enrolled — your class details are now unlocked");
        router.refresh();
        return;
      }

      // Failure: show the specific sonner toast (UX-DR5).
      if (!result.ok) {
        toast.error(getReserveErrorMessage(result.reason));
      }
    } catch {
      // Unexpected client-side error (network failure, etc.).
      toast.error(getReserveErrorMessage("error"));
    } finally {
      setIsPending(false);
    }
  }

  return (
    // UX-DR6/NFR10: min-h-[44px] hit target, focus-visible ring, aria-busy while pending.
    // Not disabled while pending (aria-busy instead) so it remains keyboard-focusable.
    // UX-DR2: bg-accent/text-accent-foreground tokens (gold + navy per light/dark).
    // Label text carries the state per UX-DR6 — "Redirecting…" while pending.
    <Button
      onClick={handleClick}
      aria-busy={isPending}
      className="min-h-[44px] w-full bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {isPending ? PAYSTACK_REDIRECT_MESSAGE : "Pay online with Paystack"}
    </Button>
  );
}
