// Minimal admin landing — Story 1.3 (AC3, AC5).
// Server component. Intentionally minimal — Epic 2 adds class CRUD here.
//
// Page-level requireAdmin() is the TRUSTED guard (AD-3): it runs before any
// admin JSX/data is produced, ensuring non-admins never see this content even
// if they bypass the (admin) layout (direct RSC request).

import { requireAdmin } from "@/lib/auth-guards";

export default async function AdminPage() {
  // Trusted page-level check — redundant with layout but required by AD-3.
  // No admin content below this line is produced for non-admins.
  const session = await requireAdmin();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="mt-2 text-muted-foreground">
        Welcome, {session.user.email}. Class management arrives in Epic 2.
      </p>
    </div>
  );
}
