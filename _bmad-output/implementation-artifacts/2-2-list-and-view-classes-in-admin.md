---
baseline_commit: be17fc7ee12efc6c999cf41d67b074e6c3774f65
---

# Story 2.2: List and view classes in admin

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Priyanka (ADMIN),
I want a list of all my classes with their key facts (subject, date/time, capacity, occupied/seats-left, price, mode, status),
so that I can see what's scheduled and pick one to manage — and get a clear "create your first class" prompt when none exist yet.

## Context & current state (READ FIRST)

Epic 1 is `done` and **Story 2.1 is `done`**: the admin can already CREATE a class. The create form
(`(admin)/admin/classes/new`) persists one `SCHEDULED` `GroupSession` and, on success,
**currently `router.push('/admin')`** — a deliberate fallback because the classes list did not exist yet.
**This story builds that list at `/admin/classes` (the index) as a READ-ONLY view**, and closes the fallback
loop 2.1 left open.

What already exists and MUST be reused (do NOT recreate):

- **`GroupSession` model, fully migrated** — `id cuid`, `subjectId → Subject`, `level String`, `title`, `description?`, `start DateTime`, `end DateTime`, `capacity Int`, `priceCents Int`, `mode Mode @default(ONLINE)`, `location String?`, `meetingUrl String?`, `status GroupSessionStatus @default(SCHEDULED)`, `createdAt`, `updatedAt`. **No schema or migration change is in scope.** [Source: acce-nextjs/prisma/schema.prisma:114-132]
- **`Enrollment` model** — `status EnrollmentStatus` (`PENDING | CONFIRMED | CANCELLED | ATTENDED | NO_SHOW`), `pendingExpiresAt DateTime?`, relation `session → GroupSession`, and index `@@index([groupSessionId, status])` that backs the occupancy count (AD-5). **No enrollment rows are written by this story — it only reads/counts them.** [Source: acce-nextjs/prisma/schema.prisma:134-158]
- **`requireAdmin()`** in `src/lib/auth-guards.ts` — the TRUSTED entry guard (AD-3). Call it at the top of the page **before any data fetch or JSX**. [Source: acce-nextjs/src/lib/auth-guards.ts]
- **`db` singleton** from `@/lib/db` — the ONLY `PrismaClient` (AD-2). Never `new PrismaClient()`. [Source: acce-nextjs/src/lib/db.ts]
- **Admin shell** — `(admin)/layout.tsx` guards with `requireAdmin()` and renders the portal nav + `<main>`. `(admin)/admin/page.tsx` is a minimal landing ("Class management arrives in Epic 2." — update its copy + add a link, below). [Source: acce-nextjs/src/app/(admin)/admin/page.tsx; (admin)/layout.tsx]
- **shadcn primitives present**: `table`, `badge`, `card`, `button`, `separator` — all in `src/components/ui/`. Use `table` + `badge` for this list; no new dependency. [Source: acce-nextjs/src/components/ui/*]
- **`cn()`** from `@/lib/utils` for class merging. [Source: acce-nextjs/src/lib/utils.ts]
- **2.1 patterns to mirror**: pure, importable, `db`-free helper modules that vitest can test without a live DB (`class-constants.ts`, `class-form-schema.ts`); a colocated server page that calls `requireAdmin()` then reads via `db`. [Source: 2-1-create-a-group-class.md]
- **1.5 e2e manifest** — `tests/e2e/authenticated-routes.ts` drives the authenticated 200-smoke; its header comment literally shows `{ path: '/admin/classes', role: 'ADMIN' }` as the next entry to add. [Source: acce-nextjs/tests/e2e/authenticated-routes.ts:22]

**This story = a read-only admin classes index at `(admin)/admin/classes/page.tsx` that lists every `GroupSession` with derived occupancy (AD-5), a clear empty state with a "create the first class" CTA, plus small wiring (link from `/admin`, repoint the 2.1 success redirect, add the route to the e2e manifest). NO edit, NO delete, NO enrollment/wallet/payment code, NO schema change.**

## Acceptance Criteria

**AC1 — Populated list shows every class with its key facts (FR16).**
Given one or more `GroupSession` rows exist,
When an authenticated ADMIN opens `/admin/classes`,
Then a list/table renders one row per class showing: **subject name**, **date/time** (start; end and/or duration acceptable), **capacity**, **occupied and seats-left**, **per-seat price formatted in Rand** (from `priceCents`, AD-9 — format at the UI edge only), **mode** (Online / In-person), and **status** (Scheduled / Cancelled / Completed). Rows are ordered chronologically by `start` (ascending).

**AC2 — Empty state prompts creating the first class.**
Given no `GroupSession` rows exist,
When the ADMIN opens `/admin/classes`,
Then instead of an empty table they see a clear empty-state message and a **primary CTA linking to `/admin/classes/new`** ("Create your first class" or similar). The gold-accent CTA styling follows the existing token system (UX-DR2), not a new palette.

**AC3 — Occupancy is derived read-only per AD-5 (never stored, never written).**
Given classes with enrollments in various states,
When the list computes "occupied",
Then `occupied = count(Enrollment where status ∈ {PENDING, CONFIRMED} AND (pendingExpiresAt IS NULL OR pendingExpiresAt > now))` and `seatsLeft = max(0, capacity − occupied)`; **expired `PENDING` holds are treated as free**; and the page issues **NO `UPDATE`/write of any kind** (no lazy expiry flip — that belongs only inside a locked mutation in `enrollment.ts`, a later epic). `CANCELLED`, `ATTENDED`, and `NO_SHOW` enrollments do NOT count toward occupied.

**AC4 — Authorization enforced at the page entry (AD-3).**
Given a non-admin (or unauthenticated) actor,
When they request `/admin/classes` directly (bypassing the layout via a direct RSC request),
Then `requireAdmin()` at the top of the page redirects them (`/sign-in` if unauthenticated, `/portal` if a non-admin) before any class data is fetched or rendered — the `(admin)` layout/middleware is defense-in-depth, not the trusted guard.

**AC5 — Chain stays green (no regressions), with a new unit test on the AD-5 occupancy rule.**
`npx prisma validate` passes (schema untouched), `npm run build` succeeds (tsc clean, `/admin/classes` appears in the route table), and `npm test` (vitest) stays green **including a new unit test** that pins the AD-5 occupancy filter and the pure display helpers (ZAR formatting + seats-left arithmetic). No schema/migration files are modified. The `/admin/classes` route is added to the 1.5 authenticated-route manifest so the 200-smoke covers it.

## Tasks / Subtasks

- [x] **Task 1 — Pure, testable occupancy filter + display helpers (`db`-free) (AC1, AC3, AC5).**
  - [x] Create `src/lib/class-occupancy.ts` exporting a pure function `occupiedEnrollmentWhere(now: Date)` that returns the Prisma relation-filter for an OCCUPYING enrollment: `{ status: { in: ["PENDING", "CONFIRMED"] }, OR: [ { pendingExpiresAt: null }, { pendingExpiresAt: { gt: now } } ] }`. This is the SINGLE source of the AD-5 occupancy definition (Epic 3 browse/checkout will reuse it). Do NOT import `db`/Prisma runtime here — return a plain object literal typed to `Prisma.EnrollmentWhereInput` (import the *type only*, `import type { Prisma } from "@prisma/client"`), so vitest can import it without a live DB. Also export `computeSeatsLeft(capacity: number, occupied: number): number` = `Math.max(0, capacity - occupied)`. [Source: ARCHITECTURE-SPINE.md#AD-5; schema.prisma:134-158]
  - [x] Create `src/lib/class-display.ts` (pure, `db`-free) exporting `formatZar(cents: number): string` that renders integer cents as Rand for the UI edge (e.g. `29000 → "R290.00"`; use explicit `R` + `toFixed(2)` for locale-independent output). Also exports `formatMode(mode)` → "Online" / "In-person" and `formatStatus(status)` label helper. This is the AD-9 "format to Rand only at the UI edge" boundary — never store or compute money as a float; input is always integer cents. [Source: ARCHITECTURE-SPINE.md#AD-9]
- [x] **Task 2 — Admin classes index page (server component, read-only) (AC1, AC2, AC3, AC4).**
  - [x] Create `src/app/(admin)/admin/classes/page.tsx` as a **server component**: call `await requireAdmin()` FIRST (trusted page guard, AD-3), then compute `const now = new Date()` ONCE and query via `db.groupSession.findMany({ orderBy: { start: "asc" }, select: { ..., subject: { select: { name: true } }, _count: { select: { enrollments: { where: occupiedEnrollmentWhere(now) } } } } })`. Uses filtered `_count` so occupancy runs in the DB without N+1 or loading enrollment rows. **No writes anywhere** (AD-5 — readers never write; no PENDING expiry flip).
  - [x] Render: if `classes.length === 0` → the AC2 **empty state** (Card with message and gold-accent CTA `<Link href="/admin/classes/new">`); else a shadcn **`Table`** with header row and one body row per class showing subject name, start date/time (native `toLocaleString`, no date library), capacity, `occupied / seatsLeft` ("N / M left"), `formatZar(priceCents)`, mode (Badge), and status (Badge). Page heading "Classes" + secondary "New class" Button (gold accent) at top.
  - [x] Page is fully server-rendered — no client island, no non-`children` prop trap (1.5 RSC-500 guard satisfied).
  - [x] Date formatting uses native `Intl`/`toLocaleString` — no date library added.
- [x] **Task 3 — Small wiring so the list is reachable, lands the create flow, and is smoke-covered (AC2, AC5).**
  - [x] `(admin)/admin/page.tsx`: updated copy + added "Manage classes" Button link to `/admin/classes` and "New class" link. Stays a server component with `requireAdmin()`.
  - [x] `(admin)/admin/classes/new/class-form.tsx`: repointed create-success navigation from `router.push('/admin')` to `router.push('/admin/classes')`. Success toast unchanged. Only change to 2.1 files.
  - [x] `tests/e2e/authenticated-routes.ts`: appended `{ path: "/admin/classes/new", role: "ADMIN" }` (2.1 backfill) and `{ path: "/admin/classes", role: "ADMIN" }` (2.2). Manifest shape unchanged.
- [x] **Task 4 — Unit test the AD-5 filter + display helpers (AC3, AC5).**
  - [x] Added `tests/unit/class-occupancy.test.ts` — 13 assertions: `status.in` contains exactly PENDING+CONFIRMED (not CANCELLED/ATTENDED/NO_SHOW); OR clause has 2 branches covering `null` and `{ gt: now }`; expired PENDING excluded by construction (no lte branch); exact `now` Date passes through; `computeSeatsLeft(6,2)===4`, `(4,4)===0`, `(4,5)===0` (never-negative), `(6,0)===6`.
  - [x] Added `tests/unit/class-display.test.ts` — 10 assertions: `formatZar(29000)==="R290.00"`, `formatZar(0)==="R0.00"`, `formatZar(29050)==="R290.50"` (no float drift), `formatZar(100)==="R1.00"`, `formatZar(1)==="R0.01"`; `formatMode` ONLINE/IN_PERSON; `formatStatus` SCHEDULED/CANCELLED/COMPLETED.
- [x] **Task 5 — Verify the chain (AC5).**
  - [x] `npx prisma validate` → passed (schema untouched).
  - [x] `npm run build` → succeeded (tsc clean; `/admin/classes` present in route table as ƒ Dynamic).
  - [x] `npm test` → 142/142 vitest green (was 119, +23 new: 13 occupancy + 10 display).
  - [x] Live-DB read deferred to CI ephemeral-Postgres — same sandbox wall as 1.1/1.4/1.5/2.1. Static verification is the bar.

## Dev Notes

### Architecture guardrails (from ARCHITECTURE-SPINE — binding)
- **AD-5 — Capacity is DERIVED, never stored; readers never write:** `occupied = count(Enrollment where status ∈ {PENDING, CONFIRMED} AND (pendingExpiresAt IS NULL OR pendingExpiresAt > now))`; `seatsLeft = capacity − occupied`. There is NO stored seat counter — never add one. The listing path treats expired `PENDING` as free **but must not issue any UPDATE**; the real `PENDING → CANCELLED` expiry flip happens only inside a locked mutation in `enrollment.ts` (later epic), so this read can never race a webhook. `@@index([groupSessionId, status])` backs the count. [Source: ARCHITECTURE-SPINE.md#AD-5; schema.prisma:157]
- **AD-3 — Authorization at the entry layer, not the layout:** `requireAdmin()` at the top of the page is the trusted guard; the `(admin)` layout is defense-in-depth. A layout is NOT a security boundary (direct RSC request skips it). [Source: ARCHITECTURE-SPINE.md#AD-3; auth-guards.ts]
- **AD-2 — Single data gateway:** import `{ db }` from `@/lib/db`; never `new PrismaClient()`. [Source: ARCHITECTURE-SPINE.md#AD-2]
- **AD-9 — Money is integer cents (ZAR):** `priceCents` is stored as integer cents; format to Rand ONLY at the UI edge (`formatZar`). No float ever computed or stored. [Source: ARCHITECTURE-SPINE.md#AD-9; schema.prisma:124]
- **AD-1 — Additive isolation:** the new route lives only under `(admin)/admin/classes`; marketing routes, SEO, sitemap, and headers are untouched. [Source: ARCHITECTURE-SPINE.md#AD-1]
- **Capability map:** "Class discovery + seats-left (FR4,5)" and "Admin class CRUD (FR16)" both lean on AD-5 — the `occupiedEnrollmentWhere` helper you write here is the reusable seam Epic 3's portal browse (Story 3.2 "N seats left") will import. Put it in `src/lib/` (domain-adjacent), not buried in the admin page. [Source: ARCHITECTURE-SPINE.md#Capability → Architecture Map]

### Data model facts this story depends on (from schema.prisma — verified)
- `GroupSession` scalar fields exactly as listed in "Context & current state"; `status` enum `SCHEDULED | CANCELLED | COMPLETED`, `mode` enum `ONLINE | IN_PERSON`. [Source: schema.prisma:103-132]
- `Enrollment.status` enum values: `PENDING, CONFIRMED, CANCELLED, ATTENDED, NO_SHOW`; `pendingExpiresAt DateTime?`. Only `PENDING`+`CONFIRMED` (unexpired) occupy a seat. [Source: schema.prisma:134-158]
- `Subject { id, name @unique }` — include `subject: { select: { name: true } }` to show the subject name. [Source: schema.prisma:96-101]
- Prisma supports a **filtered relation `_count`** (`_count: { select: { enrollments: { where: … } } }`) — this is how you get `occupied` in the DB without loading enrollment rows or an N+1 loop. Confirm the installed Prisma (6.19.3) supports it (it does; filtered `_count` GA since 5.0). If for any reason the filtered `_count` shape misbehaves, the fallback is `db.enrollment.groupBy({ by: ['groupSessionId'], where: occupiedEnrollmentWhere(now), _count: true })` and a map-merge — but prefer the filtered `_count`. [Source: schema.prisma; ARCHITECTURE-SPINE.md#Stack (prisma 6.19.3)]

### Scope boundary (do NOT do — belongs to other stories)
- **No edit form, no per-row edit/delete action, no capacity-vs-occupied check, no `updatedAt`/optimistic-concurrency, no `FOR UPDATE`** — that is Story 2.3 (AD-16). 2.3 will attach row-level "Edit" links to THIS table.
- **No enrollment/wallet/ledger/Paystack/email code; no writing any Enrollment row; no lazy PENDING expiry flip** (AD-5 — readers never write).
- **No portal (student) class list** — that is Story 3.2 (it reuses `occupiedEnrollmentWhere`). This story is the ADMIN index only.
- No schema/migration/enum change; no new dependency; no date library.
- No pagination/search/filtering UI (dataset is tiny in 1a — 6 seeded classes; add later if needed).

### Previous story intelligence (Epic 2 / Epic 1)
- **2.1 (done) is the direct predecessor:** it created `/admin/classes/new`, `class-constants.ts`, `class-form-schema.ts` + `toCents`, `actions.ts`, `class-form.tsx`, and 36 schema unit tests (119/119 green). Mirror its pure-module-testability pattern. Its create-success redirect currently points to `/admin` as a fallback — **you repoint it to `/admin/classes`** (Task 3). [Source: 2-1-create-a-group-class.md]
- **2.1 code-review note:** the primary CTA must use token classes (`bg-accent text-accent-foreground hover:bg-accent/90`), NOT hardcoded hex, so gold+navy flip per light/dark mode (UX-DR2/DR6). Apply the same to this story's empty-state CTA. [Source: 2-1...md Change Log 2026-07-06]
- **1.4 pattern:** extract pure importable constants/schemas into a `db`-free module so vitest (jsdom) tests them without a live DB — the occupancy/display helpers are the analog. [Source: 1-4...md]
- **1.5 RSC-500 trap + smoke net:** never pass a Client Component element through a non-`children` prop from a Server Component (silent HTTP 500, invisible to tsc/unit). This page is fully server-rendered with no client island, so it is safe; adding `/admin/classes` (and backfilling `/admin/classes/new`) to the authenticated-route manifest gives the 200-smoke a regression net. [Source: 1-5...md; lessons-learned; tests/e2e/authenticated-routes.ts]
- **Sandbox reality (1.1/1.4/1.5/2.1):** prod DB creds are blocked interactively; live DB reads are deferred to CI ephemeral-Postgres. Static verification (`prisma validate` + `build` + vitest) is the bar. Do NOT fake a live query. [Source: deferred-work.md; 2-1...md Task 5]
- **Git:** work lands on branch `epic-2` (chained off epic-1 tip). Recent Epic-2 commit: 2.1 create-class (LEVELS/schema/action/form/tests). Nothing conflicts with a net-new `classes` index route + two small UPDATE edits. [Source: sprint-status.yaml]

### UX / accessibility (UX-DR2, UX-DR6, NFR10)
- Reuse the existing navy+gold token system and shadcn primitives (`table`, `badge`, `card`, `button`) — NO new palette. One gold-accent primary CTA per view: the empty-state "Create your first class" (and the top "New class" button may use the same accent — keep a single dominant CTA). Use token utilities (`bg-accent text-accent-foreground`), not hardcoded hex. [Source: DESIGN.md; 2-1...md]
- Every interactive control keyboard-operable with a visible focus ring, ≥44px touch targets, ≥4.5:1 body / ≥3:1 large-text contrast in BOTH dark and light modes; honor `prefers-reduced-motion`. The shadcn `Button`/`Table`/`Badge` already carry the focus-ring and token styling — follow the `/admin/classes/new` page's structure. [Source: (admin)/admin/classes/new/page.tsx; ARCHITECTURE-SPINE.md#Consistency Conventions]
- Status/mode as `Badge` variants for scannability (e.g. Scheduled=default, Cancelled=destructive/muted, Completed=secondary; Online vs In-person as a subtle badge). Seats-left reads clearly as "occupied / capacity" or "N left". Table should be horizontally scrollable on narrow screens (wrap in an overflow container) — admin is desktop-first but must not break on mobile.

### Testing standards
- Framework: **vitest** (jsdom), `npm test`, specs under `tests/unit/**`. Playwright e2e is separate (`tests/e2e`, DB-bound) — not required to run here, but DO add the route to `authenticated-routes.ts`. [Source: 2-1...md; acce-nextjs/vitest.config.ts]
- Unit-test the **pure** `occupiedEnrollmentWhere` (AD-5 filter shape), `computeSeatsLeft` (incl. never-negative), and `formatZar` (AD-9 cents→Rand, pin exact string). Do NOT unit-test the page (it imports `db` and needs `DATABASE_URL`); do NOT over-mock Prisma to fake a filtered `_count` — the live count is a CI/pipeline concern. The tested seam is the where-fragment + arithmetic + formatter. [Source: 2-1...md Testing standards]

### Project Structure Notes
- App root `acce-nextjs/`; alias `@/*` → `acce-nextjs/src/*`.
- New files (all NEW):
  - `src/lib/class-occupancy.ts` — pure `occupiedEnrollmentWhere(now)` (AD-5 filter) + `computeSeatsLeft`.
  - `src/lib/class-display.ts` — pure `formatZar` (+ optional mode/status label helpers).
  - `src/app/(admin)/admin/classes/page.tsx` — server component list page (guard + read-only query + render).
  - `tests/unit/class-occupancy.test.ts` — AD-5 filter + seats-left assertions.
  - `tests/unit/class-display.test.ts` — ZAR formatting assertions (may be merged into the occupancy test file).
- UPDATE (small, additive):
  - `src/app/(admin)/admin/page.tsx` — add a "Manage classes" link to `/admin/classes`; freshen the placeholder copy.
  - `src/app/(admin)/admin/classes/new/class-form.tsx` — repoint create-success `router.push('/admin')` → `/admin/classes`.
  - `tests/e2e/authenticated-routes.ts` — append `/admin/classes` (+ backfill `/admin/classes/new`).

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2 / Epic 2 / FR16]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md#AD-1, AD-2, AD-3, AD-5, AD-9, "Consistency Conventions", "Capability → Architecture Map"]
- [Source: acce-nextjs/prisma/schema.prisma:96-158] · [Source: acce-nextjs/src/lib/auth-guards.ts] · [Source: acce-nextjs/src/lib/db.ts] · [Source: acce-nextjs/src/lib/utils.ts]
- [Source: acce-nextjs/src/app/(admin)/admin/page.tsx; (admin)/admin/classes/new/page.tsx; (admin)/admin/classes/new/class-form.tsx]
- [Source: acce-nextjs/tests/e2e/authenticated-routes.ts (manifest + how-to-add)]
- [Source: _bmad-output/implementation-artifacts/2-1-create-a-group-class.md (predecessor patterns, sandbox posture, CTA-token fix)]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md (CI ephemeral-Postgres for live DB ops)]

### Latest tech notes
- **Prisma 6.19.3**: filtered relation `_count` via `_count: { select: { enrollments: { where: … } } }` is supported (GA since 5.0) — get `occupied` in the DB, no N+1. Import `Prisma` as a **type-only** import in the pure helper so vitest doesn't load the client runtime. [Source: schema.prisma generator; ARCHITECTURE-SPINE.md#Stack]
- **Next 16 App Router**: `/admin/classes/page.tsx` is a server component by default — `await requireAdmin()` then `await db.…` inline; no route handler or client island needed for a read-only list. Keep it server-rendered to avoid the RSC non-children-prop 500 trap (1.5). [Source: 2-1...md Latest tech notes]
- **`Intl`/`toLocaleString`**: `(cents/100).toLocaleString("en-ZA", { style: "currency", currency: "ZAR" })` yields a Rand string; pin whichever exact form you assert in the test (locale currency output can differ from a plain `R290.00`). No `date-fns`/`dayjs` — native `Date`/`Intl` only.

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6 (autopilot subagent, 2026-07-05)

### Debug Log References

No blocking issues. `formatZar` uses explicit `R${(cents/100).toFixed(2)}` instead of `toLocaleString("en-ZA")` to guarantee locale-independent output in both Node.js and jsdom environments (pinned exact string in tests).

### Completion Notes List

- ✅ Task 1: Created `src/lib/class-occupancy.ts` — pure `occupiedEnrollmentWhere(now)` (AD-5 filter, type-only Prisma import) + `computeSeatsLeft` (clamped to 0). Reusable seam for Epic 3.
- ✅ Task 1: Created `src/lib/class-display.ts` — pure `formatZar` (explicit R+toFixed(2), AD-9), `formatMode`, `formatStatus`.
- ✅ Task 2: Created `src/app/(admin)/admin/classes/page.tsx` — server component; `requireAdmin()` first; filtered `_count` for AD-5 occupancy (no N+1, no writes); empty-state Card + populated Table; gold-accent CTAs using token classes; fully server-rendered (no RSC-500 trap).
- ✅ Task 3: Updated `(admin)/admin/page.tsx` — "Manage classes" + "New class" links; updated `class-form.tsx` — repointed success redirect to `/admin/classes`; updated `authenticated-routes.ts` — added `/admin/classes/new` (2.1 backfill) + `/admin/classes`.
- ✅ Task 4: `tests/unit/class-occupancy.test.ts` (13 assertions) + `tests/unit/class-display.test.ts` (10 assertions). No DB mocking required.
- ✅ Task 5: `prisma validate` clean (schema untouched), `npm run build` clean (tsc + `/admin/classes` in route table), `npm test` 142/142 green (+23 new tests). Live-DB read deferred to CI ephemeral-Postgres.

### File List

- `acce-nextjs/src/lib/class-occupancy.ts` (NEW)
- `acce-nextjs/src/lib/class-display.ts` (NEW)
- `acce-nextjs/src/app/(admin)/admin/classes/page.tsx` (NEW)
- `acce-nextjs/tests/unit/class-occupancy.test.ts` (NEW)
- `acce-nextjs/tests/unit/class-display.test.ts` (NEW)
- `acce-nextjs/src/app/(admin)/admin/page.tsx` (UPDATED)
- `acce-nextjs/src/app/(admin)/admin/classes/new/class-form.tsx` (UPDATED — redirect + comment only)
- `acce-nextjs/tests/e2e/authenticated-routes.ts` (UPDATED — 2 new entries)

## Change Log

- 2026-07-05: Story 2.2 implemented — read-only admin classes index at `/admin/classes`. Added pure AD-5 occupancy helper (`class-occupancy.ts`) + ZAR formatter (`class-display.ts`); server-rendered table with filtered `_count` occupancy; empty-state gold CTA; wired admin landing + 2.1 success redirect + e2e manifest. 23 new unit tests. 142/142 vitest green, build clean, prisma validate clean.
