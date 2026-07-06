// Enrollment roster page — Story 6.1 (Task 2, AC1, AC2, AC3, AC4).
// Admin class-detail / roster: lists all non-cancelled enrollments for a class,
// with student name/email, enrolled-at date/time, and a paid/pending status badge.
//
// Security model (AD-3): requireAdmin() is the TRUSTED page-level guard.
// Runs BEFORE any data fetch or JSX — non-admins cannot see enrollment data
// even via a direct RSC request bypassing the (admin) layout.
//
// Roster scope (AC3, AD-5 roster note from ARCHITECTURE-SPINE):
//   The roster is NOT bound by the AD-5 occupancy definition. It shows every
//   non-CANCELLED enrollment: PENDING (including expired holds), CONFIRMED,
//   ATTENDED, NO_SHOW. CANCELLED rows are excluded (returned to the pool).
//   This page issues NO write of any kind — no lazy expiry flip, no status
//   update, no enrollment.ts call, no wallet.ts call (AD-14).
//
// RSC safety (1.5 lesson): fully server-rendered, no client island, so the
// RSC non-children-prop trap cannot fire.
//
// Date formatting: native Intl / toLocaleString("en-ZA") — no date library.
//
// A11y (NFR10): plain <div> wrapper — the (admin) layout owns the single
// <main> landmark (1.3 a11y fix). Do NOT add a nested <main> here.

import { notFound } from "next/navigation";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { formatZar, formatMode, formatStatus } from "@/lib/class-display";
import {
  formatEnrollmentStatus,
  enrollmentStatusBadgeVariant,
} from "@/lib/enrollment-display";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MarkAttendanceButtons } from "./mark-attendance-buttons";

// ---------------------------------------------------------------------------
// Date formatting — native Intl, no date library (story constraint, 2.2/3.5 convention)
// ---------------------------------------------------------------------------

function formatDateTime(date: Date): string {
  return date.toLocaleString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface ClassRosterPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClassRosterPage({ params }: ClassRosterPageProps) {
  // AD-3: trusted page-level guard — runs before any data fetch or JSX.
  // Non-admins are redirected (/sign-in if unauthenticated, /portal if non-admin)
  // before any class or enrollment data is fetched (AC4).
  await requireAdmin();

  // Next 16: params is a Promise — must be awaited (mirrors 2.3 edit page pattern).
  const { id } = await params;

  // Load the class first so we can notFound() if it doesn't exist (AC4).
  // Select only the fields needed for the header — not meetingUrl/location (AD-10).
  const session = await db.groupSession.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      start: true,
      end: true,
      mode: true,
      status: true,
      priceCents: true,
      subject: { select: { name: true } },
    },
  });

  if (!session) {
    notFound();
  }

  // Fetch the roster: non-CANCELLED enrollments ordered by createdAt ascending (AC1, AC3).
  //
  // ROSTER SCOPE (AC3, ARCHITECTURE-SPINE#AD-5 roster note):
  //   - NOT bound by AD-5 occupancy (no occupiedEnrollmentWhere filter).
  //   - Includes: PENDING (even expired holds), CONFIRMED, ATTENDED, NO_SHOW.
  //   - Excludes: CANCELLED (returned to pool — student no longer "enrolled").
  //   - Expired PENDING holds are still shown as "Pending" — readers never write
  //     the lazy expiry flip (that lives only inside enrollment.ts under a lock).
  //   - This query issues NO write of any kind (AD-14).
  //
  // The @@index([groupSessionId, status]) on Enrollment backs this query cheaply.
  const enrollments = await db.enrollment.findMany({
    where: {
      groupSessionId: id,
      status: { not: "CANCELLED" },
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      status: true,
      createdAt: true,
      student: {
        select: { name: true, email: true },
      },
    },
  });

  const isEmpty = enrollments.length === 0;

  return (
    // Plain <div> — the (admin) layout owns the single <main> landmark (1.3 a11y fix).
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* ── Back navigation ─────────────────────────────────────────────── */}
      <Link
        href="/admin/classes"
        className="mb-4 inline-block text-sm text-muted-foreground hover:underline"
      >
        ← Back to classes
      </Link>

      {/* ── Class header (AC1 — key facts) ──────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          {session.subject.name} — {session.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{formatDateTime(session.start)}</span>
          <span aria-hidden="true">·</span>
          {/* formatZar (AD-9): integer cents → Rand at the UI edge only */}
          <span>{formatZar(session.priceCents)}</span>
          <span aria-hidden="true">·</span>
          {/* Mode badge — uses outline variant, consistent with 2.2 index */}
          <Badge variant="outline">{formatMode(session.mode)}</Badge>
          {/* Class status badge — variant matches 2.2 index statusVariant logic */}
          <Badge
            variant={
              session.status === "SCHEDULED"
                ? "default"
                : session.status === "CANCELLED"
                  ? "destructive"
                  : "secondary"
            }
          >
            {formatStatus(session.status)}
          </Badge>
        </div>
      </div>

      {/* ── Roster heading ───────────────────────────────────────────────── */}
      <h2 className="mb-4 text-lg font-semibold">Enrollment roster</h2>

      {/* ── Empty state (AC2) ────────────────────────────────────────────── */}
      {isEmpty && (
        <Card>
          <CardContent className="flex items-center justify-center py-16 text-center">
            <p className="text-muted-foreground">
              No one has enrolled in this class yet.
            </p>
          </CardContent>
        </Card>
      )}

      {/* ── Enrollment table (AC1, AC3) ──────────────────────────────────── */}
      {/* Wrapped in overflow-x-auto for narrow-screen horizontal scrollability (UX-DR8). */}
      {!isEmpty && (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((enrollment) => {
                const studentLabel =
                  enrollment.student.name || enrollment.student.email;
                return (
                  <TableRow key={enrollment.id}>
                    {/* Student column: name prominent, email muted below (UX-DR8) */}
                    <TableCell>
                      <div className="font-medium">
                        {enrollment.student.name || enrollment.student.email}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {enrollment.student.email}
                      </div>
                    </TableCell>

                    {/* Enrolled-at: native toLocaleString, no date library */}
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDateTime(enrollment.createdAt)}
                    </TableCell>

                    {/* Status badge: formatEnrollmentStatus + variant from enrollment-display.ts */}
                    <TableCell>
                      <Badge variant={enrollmentStatusBadgeVariant(enrollment.status)}>
                        {formatEnrollmentStatus(enrollment.status)}
                      </Badge>
                    </TableCell>

                    {/* Actions column: Attended/No-show buttons for CONFIRMED rows only (AC2).
                        Already-marked (ATTENDED/NO_SHOW) and PENDING rows show nothing —
                        the status Badge carries the state (UX-DR6). */}
                    <TableCell>
                      {enrollment.status === "CONFIRMED" ? (
                        <MarkAttendanceButtons
                          enrollmentId={enrollment.id}
                          classId={session.id}
                          studentLabel={studentLabel}
                        />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
