// my-classes/page.tsx — Story 5.1 (AC1–AC4, AC6) + Story 5.2 (AC5 — live cancel island).
//
// Security model (AD-3): requireSession() is the TRUSTED page-level guard.
// It runs BEFORE any data fetch or JSX, so unauthenticated users are redirected
// to /sign-in even if they bypass the (portal) layout via a direct RSC request.
//
// All enrollment queries are keyed strictly by session.user.id — never a
// client-supplied id — so a student can never see another student's classes (AC4).
//
// Story 5.2 update: the INERT cancel button is replaced with the live
//   <CancelEnrollmentButton> client island that fires cancelEnrollmentAction.
//   - Props are all plain serialisable values (RSC-500 safe, 1.5 lesson).
//   - The page still computes advisory refund preview props; the action recomputes
//     authoritatively under the lock (single source guarantee, AD-11).
//   - AD-10: meetingUrl / location are NOT selected here (3.3 detail page gate).
//
// A11y (NFR10): plain <div> wrapper — the (portal) layout owns the single
//   <main> landmark (1.3 a11y fix). All controls keyboard-operable, ≥44px.

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
import { Badge } from "@/components/ui/badge";
import { CancelEnrollmentButton } from "./cancel-enrollment-button";
import { EmptyState } from "@/components/ui/empty-state";

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
      {/* UX-DR2: "Browse available classes" is navigational — subordinate link, not gold CTA. */}
      {isEmpty && (
        <EmptyState
          message="You haven't booked any upcoming classes yet."
          action={{ href: "/portal/classes", label: "Browse available classes" }}
        />
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

            // cancelLabel drives the advisory preview shown on the button (UX-DR6).
            // The CancelEnrollmentButton island also builds the same label from refundPct.

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

                      {/* Cancel affordance — LIVE client island (Story 5.2).
                           - Props are all plain serialisable values (RSC-500 safe, 1.5 lesson).
                           - refundCents / refundPct are advisory previews; cancelEnrollmentAction
                             recomputes the refund authoritatively under the lock (AD-11).
                           - CancelEnrollmentButton owns the AlertDialog confirm + sonner toast. */}
                      <CancelEnrollmentButton
                        enrollmentId={enrollment.id}
                        refundCents={refundCents}
                        refundPct={refundPct}
                        classTitle={cls.title}
                      />
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
