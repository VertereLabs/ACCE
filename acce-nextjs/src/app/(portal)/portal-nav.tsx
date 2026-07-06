"use client";

// Portal shell nav — Story 1.3 (AC4, UX-DR1, UX-DR6, UX-DR7).
// A dedicated portal navbar; distinct from the marketing Navbar (which has a
// WhatsApp CTA and fixed positioning suited to the public site).
//
// Reuses design tokens (navy+gold) and existing components (Logo, ThemeToggle,
// SignOutButton) — no new palette (AC4, DESIGN.md).
//
// A11y floor (NFR10): all controls keyboard-operable with visible focus ring,
// touch targets ≥44px, labels provided where needed.

import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { SignOutButton } from "@/app/(portal)/portal/sign-out-button";

/**
 * Top navigation bar rendered inside the (portal) shell.
 * Renders in both the portal and admin shells (admin shell may reuse this
 * directly or add an "Admin" badge — kept generic for now).
 */
export function PortalNav() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <nav
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="Portal navigation"
      >
        {/* Logo linking back to portal home */}
        <Link
          href="/portal"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="ACCE Tutors — go to portal home"
        >
          <Logo variant="auto" showWordmark size={32} />
        </Link>

        {/* Centre nav links */}
        <div className="flex items-center gap-1">
          {/* Story 3.2 — Upcoming classes browse page (STUDENT+, keyboard-operable, ≥44px touch) */}
          <Link
            href="/portal/classes"
            className="flex h-11 items-center rounded-md px-3 text-sm font-medium text-foreground/80 hover:bg-accent/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Classes
          </Link>
          {/* Story 3.1 — Wallet balance page (STUDENT+, keyboard-operable, ≥44px touch) */}
          <Link
            href="/portal/wallet"
            className="flex h-11 items-center rounded-md px-3 text-sm font-medium text-foreground/80 hover:bg-accent/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Wallet
          </Link>
        </div>

        {/* Right-side controls: theme toggle + sign-out */}
        <div className="flex items-center gap-2">
          {/* ThemeToggle: ghost icon button, 40×40px, already a11y-correct */}
          <ThemeToggle />

          {/* SignOutButton: reuses the component from Story 1.2 */}
          <SignOutButton />
        </div>
      </nav>
    </header>
  );
}
