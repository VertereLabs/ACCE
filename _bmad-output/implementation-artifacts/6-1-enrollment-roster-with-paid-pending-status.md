---
baseline_commit: 070df5196315e8131a501f4ebe795fcc877672ee
---

# Story 6.1: Enrollment roster with paid / pending status

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Priyanka (ADMIN),
I want to open a class and see everyone enrolled in it with whether they've paid (`CONFIRMED`) or are still mid-payment (`PENDING`),
so that I know who to expect and who's still finishing checkout — and get a clear empty state when nobody has enrolled yet.

## Context & current state (READ FIRST)

This is the **FIRST story of Epic 6** and the **first admin per-class detail surface**. Epics 1–5 are `done`:
the admin can create/list/edit classes, students browse/reserve/pay/cancel, and enrollments move through
their full status lifecycle (`PENDING → CONFIRMED → CANCELLED/ATTENDED/NO_SHOW`).

**Today there is NO admin page for a single class.** `/admin/classes` (Story 2.2, the index) lists every class with a
per-row **Edit** link only. Story 6.1 adds the **class detail = roster page** at `(admin)/admin/classes/[id]/page.tsx`
— a **READ-ONLY** view listing that class's enrollments with a paid/pending status column. Marking attendance
(`ATTENDED`/`NO_SHOW`) is **Story 6.2**; the seat-confirmation email is **Story 6.3**. This story writes NOTHING.

**Route decision:** the roster IS the class detail page at `[id]` (a sibling of the existing `[id]/edit`), exactly as
named in ARCHITECTURE-SPINE's source tree (`(admin)/admin/classes/[id] roster`) and Capability map. It is **not** a
separate `/roster` sub-route and **not** a tab on the edit form.

What already exists and MUST be reused (do NOT recreate):

- **`GroupSession` model** — load the target class by id (`findUnique`), `notFound()` if missing. [Source: acce-nextjs/prisma/schema.prisma:114-133]
- **`Enrollment` model** — `studentId`, `student → User`, `groupSessionId`, `status EnrollmentStatus` (`PENDING | CONFIRMED | CANCELLED | ATTENDED | NO_SHOW`), `pendingExpiresAt DateTime?`, `priceCents`, `createdAt`, `@@index([groupSessionId, status])` (backs the per-class roster query). **This story only READS enrollments — it never writes one.** [Source: acce-nextjs/prisma/schema.prisma:134-167]
- **`User` model** — `name String` (non-null), `email String @unique`. Use these for the roster's student column. [Source: acce-nextjs/prisma/schema.prisma:23-42]
- **`requireAdmin()`** in `src/lib/auth-guards.ts` — the TRUSTED entry guard (AD-3). Call it at the TOP of the page **before any data fetch or JSX**. [Source: acce-nextjs/src/lib/auth-guards.ts]
- **`db` singleton** from `@/lib/db` — the ONLY `PrismaClient` (AD-2). Never `new PrismaClient()`. [Source: acce-nextjs/src/lib/db.ts]
- **`formatZar`, `formatMode`, `formatStatus`** in `src/lib/class-display.ts` — reuse for the class header facts (price/mode/status). Do NOT re-implement Rand formatting. [Source: acce-nextjs/src/lib/class-display.ts]
- **shadcn primitives present**: `table`, `badge`, `card`, `button`, `separator` in `src/components/ui/`. Use `table` + `badge` for the roster; **no new dependency**. [Source: acce-nextjs/src/components/ui/*]
- **Existing dynamic-route pattern** (`[id]/edit/page.tsx`, `students/[id]/page.tsx`): `params: Promise<{ id: string }>` → `await requireAdmin()` → `await params` → `findUnique` → `notFound()`. **Mirror this exactly.** [Source: acce-nextjs/src/app/(admin)/admin/classes/[id]/edit/page.tsx; (admin)/admin/students/[id]/page.tsx]
- **2.2 index page** — `/admin/classes/page.tsx` renders the class Table with a per-row Edit link; you ADD a per-row **Roster/View** link so the new page is reachable. [Source: acce-nextjs/src/app/(admin)/admin/classes/page.tsx:188-198]
- **e2e route manifest** — `tests/e2e/authenticated-routes.ts`; dynamic routes use the deterministic seeded id `seed-class-acc-1`. [Source: acce-nextjs/tests/e2e/authenticated-routes.ts:52-55]

**This story = a read-only admin class-detail/roster page at `(admin)/admin/classes/[id]/page.tsx` that shows the class's key facts (header) + a table of its enrollments (student name/email, enrolled-at, status label paid/pending/attended/no-show), a clear empty state, plus small wiring (per-row link from the classes index, add the dynamic route to the e2e manifest) and a NEW pure `enrollment-display.ts` status-label helper. NO status write, NO attendance mark, NO email, NO schema change.**

## Acceptance Criteria

**AC1 — Populated roster shows each enrolled student with paid/pending status (FR17, UX-DR8).**
Given a class with one or more enrollments,
When an authenticated ADMIN opens `/admin/classes/{id}`,
Then the page renders the class's key facts (subject, title, date/time, mode, price, status) as a header **and** a table with one row per enrollment showing the **student name and email**, **enrolled-at date/time**, and a **status label** — `CONFIRMED` → "Paid" and `PENDING` → "Pending" (with `ATTENDED` → "Attended", `NO_SHOW` → "No-show" also labelled), rendered as `Badge` variants using the existing design tokens. Rows are ordered by `createdAt` ascending.

**AC2 — Empty state when nobody is enrolled.**
Given a class with **no** (non-cancelled) enrollments,
When the ADMIN opens the roster,
Then instead of an empty table they see a clear empty-state message (e.g. "No one has enrolled in this class yet.") in a `Card`, using the token system — not a new palette.

**AC3 — Roster reads enrollments directly and writes NOTHING (AD-5, AD-14).**
Given enrollments in various states,
When the roster is built,
Then it queries `Enrollment` rows for this `groupSessionId` **directly** (the roster is NOT bound by the AD-5 occupancy definition — spine), **excludes `CANCELLED`** rows (a cancelled seat has returned to the pool and the student is no longer "enrolled"), and **treats an expired `PENDING` hold as still "Pending"** (readers never write — there is NO lazy expiry flip here; the real `PENDING → CANCELLED` flip lives only inside a locked mutation in `enrollment.ts`). The page issues **NO `UPDATE`/write of any kind** and does not call `enrollment.ts` or `wallet.ts`.

**AC4 — Authorization enforced at the page entry, and unknown id 404s (AD-3).**
Given a non-admin (or unauthenticated) actor,
When they request `/admin/classes/{id}` directly (bypassing the `(admin)` layout via a direct RSC request),
Then `requireAdmin()` at the top of the page redirects them (`/sign-in` if unauthenticated, `/portal` if a non-admin) **before any class or enrollment data is fetched**. And given an `id` that matches no `GroupSession`, the page calls `notFound()` (mirrors the 2.3 edit / 3.5 student pages).

**AC5 — Reachable from the classes index, and the chain stays green with a new unit test.**
The `/admin/classes` index (Story 2.2) gains a per-row link ("Roster" or "View") to `/admin/classes/{id}`. `npx prisma validate` passes (schema untouched), `npm run build` succeeds (tsc clean; `/admin/classes/[id]` appears in the route table as ƒ Dynamic), and `npm test` (vitest) stays green **including a new unit test** on the pure `formatEnrollmentStatus` helper and the roster's status-filter shape. The dynamic `/admin/classes/seed-class-acc-1` route is added to the authenticated-route manifest so the 200-smoke covers it. No schema/migration files are modified.

## Tasks / Subtasks

- [x] **Task 1 — Pure, testable enrollment-display helper (`db`-free) (AC1, AC5).**
  - [x] Create `src/lib/enrollment-display.ts` (pure, `db`-free, mirrors `class-display.ts`) exporting `formatEnrollmentStatus(status: EnrollmentStatus): string` mapping `CONFIRMED → "Paid"`, `PENDING → "Pending"`, `ATTENDED → "Attended"`, `NO_SHOW → "No-show"`, `CANCELLED → "Cancelled"` (CANCELLED is filtered out of the roster query, but the label must be total/exhaustive so the switch stays type-safe and 6.2 can reuse it). Import the enum **type-only** (`import type { EnrollmentStatus } from "@prisma/client"`) so vitest imports it without the client runtime — this is the same trick `class-occupancy.ts` uses.
  - [x] Also export a small `enrollmentStatusBadgeVariant(status): "default" | "secondary" | "destructive" | "outline"` (or keep the variant mapping local to the page — but the label function MUST live in the pure module so it is unit-testable). Suggested variants: `CONFIRMED` = `default` (paid/positive), `PENDING` = `secondary` (in-progress), `ATTENDED` = `outline`, `NO_SHOW` = `destructive`. Do NOT hardcode hex — variants resolve to navy+gold tokens per light/dark mode (UX-DR2/DR6).
- [x] **Task 2 — Roster page (server component, read-only) (AC1, AC2, AC3, AC4).**
  - [x] Create `src/app/(admin)/admin/classes/[id]/page.tsx` as a **server component** with `interface Props { params: Promise<{ id: string }> }`. Body: `await requireAdmin()` FIRST (AD-3, trusted guard), then `const { id } = await params`, then `db.groupSession.findUnique({ where: { id }, select: { id, title, start, end, mode, status, priceCents, subject: { select: { name: true } } } })`; if falsy → `notFound()`.
  - [x] Fetch the roster: `db.enrollment.findMany({ where: { groupSessionId: id, status: { not: "CANCELLED" } }, orderBy: { createdAt: "asc" }, select: { id, status, createdAt, student: { select: { name: true, email: true } } } })`. This is a **direct** enrollment read (NOT the AD-5 `occupiedEnrollmentWhere` filter — the roster shows PENDING+CONFIRMED+ATTENDED+NO_SHOW, including expired PENDING). Run it in parallel with the class fetch via `Promise.all` if you like, but you need the class first for `notFound()` — either sequence is fine; do NOT write anywhere.
  - [x] Render a **header** with the class facts (subject name, title, `formatDateTime(start)`, `formatMode(mode)` badge, `formatZar(priceCents)`, `formatStatus(status)` badge) and a "← Back to classes" link to `/admin/classes` (mirror the edit/student page header pattern).
  - [x] If `enrollments.length === 0` → the AC2 **empty-state** `Card` ("No one has enrolled in this class yet."). Else a shadcn **`Table`**: columns Student (name + email muted), Enrolled (native `toLocaleString`), Status (`Badge` via `formatEnrollmentStatus` + variant). Wrap the table in `overflow-x-auto rounded-md border` for narrow screens.
  - [x] Page is fully server-rendered — **no client island**, so the 1.5 RSC-500 non-children-prop trap cannot fire. Date formatting uses native `Intl`/`toLocaleString` (`"en-ZA"`), **no date library**.
- [x] **Task 3 — Wire it up so the roster is reachable and smoke-covered (AC5).**
  - [x] `(admin)/admin/classes/page.tsx`: add a per-row **Roster/View** link (`<Button asChild variant="ghost" size="sm" className="min-h-[44px]"><Link href={`/admin/classes/${cls.id}`}>Roster</Link></Button>`) in the existing Actions cell, next to Edit. Keep the gold "New class" CTA dominant (secondary/ghost for row links).
  - [x] `tests/e2e/authenticated-routes.ts`: append `{ path: "/admin/classes/seed-class-acc-1", role: "ADMIN" }` with a Story-6.1 comment (mirrors the 2.3 `/edit` dynamic-route entry; live run deferred to CI ephemeral-Postgres).
- [x] **Task 4 — Unit-test the pure helper + filter shape (AC3, AC5).**
  - [x] Add `tests/unit/enrollment-display.test.ts`: assert every `formatEnrollmentStatus` mapping (`CONFIRMED`="Paid", `PENDING`="Pending", `ATTENDED`="Attended", `NO_SHOW`="No-show", `CANCELLED`="Cancelled"); assert the badge-variant mapping if you export it. Optionally pin the roster status-filter constant (`{ not: "CANCELLED" }`) in a tiny exported helper if you factor it out — otherwise the filter is exercised only by the page (DB-bound, CI). Do NOT unit-test the page itself (it imports `db`).
- [x] **Task 5 — Verify the chain (AC5).**
  - [x] `npx prisma validate` → passes (schema untouched).
  - [x] `npm run build` → succeeds (tsc clean; `/admin/classes/[id]` present in the route table as ƒ Dynamic).
  - [x] `npm test` → vitest green, including the new `enrollment-display` assertions.
  - [x] Live-DB populated-roster read is deferred to CI ephemeral-Postgres (same sandbox wall as every prior story — prod DB creds are blocked interactively). Static verification is the bar; do NOT fake a live query.

## Dev Notes

### Architecture guardrails (from ARCHITECTURE-SPINE — binding)
- **Roster is NOT bound by AD-5 occupancy:** the spine states verbatim *"Roster/attendance views query enrollments directly and are not bound by this occupancy definition."* So do NOT reuse `occupiedEnrollmentWhere` here — that filter is for seats-left math (excludes CANCELLED/ATTENDED/NO_SHOW and expired PENDING). The roster shows the human picture: every non-cancelled enrollment, including expired PENDING holds still labelled "Pending". [Source: ARCHITECTURE-SPINE.md#AD-5 (roster note)]
- **AD-14 — `enrollment.ts` is the SOLE `Enrollment.status` writer:** this read-only roster must issue NO status write. Marking `ATTENDED`/`NO_SHOW` (Story 6.2) will call an `enrollment.ts` transition function — do NOT add it here, and do NOT write status inline anywhere. [Source: ARCHITECTURE-SPINE.md#AD-14]
- **AD-3 — Authorization at the entry layer, not the layout:** `requireAdmin()` at the top of the page is the trusted guard; the `(admin)` layout is defense-in-depth (a direct RSC request skips it). [Source: ARCHITECTURE-SPINE.md#AD-3; auth-guards.ts]
- **AD-2 — Single data gateway:** import `{ db }` from `@/lib/db`; never `new PrismaClient()`. [Source: ARCHITECTURE-SPINE.md#AD-2]
- **AD-9 — Money is integer cents (ZAR):** class `priceCents` formatted via the existing `formatZar` at the UI edge only. No float. [Source: ARCHITECTURE-SPINE.md#AD-9]
- **AD-1 — Additive isolation:** the new page lives only under `(admin)/admin/classes/[id]`; marketing routes, SEO, sitemap, headers untouched. [Source: ARCHITECTURE-SPINE.md#AD-1]
- **AD-10 — Join-details gating is a STUDENT concern:** `meetingUrl`/`location` are gated for the enrolled student's own portal view (Story 3.3). This is the ADMIN roster — Priyanka may legitimately see class facts, but this story does NOT need to display `meetingUrl`/`location` at all (not in the ACs). Keep the header to subject/title/time/mode/price/status; don't add join-detail fields. [Source: ARCHITECTURE-SPINE.md#AD-10]

### Data model facts this story depends on (from schema.prisma — verified)
- `Enrollment { id, studentId, student → User, groupSessionId, session → GroupSession, priceCents, status EnrollmentStatus @default(PENDING), pendingExpiresAt DateTime?, paymentRef String? @unique, createdAt, @@unique([studentId, groupSessionId]), @@index([groupSessionId, status]) }`. The `@@index([groupSessionId, status])` backs the roster query cheaply. [Source: schema.prisma:142-167]
- `EnrollmentStatus` enum values: `PENDING, CONFIRMED, CANCELLED, ATTENDED, NO_SHOW`. [Source: schema.prisma:134-141]
- `User { id, name String (non-null), email String @unique, role String? }` — `name` is always present (Better Auth requires it), so `student.name` needs no null fallback, but `student.name || student.email` is a safe belt-and-braces mirror of the 3.5 student page. [Source: schema.prisma:23-42]
- `GroupSession { id, subjectId, subject → Subject, title, start, end, mode Mode, priceCents, status GroupSessionStatus, ... }`. [Source: schema.prisma:114-133]

### Scope boundary (do NOT do — belongs to other stories)
- **No attendance mark, no `ATTENDED`/`NO_SHOW` write, no action/mutation, no client island** — that is Story 6.2 (it will add per-row buttons calling an `enrollment.ts` transition under AD-14). This story only surfaces the labels so 6.2 has a place to attach the controls.
- **No seat-confirmation email, no `email.ts`/`meeting.ts` touch** — Story 6.3.
- **No portal polish / seats-left / toast work** — Story 6.4.
- **No `meetingUrl`/`location` display** — not in the ACs (AD-10 is a student-side concern).
- **No schema/migration/enum change, no new dependency, no date library, no pagination/search** (rosters are ≤ capacity 6 in 1a).
- **No AD-5 occupancy recompute** — the index (2.2) already shows occupied/seats-left; the roster shows people, not seat math.

### Previous story intelligence (Epic 2 / Epic 3 / Epic 5 — the reuse map)
- **2.2 (`/admin/classes` index, done)** is the direct structural predecessor: server component, `requireAdmin()` first, `db` read, shadcn `Table`/`Badge`, gold-token CTA, e2e-manifest wiring, pure `db`-free display helpers unit-tested. **Mirror it.** You ADD one per-row link to its Actions cell (like Story 2.3 added Edit). [Source: 2-2-list-and-view-classes-in-admin.md]
- **2.3 edit page & 3.5 student page** give the exact dynamic-route recipe: `params: Promise<{id}>`, `await requireAdmin()`, `await params`, `findUnique`, `notFound()`, "← Back" link, plain `<div>` wrapper (the `(admin)` layout owns the single `<main>` landmark — the 1.3 a11y fix; do NOT add a nested `<main>`). [Source: (admin)/admin/classes/[id]/edit/page.tsx; (admin)/admin/students/[id]/page.tsx]
- **class-display.ts pure-helper pattern:** `formatZar`/`formatMode`/`formatStatus` are `db`-free and unit-tested; `enrollment-display.ts` is the direct analog for enrollment status. Type-only Prisma import keeps vitest DB-free (as in `class-occupancy.ts`). [Source: src/lib/class-display.ts; src/lib/class-occupancy.ts]
- **1.5 RSC-500 trap + smoke net:** never pass a Client Component element through a non-`children` prop from a Server Component (silent HTTP 500, invisible to tsc/unit). This page is fully server-rendered with no client island → safe; add the dynamic route to the manifest for the 200-smoke net. [Source: 1-5...md; lessons-learned; tests/e2e/authenticated-routes.ts]
- **Sandbox reality (every prior story):** prod DB creds are blocked interactively; live DB reads are deferred to CI ephemeral-Postgres. Static verification (`prisma validate` + `build` + vitest) is the bar. The seed provisions ADMIN only (no student rows, no enrollments) — a fresh-seed roster renders the **empty state** (AC2). Do NOT fake a live populated query. [Source: deferred-work.md; 2-2/3-5 Task 5]
- **Git:** work lands on branch `epic-6` (chained off the `epic-5` tip). A net-new `[id]` route + one small edit to the index page + one manifest line + two new pure/test files — nothing conflicts with prior epics. [Source: sprint-status.yaml]

### UX / accessibility (UX-DR8, UX-DR2/DR6, NFR10)
- **UX-DR8 (roster readability):** the roster is a scannable table using the navy+gold token system and shadcn `Table`/`Badge` — NO new palette. Status reads at a glance via badge variant + label ("Paid" green/default, "Pending" muted/secondary). Student column shows name prominently with email as `text-muted-foreground` beneath (mirror the 3.5 student header treatment). [Source: DESIGN.md; UX-DR8; (admin)/admin/students/[id]/page.tsx]
- Every interactive control (the row links, the back link) keyboard-operable with a visible focus ring, ≥44px touch targets, ≥4.5:1 / ≥3:1 contrast in BOTH modes; honor `prefers-reduced-motion`. shadcn `Button`/`Table`/`Badge` already carry focus-ring + token styling. [Source: ARCHITECTURE-SPINE.md#Consistency Conventions; NFR10]
- Table horizontally scrollable on narrow screens (`overflow-x-auto` container) — admin is desktop-first but must not break on mobile.

### Testing standards
- Framework: **vitest** (jsdom), `npm test`, specs under `tests/unit/**`. Playwright e2e is separate (`tests/e2e`, DB-bound) — not run here, but DO add the route to `authenticated-routes.ts`. [Source: 2-2...md; acce-nextjs/vitest.config.ts]
- Unit-test the **pure** `formatEnrollmentStatus` (all 5 enum values → exact strings) and any exported badge-variant/filter helper. Do NOT unit-test the page (imports `db`, needs `DATABASE_URL`); do NOT over-mock Prisma to fake `findMany` — the live populated roster is a CI concern. The tested seam is the label map + variant map. [Source: 2-2...md Testing standards]

### Project Structure Notes
- App root `acce-nextjs/`; alias `@/*` → `acce-nextjs/src/*`.
- New files (all NEW):
  - `src/lib/enrollment-display.ts` — pure `formatEnrollmentStatus` (+ badge-variant helper).
  - `src/app/(admin)/admin/classes/[id]/page.tsx` — server component roster page (guard → class findUnique/notFound → direct enrollment read → header + table/empty-state).
  - `tests/unit/enrollment-display.test.ts` — status-label + variant assertions.
- UPDATE (small, additive):
  - `src/app/(admin)/admin/classes/page.tsx` — add a per-row "Roster/View" link to `/admin/classes/{id}` in the Actions cell.
  - `tests/e2e/authenticated-routes.ts` — append `/admin/classes/seed-class-acc-1` (ADMIN).

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 6.1 / Epic 6 / FR17, UX-DR8]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md#AD-1, AD-2, AD-3, AD-5 (roster note), AD-9, AD-10, AD-14, "Capability → Architecture Map" (Admin class CRUD + roster FR16,17)]
- [Source: acce-nextjs/prisma/schema.prisma:23-42 (User), 115-133 (GroupSession), 135-167 (Enrollment + EnrollmentStatus)]
- [Source: acce-nextjs/src/lib/auth-guards.ts] · [Source: acce-nextjs/src/lib/db.ts] · [Source: acce-nextjs/src/lib/class-display.ts] · [Source: acce-nextjs/src/lib/class-occupancy.ts (type-only Prisma import pattern)]
- [Source: acce-nextjs/src/app/(admin)/admin/classes/page.tsx (index — add row link)] · [Source: (admin)/admin/classes/[id]/edit/page.tsx; (admin)/admin/students/[id]/page.tsx (dynamic-route recipe + header/empty-state treatment)]
- [Source: acce-nextjs/tests/e2e/authenticated-routes.ts (manifest + seed-class-acc-1 convention)]
- [Source: _bmad-output/implementation-artifacts/2-2-list-and-view-classes-in-admin.md (predecessor patterns, sandbox posture, CTA-token rule)]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md (CI ephemeral-Postgres for live DB ops)]

### Latest tech notes
- **Prisma 6.19.3**: `findMany` with a nested `student: { select: { name, email } }` and a `status: { not: "CANCELLED" }` filter is standard; the `@@index([groupSessionId, status])` covers the where-clause. Import `EnrollmentStatus` as a **type-only** import in the pure helper so vitest doesn't load the client runtime. [Source: schema.prisma generator; ARCHITECTURE-SPINE.md#Stack]
- **Next 16 App Router**: `[id]/page.tsx` is a server component by default; `params` is a `Promise` and must be `await`ed (same as the sibling `[id]/edit` page). Keep it server-rendered (no client island) to avoid the RSC non-children-prop 500 trap (1.5). [Source: (admin)/admin/classes/[id]/edit/page.tsx]
- **`toLocaleString("en-ZA", { … })`**: use for the enrolled-at and class start display, consistent with the 2.2 list and 3.5 student page (no explicit `timeZone` — matches the create/edit round-trip frame; the display-timezone hardening is a cross-cutting deferred item, do NOT unilaterally pin it here). No `date-fns`/`dayjs`. [Source: 2-2...md Review Findings (timezone defer)]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6 (autopilot subagent, 2026-07-07)

### Debug Log References

No debug issues. All tasks completed cleanly on first attempt.

### Completion Notes List

- Task 1: Created `src/lib/enrollment-display.ts` — pure, db-free module with `formatEnrollmentStatus` (5 enum values → exact label strings) and `enrollmentStatusBadgeVariant` (5 values → shadcn Badge variants). Type-only Prisma import prevents vitest from loading the client runtime. Both functions are exhaustive over all EnrollmentStatus values including CANCELLED (filtered from query, but type-safe).
- Task 2: Created `src/app/(admin)/admin/classes/[id]/page.tsx` — server component roster page. requireAdmin() called first (AD-3), params awaited (Next 16 pattern), class fetched via findUnique with notFound() guard, enrollments fetched directly with `status: { not: "CANCELLED" }` (NOT the AD-5 occupiedEnrollmentWhere filter per ARCHITECTURE-SPINE roster note). Renders class header (subject, title, datetime, mode badge, price, status badge) + empty-state Card when 0 enrollments + enrollment Table with student/enrolled/status columns using formatEnrollmentStatus + enrollmentStatusBadgeVariant. Fully server-rendered, no client island.
- Task 3: Added per-row "Roster" link to `/admin/classes/${cls.id}` in the Actions cell of the 2.2 classes index (alongside the existing Edit link). Added `/admin/classes/seed-class-acc-1` (ADMIN) to the authenticated-route e2e manifest.
- Task 4: `tests/unit/enrollment-display.test.ts` — 10 assertions covering all 5 formatEnrollmentStatus mappings and all 5 enrollmentStatusBadgeVariant mappings.
- Task 5: `npx prisma validate` clean. `npm run build` clean — `/admin/classes/[id]` present as ƒ Dynamic. `npm test` — 440/440 pass (up from 430, +10 new enrollment-display assertions). Live populated-roster read deferred to CI ephemeral-Postgres.

### File List

acce-nextjs/src/lib/enrollment-display.ts (NEW)
acce-nextjs/src/app/(admin)/admin/classes/[id]/page.tsx (NEW)
acce-nextjs/tests/unit/enrollment-display.test.ts (NEW)
acce-nextjs/src/app/(admin)/admin/classes/page.tsx (MODIFIED — added Roster link)
acce-nextjs/tests/e2e/authenticated-routes.ts (MODIFIED — added /admin/classes/seed-class-acc-1)

## Change Log

- 2026-07-07: Story 6.1 implemented — enrollment roster page at /admin/classes/[id] with paid/pending status (pure helper + roster page + unit tests + index wiring + e2e manifest). 440/440 vitest, build clean, prisma validate clean.
