// Admin students index — Story 3.5 (Task 4, AC4, mirrors 2.2 admin classes list).
// Server component — fully server-rendered, no client island.
//
// Security model (AD-3): requireAdmin() is the TRUSTED page-level guard.
// It runs BEFORE any data fetch or JSX, so non-admins never see student data
// even if they bypass the (admin) layout via a direct RSC request.
//
// This is a read-only listing of all STUDENT-role users — admins use it to
// navigate to the per-student view where they can credit the wallet.
//
// A11y (NFR10): plain <div> wrapper — the (admin) layout owns the single <main>
// landmark (1.3 review finding; nested <main> = invalid a11y).

import Link from "next/link";

import { requireAdmin } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";

// ---------------------------------------------------------------------------
// Date formatting — native Intl, no date library (2.2/3.1 convention)
// ---------------------------------------------------------------------------

function formatJoinDate(date: Date): string {
  return date.toLocaleString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function AdminStudentsPage() {
  // AD-3: trusted page-level guard — runs before any data fetch or JSX.
  await requireAdmin();

  // Fetch all STUDENT-role users ordered by join date (oldest first).
  // Select only what is displayed — no wallet/ledger data (this is the list, not the view).
  const students = await db.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  const isEmpty = students.length === 0;

  return (
    // Plain <div> — the (admin) layout owns the single <main> landmark (1.3 a11y).
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Students</h1>
      </div>

      {/* ── Empty state ──────────────────────────────────────────────────── */}
      {isEmpty && (
        <EmptyState message="No students yet. Students appear here once they sign up." />
      )}

      {/* ── Populated list ───────────────────────────────────────────────── */}
      {!isEmpty && (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    {student.name ?? "—"}
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatJoinDate(student.createdAt)}
                  </TableCell>
                  {/* Per-row "View / credit" link — subordinate ghost, gold CTA is on the student view */}
                  <TableCell>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="min-h-[44px]"
                    >
                      <Link href={`/admin/students/${student.id}`}>View / credit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
