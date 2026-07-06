// Admin classes index — Story 2.2 (AC1, AC2, AC3, AC4).
// Server component — fully server-rendered, no client island.
//
// Security model (AD-3): requireAdmin() is the TRUSTED page-level guard.
// It runs BEFORE any data fetch or JSX, so non-admins never see class data
// even if they bypass the (admin) layout via a direct RSC request.
//
// Data model (AD-5): occupancy is DERIVED, never stored. Expired PENDING holds
// are treated as free seats. This page issues NO write of any kind — the real
// PENDING→CANCELLED expiry flip belongs only inside a locked mutation in
// enrollment.ts (a later epic).
//
// Money (AD-9): priceCents is stored as integer cents. formatZar() converts to
// a Rand string ONLY here at the UI edge.

import Link from "next/link";

import { requireAdmin } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { occupiedEnrollmentWhere, computeSeatsLeft } from "@/lib/class-occupancy";
import { formatZar, formatMode, formatStatus } from "@/lib/class-display";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

// ---------------------------------------------------------------------------
// Badge variant helpers
// ---------------------------------------------------------------------------

function statusVariant(
  status: "SCHEDULED" | "CANCELLED" | "COMPLETED",
): "default" | "destructive" | "secondary" | "outline" {
  switch (status) {
    case "SCHEDULED":
      return "default";
    case "CANCELLED":
      return "destructive";
    case "COMPLETED":
      return "secondary";
  }
}

function modeVariant(): "outline" {
  return "outline";
}

// ---------------------------------------------------------------------------
// Date formatting — native Intl, no date library (story constraint)
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

export default async function AdminClassesPage() {
  // AD-3: trusted page-level guard — runs before any data fetch or JSX.
  await requireAdmin();

  // Compute the expiry threshold ONCE per request (AD-5).
  const now = new Date();

  // Fetch all classes ordered chronologically, with subject name and a
  // filtered occupancy count (AD-5 — runs in the DB, no N+1, read-only).
  const classes = await db.groupSession.findMany({
    orderBy: { start: "asc" },
    select: {
      id: true,
      title: true,
      level: true,
      start: true,
      end: true,
      capacity: true,
      priceCents: true,
      mode: true,
      status: true,
      subject: {
        select: { name: true },
      },
      // Filtered _count: counts only OCCUPYING enrollments (AD-5).
      // Prisma 6.19.3 supports filtered relation _count (GA since 5.0).
      _count: {
        select: {
          enrollments: {
            where: occupiedEnrollmentWhere(now),
          },
        },
      },
    },
  });

  const isEmpty = classes.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Classes</h1>
        <Button
          asChild
          className="min-h-[44px] bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Link href="/admin/classes/new">New class</Link>
        </Button>
      </div>

      {/* ── Empty state (AC2) ────────────────────────────────────────────── */}
      {isEmpty && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-muted-foreground">
              No classes yet. Create your first class to get started.
            </p>
            <Button
              asChild
              className="min-h-[44px] bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/admin/classes/new">Create your first class</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Populated list (AC1, AC3) ────────────────────────────────────── */}
      {!isEmpty && (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Occupied / Left</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls) => {
                const occupied = cls._count.enrollments;
                const seatsLeft = computeSeatsLeft(cls.capacity, occupied);
                return (
                  <TableRow key={cls.id}>
                    <TableCell className="font-medium">
                      {cls.subject.name}
                    </TableCell>
                    <TableCell>{cls.title}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(cls.start)}
                    </TableCell>
                    <TableCell>{cls.capacity}</TableCell>
                    <TableCell>
                      {occupied} / {seatsLeft} left
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatZar(cls.priceCents)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={modeVariant()}>
                        {formatMode(cls.mode)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(cls.status)}>
                        {formatStatus(cls.status)}
                      </Badge>
                    </TableCell>
                    {/* Story 2.3 — per-row Edit link (secondary/ghost, keeps gold CTA dominant) */}
                    {/* Story 6.1 — per-row Roster/View link to class detail / enrollment roster */}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="min-h-[44px]"
                        >
                          <Link href={`/admin/classes/${cls.id}`}>Roster</Link>
                        </Button>
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="min-h-[44px]"
                        >
                          <Link href={`/admin/classes/${cls.id}/edit`}>Edit</Link>
                        </Button>
                      </div>
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
