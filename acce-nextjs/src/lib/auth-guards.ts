// Auth guard helpers — Story 1.3 (AC2, AC3, AC5).
// Single home for role-based access control (AD-3: authorization at the data/entry layer).
//
// AD-3 rule: A Next.js layout is NOT a security boundary — a page can be requested directly
// (RSC) without its ancestor layout. These helpers are called by BOTH the layout AND each
// page that sits behind the guard, providing defense-in-depth where the page check is the
// TRUSTED guard and the layout check is UX defense.
//
// AD-2 rule: session reads go through `auth` (Prisma singleton via prismaAdapter) — never
// query the `user` table directly for role.

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Ensures the visitor has an authenticated session.
 * Called by (portal) layout AND portal pages.
 *
 * - If no session → redirect to /sign-in.
 * - If session exists → returns the session object.
 *
 * The returned session has `session.user.role` (from the admin plugin).
 */
export async function requireSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return session;
}

/**
 * Ensures the visitor has an authenticated session with role === "ADMIN".
 * Called by (admin) layout AND admin pages.
 *
 * - If no session → requireSession() redirects to /sign-in.
 * - If session exists but role !== "ADMIN" → redirect to /portal.
 *   (Non-admins ARE authenticated; they belong in the portal, not sign-in.)
 * - If session exists and role === "ADMIN" → returns the session object.
 *
 * Fail-closed on role: anything that is not the exact string "ADMIN" is treated as
 * non-admin (per schema: `role String? @default("STUDENT")` — could be null or "STUDENT").
 */
export async function requireAdmin() {
  const session = await requireSession();

  // Fail-closed: only exact "ADMIN" string passes. null, undefined, "STUDENT" → portal.
  if (session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  return session;
}
