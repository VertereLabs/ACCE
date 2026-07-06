// Admin landing — Story 1.3 (AC3, AC5); updated Story 2.2 (Task 3).
// Server component. Provides quick links to class management (Epic 2).
//
// Page-level requireAdmin() is the TRUSTED guard (AD-3): it runs before any
// admin JSX/data is produced, ensuring non-admins never see this content even
// if they bypass the (admin) layout (direct RSC request).

import Link from "next/link";

import { requireAdmin } from "@/lib/auth-guards";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  // Trusted page-level check — redundant with layout but required by AD-3.
  // No admin content below this line is produced for non-admins.
  const session = await requireAdmin();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="mt-2 text-muted-foreground">
        Welcome, {session.user.email}.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild variant="default">
          <Link href="/admin/classes">Manage classes</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/classes/new">New class</Link>
        </Button>
        {/* Story 3.5 — Manage students link for wallet credit (admin only) */}
        <Button asChild variant="outline">
          <Link href="/admin/students">Manage students</Link>
        </Button>
      </div>
    </div>
  );
}
