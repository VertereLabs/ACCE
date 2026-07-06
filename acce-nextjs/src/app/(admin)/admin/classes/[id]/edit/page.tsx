// Edit class page — Story 2.3 (Task 4, AC1, AC3, AC4).
// Server component: guard → load row → notFound() if missing → render client form.
//
// Security (AD-3): requireAdmin() is the TRUSTED guard — runs BEFORE any data fetch.
// RSC-500 guard (1.5 lesson): pass plain serialisable data props to the client form,
// never a client element through a non-children prop.
//
// Next 16 dynamic route: params must be awaited.

import { notFound } from "next/navigation";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { LEVELS } from "@/lib/class-constants";
import { EditClassForm } from "./edit-class-form";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface EditClassPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Format a Date to the "YYYY-MM-DDTHH:mm" string an <input type="datetime-local">
 * expects, using the SERVER's local wall clock — the SAME timezone frame that
 * `z.coerce.date()` uses when it re-parses the submitted string on save, and that
 * the 2.2 list uses to display (`toLocaleString`, no explicit timeZone).
 *
 * Using `toISOString()` here would emit the UTC wall clock, which — on any non-UTC
 * deploy — pre-fills a different time than the list shows AND shifts the stored
 * instant on every edit round-trip. Formatting in server-local keeps edit
 * consistent with create/list and makes the round-trip lossless (AC1).
 */
function toDatetimeLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default async function EditClassPage({ params }: EditClassPageProps) {
  // AD-3: trusted page-level guard — runs before any data fetch or JSX.
  await requireAdmin();

  const { id } = await params;

  // Load the class and subjects in parallel.
  const [session, subjects] = await Promise.all([
    db.groupSession.findUnique({
      where: { id },
      select: {
        id: true,
        subjectId: true,
        level: true,
        title: true,
        description: true,
        start: true,
        end: true,
        capacity: true,
        priceCents: true,
        mode: true,
        location: true,
        meetingUrl: true,
        updatedAt: true,
        subject: { select: { name: true } },
      },
    }),
    db.subject.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!session) {
    notFound();
  }

  // Serialise for the client form (no Date objects across the RSC boundary).
  // toISOString() → the AC4 optimistic-concurrency token.
  const initialValues = {
    id: session.id,
    subjectId: session.subjectId,
    level: session.level,
    title: session.title,
    description: session.description ?? "",
    // datetime-local format: "YYYY-MM-DDTHH:mm" in SERVER-local time — consistent
    // with the create-form parse frame and the 2.2 list display (round-trip-safe).
    start: toDatetimeLocalInput(session.start),
    end: toDatetimeLocalInput(session.end),
    capacity: session.capacity,
    // AD-9: stored as cents → Rand for the form (cents / 100, keep up to 2 dp)
    priceRand: session.priceCents / 100,
    mode: session.mode as "ONLINE" | "IN_PERSON",
    location: session.location ?? "",
    meetingUrl: session.meetingUrl ?? "",
    expectedUpdatedAt: session.updatedAt.toISOString(),
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="mb-6">
        <Link
          href="/admin/classes"
          className="mb-4 inline-block text-sm text-muted-foreground hover:underline"
        >
          ← Back to classes
        </Link>
        <h1 className="text-2xl font-semibold">
          Edit class:{" "}
          <span className="text-muted-foreground">{session.subject.name}</span>{" "}
          — {session.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Make changes below and click Save changes to update.
        </p>
      </div>

      {/* ── Edit form (client island, pre-filled) ───────────────────────── */}
      <EditClassForm
        subjects={subjects}
        levels={[...LEVELS]}
        initialValues={initialValues}
      />
    </div>
  );
}
