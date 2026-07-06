// Portal classes listing — Story 3.2 (AC1, AC2, AC3, AC4, AC5).
// Server component — fully server-rendered, no client island.
//
// Security model (AD-3): requireSession() is the TRUSTED page-level guard.
// It runs BEFORE any data fetch or JSX, so unauthenticated users are redirected
// to /sign-in even if they bypass the (portal) layout via a direct RSC request.
// The catalogue is NOT keyed to session.user.id — every authenticated student sees
// the same upcoming classes.
//
// Data model (AD-5): occupancy is DERIVED, never stored. Expired PENDING holds are
// treated as free seats. This page is a READER — it issues NO write of any kind.
// The real PENDING→CANCELLED expiry flip belongs only inside a locked mutation in
// enrollment.ts (Story 3.4 / Epic 4). Reuse occupiedEnrollmentWhere + computeSeatsLeft
// from class-occupancy.ts (AD-5 single source — never re-derive here).
//
// Money (AD-9): priceCents is stored as integer cents; formatZar() converts to Rand
// ONLY here at the UI edge.
//
// A11y (NFR10): page uses a plain <div> wrapper — the (portal) layout owns the single
// <main> landmark; a second <main> would be an invalid nested landmark (1.3 a11y fix).
//
// AD-10: meetingUrl and location are NOT selected or rendered — join-detail gating
// belongs to the class detail page (Story 3.3).

import Link from "next/link";

import { requireSession } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { occupiedEnrollmentWhere, computeSeatsLeft } from "@/lib/class-occupancy";
import { formatZar, formatMode, formatSeatsLeft } from "@/lib/class-display";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Date formatting — native Intl, no date library (story constraint).
// No explicit timeZone pin — consistent with 2.2/2.3/3.1 timezone-deferral
// convention; hardening is a system-wide deferred decision (deferred-work.md).
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

export default async function PortalClassesPage() {
  // AD-3: trusted page-level guard — runs before any data fetch or JSX.
  // Redirects to /sign-in if no session. The session is not used to filter
  // the catalogue — every authenticated student sees the same upcoming classes.
  await requireSession();

  // Compute the expiry threshold ONCE per request (AD-5).
  const now = new Date();

  // Fetch upcoming SCHEDULED classes ordered chronologically, with subject name
  // and a filtered occupancy count (AD-5 — runs in the DB, no N+1, read-only).
  // Filter: status = SCHEDULED AND start > now (upcoming only).
  // AD-10: meetingUrl and location are deliberately NOT selected here.
  const classes = await db.groupSession.findMany({
    where: { status: "SCHEDULED", start: { gt: now } },
    orderBy: { start: "asc" },
    select: {
      id: true,
      title: true,
      start: true,
      capacity: true,
      priceCents: true,
      mode: true,
      subject: {
        select: { name: true },
      },
      // Filtered _count: counts only OCCUPYING enrollments (AD-5).
      // Prisma 6.19.3 supports filtered relation _count (GA since 5.0).
      // Identical shape to the 2.2 admin page.
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
    // Plain <div> — the (portal) layout owns the single <main> landmark (1.3 a11y fix).
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* ── Page heading ──────────────────────────────────────────────────── */}
      <h1 className="mb-8 text-2xl font-semibold">Upcoming Classes</h1>

      {/* ── Empty state (AC4, UX-DR4) ─────────────────────────────────────── */}
      {isEmpty && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-muted-foreground">
              No upcoming classes right now. Check back soon.
            </p>
          </CardContent>
        </Card>
      )}

      {/* ── Card grid (AC1, AC2, AC3, UX-DR2, UX-DR3) ────────────────────── */}
      {!isEmpty && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => {
            const occupied = cls._count.enrollments;
            const seatsLeft = computeSeatsLeft(cls.capacity, occupied);
            const isFull = seatsLeft === 0;

            return (
              <Card key={cls.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  {/* Subject name as the primary card label */}
                  <CardTitle className="text-base font-semibold">
                    {cls.subject.name}
                  </CardTitle>
                  {/* Class title as description */}
                  <CardDescription className="text-sm">
                    {cls.title}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-grow flex-col gap-3 pt-0">
                  {/* Date/time */}
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(cls.start)}
                  </p>

                  {/* Price (AD-9 — integer cents → Rand at UI edge) */}
                  <p className="text-sm font-medium">
                    {formatZar(cls.priceCents)} per seat
                  </p>

                  {/* Mode */}
                  <p className="text-sm text-muted-foreground">
                    {formatMode(cls.mode)}
                  </p>

                  {/* Seats-left badge (AC1, AC2, UX-DR3) */}
                  <Badge
                    variant={isFull ? "secondary" : "default"}
                    className="w-fit"
                  >
                    {formatSeatsLeft(seatsLeft)}
                  </Badge>
                </CardContent>

                <CardFooter className="pt-0">
                  {/* AC2: full class — no active CTA */}
                  {/* AC3: available class — CTA linking to class detail (Story 3.3 forward link) */}
                  {!isFull && (
                    <Button
                      asChild
                      className="min-h-[44px] w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Link href={`/portal/classes/${cls.id}`}>
                        View class
                      </Link>
                    </Button>
                  )}
                  {isFull && (
                    // Calm "Class full" acknowledgement — no dead/misleading CTA (AC2, UX-DR3)
                    <p className="text-sm text-muted-foreground">
                      This class is fully booked.
                    </p>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
