// Minimal authenticated portal landing — Story 1.2 (AC2, AC3).
// Server component: reads session server-side; redirects to /sign-in if none.
// AD-3: page-level session check is the real security boundary.
// The (portal) route group has no layout.tsx yet — Story 1.3 adds the guarded shell.
// This page intentionally stays minimal; 1.3 wraps it in the full portal shell.

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./sign-out-button";

export default async function PortalPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // No session → send to sign-in (page-level guard, AD-3).
  if (!session) {
    redirect("/sign-in");
  }

  const { user } = session;

  return (
    // Story 1.3: the (portal) layout now owns the page's single <main> landmark.
    // Use a plain <div> here to avoid nested/duplicate <main> (invalid HTML +
    // duplicate landmark = a11y-floor violation, AC4/NFR10).
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Welcome to ACCE Tutors</h1>
        <p className="text-muted-foreground">
          Signed in as <strong>{user.email}</strong>
        </p>
      </div>

      <SignOutButton />
    </div>
  );
}
