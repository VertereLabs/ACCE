// New Group Class page — Story 2.1 (Task 3, AC1, AC2, AC3, AC4).
// Server component: guard runs BEFORE any data fetch or JSX production (AD-3).
//
// AD-3: requireAdmin() here is the TRUSTED page-level guard. The (admin) layout
// also calls requireAdmin() as defense-in-depth, but this page call is the
// authoritative boundary — a direct RSC request bypasses the layout.
//
// AD-1: Net-new route under (admin)/admin/classes/new — no marketing routes touched.

import { requireAdmin } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { LEVELS } from "@/lib/class-constants";
import { ClassForm } from "./class-form";

export default async function NewClassPage() {
  // Trusted page-level check — required even though (admin) layout also guards.
  await requireAdmin();

  // Load subject options for the form select.
  const subjects = await db.subject.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Create a group class</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the details below. Students will be able to browse and buy a seat once you publish.
        </p>
      </div>

      {/* Pass plain serialisable data to the client form — no Client Component elements
          passed through non-children props (1.5 RSC non-children-prop 500 trap). */}
      <ClassForm
        subjects={subjects.map((s) => ({ id: s.id, name: s.name }))}
        levels={[...LEVELS]}
      />
    </div>
  );
}
