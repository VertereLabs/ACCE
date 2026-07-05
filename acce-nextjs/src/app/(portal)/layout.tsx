// (portal) route group layout — Story 1.3 (AC2, AC4, AC5).
// Server component: guards to an authenticated session, then renders the portal shell.
//
// AD-3: This layout is the UX layer and defense-in-depth. The TRUSTED guard is the
// per-page requireSession() / requireAdmin() call inside each page that sits under
// this group. A direct RSC request to a page can bypass its ancestor layout — so
// each page also calls requireSession() independently.
//
// Do NOT add <html>/<body>/providers here — root src/app/layout.tsx owns them.

import type { ReactNode } from "react";
import { requireSession } from "@/lib/auth-guards";
import { PortalNav } from "./portal-nav";

interface PortalLayoutProps {
  children: ReactNode;
}

export default async function PortalLayout({ children }: PortalLayoutProps) {
  // Defense-in-depth guard: redirects to /sign-in if no session (AC2).
  // The per-page requireSession() is the trusted boundary; this is UX.
  await requireSession();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PortalNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
