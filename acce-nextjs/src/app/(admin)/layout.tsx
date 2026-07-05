// (admin) route group layout — Story 1.3 (AC3, AC4, AC5).
// Server component: guards to an authenticated session with role === "ADMIN".
//
// requireAdmin() behaviour:
//   - No session → redirect to /sign-in (via requireSession inside requireAdmin).
//   - Session but role !== "ADMIN" → redirect to /portal (authenticated but not admin).
//   - Session with role === "ADMIN" → proceed and render admin shell.
//
// AD-3: This layout is defense-in-depth. The TRUSTED guard for each admin page is
// the per-page requireAdmin() call inside that page. A direct RSC request to an
// admin page can bypass the layout — so each admin page also calls requireAdmin().
//
// AC3 guarantee: requireAdmin() runs BEFORE any admin JSX or data-fetch is produced,
// so no admin content is rendered or streamed to non-admin visitors.
//
// Do NOT add <html>/<body>/providers here — root src/app/layout.tsx owns them.

import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth-guards";
import { PortalNav } from "@/app/(portal)/portal-nav";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Trusted boundary for the admin shell: role === "ADMIN" required (AC3).
  // No admin content is produced before this await resolves.
  await requireAdmin();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Reuses the portal nav shell; Epic 2+ can add an Admin badge/breadcrumb here */}
      <PortalNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
