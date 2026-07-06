// my-classes/page.tsx — Story 5.1 (AC1–AC4, AC6).
// Read-only server component — fully server-rendered, no client island.
//
// Security model (AD-3): requireSession() is the TRUSTED page-level guard.
// It runs BEFORE any data fetch or JSX, so unauthenticated users are redirected
// to /sign-in even if they bypass the (portal) layout via a direct RSC request.
//
// All enrollment queries are keyed strictly by session.user.id — never a
// client-supplied id — so a student can never see another student's classes (AC4).
//
// Scope boundary (AD-5, AD-6, AD-14): this page is a PURE READER.
//   - No status writes, no wallet writes, no seat-return (all Story 5.2).
//   - Cancel button is INERT/disabled — a forward affordance only (mirrors
//     3.3's "Pay with balance" inert button before 3.4 made it live).
//   - AD-10: meetingUrl / location are NOT selected here; each row links to
//     /portal/classes/[id] where the AD-10 gate already reveals join details
//     for a CONFIRMED viewer (built in 3.3).
//
// AD-11 refund preview: hours-to-start → tier → advisory % displayed in the
//   cancel button label text (UX-DR6: state carried in text, not colour alone).
//   5.2 recomputes authoritatively at cancel-time; this preview is advisory.
//
// A11y (NFR10): plain <div> wrapper — the (portal) layout owns the single
//   <main> landmark (1.3 a11y fix). All controls keyboard-operable, ≥44px.
//   Disabled button is still perceivable/announced (native disabled attribute).

import Link from "next/link";
import { requireSession } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { formatZar, formatMode } from "@/lib/class-display";
import { hoursUntilStart, computeRefund } from "@/lib/cancellation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Date formatting — native Intl, no date library.
// Convention: toLocaleString("en-ZA", …) with NO explicit timeZone pin.
// (Same deferred-timezone convention as 3.1/3.2/3.3 — consistent across the app.)
// ---------------------------------------------------------------------------

function formatClassDate(date: Date): string {
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

export default async function MyClassesPage() {
  // AD-3: trusted page-level guard — runs before any data fetch or JSX.
  const session = await requireSession();
  const studentId = session.user.id;

  // Compute 'now' once per request (consistent across all rows).
  // hoursUntilStart uses getTime() difference (tz-independent, AD-11).
  const now = new Date();

  // Fetch only the viewer's CONFIRMED, upcoming enrollments (AC1, AD-5).
  //   - status: "CONFIRMED" — excludes PENDING, CANCELLED, ATTENDED, NO_SHOW.
  //   - session.start > now — excludes past classes (the ones cancel no longer applies to).
  //   - NO meetingUrl / location select (AD-10 — those stay gated in the 3.3 detail page).
  //   - priceCents from the enrollment row = the immutable snapshot taken at reserve-time (AD-16).
  //   - Ordered by session start ascending (AC1 — soonest first).
  const enrollments = await db.enrollment.findMany({
    where: {
      studentId,
      status: "CONFIRMED",
      session: { start: { gt: now } },
    },
    orderBy: { session: { start: "asc" } },
    select: {
      id: true,
      priceCents: true, // enrollment snapshot (AD-16), NOT the class price
      session: {
        select: {
          id: true,
          title: true,
          start: true,
          mode: true,
          subject: { select: { name: true } },
        },
      },
    },
  });

  const isEmpty = enrollments.length === 0;

  return (
    // Plain <div> — the (portal) layout owns the single <main> landmark (1.3 a11y fix).
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">My classes</h1>

      {/* ── Empty state (AC3, UX-DR4) ─────────────────────────────────── */}
      {isEmpty && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <p className="text-muted-foreground">
              You haven&apos;t booked any upcoming classes yet.
            </p>
            <Link
              href="/portal/classes"
              className="text-sm font-medium text-foreground/80 underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Browse available classes
            </Link>
          </CardContent>
        </Card>
      )}

      {/* ── Enrollment list (AC1, AC2) ─────────────────────────────────── */}
      {!isEmpty && (
        <div className="flex flex-col gap-4">
          {enrollments.map((enrollment) => {
            const { session: cls } = enrollment;

            // Compute advisory refund preview (AC2, AD-11).
            // hours is fractional/negative-safe; refundPct is purely advisory.
            const hours = hoursUntilStart(cls.start, now);
            const { refundPct, refundCents } = computeRefund(
              enrollment.priceCents,
              hours,
            );

            // Build cancel button label carrying the refund state in text (UX-DR6).
            const cancelLabel =
              refundPct === 100
                ? "Cancel — 100% refund"
                : refundPct === 70
                  ? "Cancel — 70% refund"
                  : "Cancel — no refund";

            return (
              <Card key={enrollment.id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {cls.subject.name}
                      </p>
                      <CardTitle className="mt-0.5 text-lg leading-snug">
                        {cls.title}
                      </CardTitle>
                    </div>
                    <Badge variant="outline">{formatMode(cls.mode)}</Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    {/* Class details */}
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <span>{formatClassDate(cls.start)}</span>
                      <span className="font-medium text-foreground">
                        {formatZar(enrollment.priceCents)} per seat
                      </span>
                      {/* Advisory refund amount preview (optional, AD-11) */}
                      {refundPct > 0 && (
                        <span className="text-xs">
                          Refund preview:{" "}
                          <span className="font-medium">
                            {formatZar(refundCents)}
                          </span>
                          {" "}(advisory — recomputed at cancel time)
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* Details link — AD-10: join details (meetingUrl/location)
                           are revealed on this page for a CONFIRMED viewer. */}
                      <Link
                        href={`/portal/classes/${cls.id}`}
                        className="flex h-11 items-center rounded-md px-3 text-sm font-medium text-foreground/80 hover:bg-accent/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        View details
                      </Link>

                      {/* Cancel affordance — INERT / disabled in Story 5.1.
                           - Story 5.2 will convert this into a live client island.
                           - disabled attribute keeps it perceivable/announced (NFR10).
                           - Label text carries the refund state (UX-DR6: not colour alone).
                           - Not a gold CTA (subordinate/disabled) — uses default variant (UX-DR2). */}
                      <Button
                        variant="outline"
                        size="default"
                        disabled
                        aria-label={`${cancelLabel} for ${cls.title}`}
                        className="h-11 min-w-[160px]"
                        aria-disabled="true"
                      >
                        {cancelLabel}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
