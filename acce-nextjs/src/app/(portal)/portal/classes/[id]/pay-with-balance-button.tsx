"use client";

// PayWithBalanceButton — Story 3.4 (Task 3, AC4, UX-DR5, UX-DR6, NFR10).
// Client island: calls reserveSeatAction on click, shows a sonner toast,
// refreshes the page on success so the CONFIRMED checkout state renders.
//
// RSC-500 safety (1.5 lesson): this component receives a plain string prop
// `classId` — never a Client Component element through a non-children prop.
// The Server Component (page.tsx) safely renders <PayWithBalanceButton classId={…} />.
//
// UX-DR5: sonner toast for success and each specific failure reason.
// UX-DR6 / NFR10: keyboard-operable, visible focus ring, ≥44px hit target,
//   aria-busy while pending, both-mode contrast (gold accent tokens), label
//   text (not colour) carries the state.
// UX-DR2: gold CTA via `bg-accent text-accent-foreground hover:bg-accent/90`
//   tokens (not hardcoded hex) so the palette flips correctly in dark mode.

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

import { reserveSeatAction } from "./actions";
import { RESERVE_SUCCESS_MESSAGE, getReserveErrorMessage } from "@/lib/reserve-schema";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface PayWithBalanceButtonProps {
  /** The GroupSession id — a plain serialisable string (RSC-500 safe). */
  classId: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PayWithBalanceButton({ classId }: PayWithBalanceButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    if (isPending) return; // guard against double-submit
    setIsPending(true);

    try {
      const result = await reserveSeatAction({ classId });

      if (result.ok) {
        // AC4: success toast + router.refresh() to re-render the CONFIRMED state.
        // revalidatePath in the action invalidated the RSC cache; refresh() fetches
        // the fresh server output which now shows "You're enrolled" + join details.
        toast.success(RESERVE_SUCCESS_MESSAGE);
        router.refresh();
      } else {
        // AC4: specific error toast per reason (UX-DR5).
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
    <Button
      onClick={handleClick}
      disabled={isPending}
      aria-busy={isPending}
      className="min-h-[44px] w-full bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {isPending ? "Booking…" : "Pay with balance"}
    </Button>
  );
}
