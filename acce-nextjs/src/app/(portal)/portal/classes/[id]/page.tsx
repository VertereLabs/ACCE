// Class detail + checkout page — Story 3.3 (AC1–AC5, AC6).
// Dynamic server component: guard → enrollment lookup → class fetch → checkout panel.
//
// Security model (AD-3): requireSession() is the TRUSTED page-level guard.
// It runs BEFORE any data fetch or JSX. The session.user.id drives ALL lookups —
// the client never supplies a student id.
//
// AD-10 — Join-detail gating (THE headline of this story):
//   meetingUrl (ONLINE) and location (IN_PERSON) are selected ONLY when the viewer
//   holds a CONFIRMED enrollment. Never merely hidden in JSX — server-side omission
//   means the fields never reach the client payload for non-confirmed viewers.
//
// AD-5 — Readers never write: occupancy is derived via occupiedEnrollmentWhere +
//   computeSeatsLeft (single-source, from class-occupancy.ts). This page issues NO
//   write of any kind. Lazy PENDING→CANCELLED expiry belongs only inside a locked
//   mutation in enrollment.ts (Story 3.4 / Epic 4).
//
// AD-6 — getBalance() read-only: used to compute checkout eligibility (balance >= price).
//   wallet.mutate is NOT called here (BOOKING_CHARGE is Story 3.4).
//
// AD-9 — Money is integer cents: priceCents and balanceCents are integers throughout.
//   Only formatZar() converts to Rand at the UI edge.
//
// AD-4 — No reservation here: the "Pay with balance" button is INERT/disabled.
//   Story 3.4 converts the panel to a client island, adds reserveSeat(), and wires it.
//
// A11y (NFR10): page uses a plain <div> wrapper — the (portal) layout owns the single
//   <main> landmark (1.3 a11y fix — never nest a second <main>).
//
// Next 16 App Router: params is a Promise and must be awaited.

import Link from "next/link";
import { notFound } from "next/navigation";

import { requireSession } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { occupiedEnrollmentWhere, computeSeatsLeft } from "@/lib/class-occupancy";
import { formatZar, formatMode, formatSeatsLeft } from "@/lib/class-display";
import { getBalance } from "@/lib/wallet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// ---------------------------------------------------------------------------
// Date formatting — native Intl, no date library (consistent with 2.2/2.3/3.2).
// No explicit timeZone pin — consistent with the 2.2/2.3/3.1/3.2 timezone-deferral
// convention; hardening is a system-wide deferred decision (deferred-work.md).
// ---------------------------------------------------------------------------

function formatDateTime(date: Date): string {
  return date.toLocaleString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface ClassDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClassDetailPage({ params }: ClassDetailPageProps) {
  // AD-3: trusted page-level guard — runs before any data fetch or JSX.
  // Redirects to /sign-in if no session.
  const session = await requireSession();
  const studentId = session.user.id;

  // Next 16: params is a Promise and must be awaited.
  const { id } = await params;

  // Compute the expiry threshold ONCE per request (AD-5).
  const now = new Date();

  // AD-10 — Determine enrollment state FIRST, before deciding which fields to fetch.
  // The compound-unique accessor is studentId_groupSessionId (@@unique([studentId, groupSessionId])).
  // We only need the status at this stage — meetingUrl/location are fetched below only if CONFIRMED.
  const enrollment = await db.enrollment.findUnique({
    where: { studentId_groupSessionId: { studentId, groupSessionId: id } },
    select: { status: true },
  });
  const isConfirmed = enrollment?.status === "CONFIRMED";

  // Fetch the class by id.
  // Base fields — always selected regardless of enrollment status.
  // AD-10: meetingUrl and location are selected ONLY when isConfirmed.
  // Conditional select: two query branches to ensure the sensitive fields never reach the
  // RSC payload for non-confirmed viewers (server-side omission, not JSX hiding).
  let cls: {
    id: string;
    title: string;
    description: string | null;
    start: Date;
    capacity: number;
    priceCents: number;
    mode: "ONLINE" | "IN_PERSON";
    subject: { name: string };
    _count: { enrollments: number };
    meetingUrl?: string | null;
    location?: string | null;
  } | null;

  if (isConfirmed) {
    // CONFIRMED viewer: select meetingUrl and location (AD-10 — join-detail reveal).
    cls = await db.groupSession.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        start: true,
        capacity: true,
        priceCents: true,
        mode: true,
        subject: { select: { name: true } },
        _count: {
          select: {
            enrollments: {
              where: occupiedEnrollmentWhere(now),
            },
          },
        },
        // AD-10: sensitive fields — only for CONFIRMED viewer.
        meetingUrl: true,
        location: true,
      },
    });
  } else {
    // Non-confirmed viewer: omit meetingUrl and location server-side (AD-10).
    const baseResult = await db.groupSession.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        start: true,
        capacity: true,
        priceCents: true,
        mode: true,
        subject: { select: { name: true } },
        _count: {
          select: {
            enrollments: {
              where: occupiedEnrollmentWhere(now),
            },
          },
        },
      },
    });
    cls = baseResult;
  }

  // AC5: unknown id → 404 (Next notFound()).
  if (!cls) {
    notFound();
  }

  // ---------------------------------------------------------------------------
  // Compute occupancy and checkout eligibility (all read-only, AC1, AC4, AD-5, AD-6).
  // ---------------------------------------------------------------------------

  const occupied = cls._count.enrollments;
  const seatsLeft = computeSeatsLeft(cls.capacity, occupied);
  const isFull = seatsLeft === 0;

  // AD-6: read-only balance fetch — getBalance is used to compute eligibility only.
  // wallet.mutate is NOT called (BOOKING_CHARGE is Story 3.4).
  const balanceCents = await getBalance(studentId);

  // AC1: canPayFromBalance — true only when not full, not already confirmed, and
  // wallet covers the price. The "Pay with balance" button is inert in this story.
  const canPayFromBalance =
    !isFull && !isConfirmed && balanceCents >= cls.priceCents;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    // Plain <div> — the (portal) layout owns the single <main> landmark (1.3 a11y fix).
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* ── Back link (ghost/subordinate, UX-DR2) ─────────────────────── */}
      <Link
        href="/portal/classes"
        className="mb-6 inline-block text-sm text-muted-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        ← Back to classes
      </Link>

      {/* ── Class info block (AC1) ──────────────────────────────────────── */}
      <div className="mb-8">
        {/* Subject name + title */}
        <p className="mb-1 text-sm font-medium text-muted-foreground">
          {cls.subject.name}
        </p>
        <h1 className="mb-4 text-2xl font-semibold">{cls.title}</h1>

        {/* Description (optional) */}
        {cls.description && (
          <p className="mb-4 text-sm text-muted-foreground">{cls.description}</p>
        )}

        <div className="flex flex-wrap gap-3 text-sm">
          {/* Date/time */}
          <span className="text-muted-foreground">{formatDateTime(cls.start)}</span>
        </div>

        <Separator className="my-4" />

        <div className="flex flex-wrap items-center gap-4 text-sm">
          {/* Price (AD-9 — integer cents → Rand at UI edge only) */}
          <span className="font-medium">{formatZar(cls.priceCents)} per seat</span>

          {/* Mode */}
          <span className="text-muted-foreground">{formatMode(cls.mode)}</span>

          {/* Seats-left badge (AC1, UX-DR3, AD-5) */}
          <Badge
            variant={isFull ? "secondary" : "default"}
            className="min-h-[24px]"
          >
            {formatSeatsLeft(seatsLeft)}
          </Badge>
        </div>
      </div>

      {/* ── Checkout panel (Card, AC1–AC4, UX-DR2, UX-DR3) ────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {isConfirmed ? "Your class details" : "Book this class"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* ── AC3: CONFIRMED state — show join details ─────────────── */}
          {isConfirmed && (
            <div className="space-y-3">
              {/* Enrolled state — no Pay affordance (AC3) */}
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                You&apos;re enrolled in this class.
              </p>

              {/* AD-10/FR6: mode-dependent join detail reveal */}
              {cls.mode === "ONLINE" && cls.meetingUrl && (
                <p className="text-sm">
                  <span className="font-medium">Meeting link: </span>
                  <a
                    href={cls.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Join online session
                  </a>
                </p>
              )}

              {cls.mode === "IN_PERSON" && cls.location && (
                <p className="text-sm">
                  <span className="font-medium">Location: </span>
                  {cls.location}
                </p>
              )}
            </div>
          )}

          {/* ── AC4: Full class state — no Pay affordance ─────────────── */}
          {!isConfirmed && isFull && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Class full</p>
              <p className="text-sm text-muted-foreground">
                This class is fully booked. Check back in case a seat opens up.
              </p>
            </div>
          )}

          {/* ── AC1: Balance sufficient — "Pay with balance" inert CTA ── */}
          {canPayFromBalance && (
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">Pay with wallet balance</p>
                <p className="text-muted-foreground">
                  Your balance: {formatZar(balanceCents)} · Class price:{" "}
                  {formatZar(cls.priceCents)}
                </p>
              </div>

              {/*
                FORWARD AFFORDANCE — disabled/inert in Story 3.3.
                Story 3.4 converts this panel to a client island and wires the
                live reserveSeat() action + UX-DR5 toast.
                Button is keyboard-operable and perceivable even while disabled.
              */}
              <Button
                disabled
                className="min-h-[44px] w-full bg-accent text-accent-foreground hover:bg-accent/90"
                aria-label="Pay with balance (booking opens soon)"
              >
                Pay with balance
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Booking coming soon
              </p>
            </div>
          )}

          {/* ── AC4: Insufficient balance — calm message, no Pay button ── */}
          {!isConfirmed && !isFull && !canPayFromBalance && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Insufficient wallet balance</p>
              <p className="text-sm text-muted-foreground">
                Your balance: {formatZar(balanceCents)} · Class price:{" "}
                {formatZar(cls.priceCents)}
              </p>
              <p className="text-sm text-muted-foreground">
                Online payment (Paystack) is coming soon (Epic 4). Top up your
                wallet with an admin credit to book now.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
