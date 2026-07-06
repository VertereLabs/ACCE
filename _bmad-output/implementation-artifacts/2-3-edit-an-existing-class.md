---
baseline_commit: 7a38dda4732128acfdbcbfb59002889b42ca0e24
---

# Story 2.3: Edit an existing class

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Priyanka (ADMIN),
I want to edit an existing class's details — fix a time, adjust the per-seat price, or paste the Meet link after scheduling — and be stopped if I try to lower capacity below the seats already taken,
so that I can keep a live class accurate without corrupting bookings students have already made.

## Context & current state (READ FIRST)

Epic 1 is `done`. **Stories 2.1 (`done`) and 2.2 (`done`) already exist**: the admin can CREATE a class
(`(admin)/admin/classes/new`) and SEE the read-only list (`(admin)/admin/classes`). **This story adds the third
CRUD verb — UPDATE — at `(admin)/admin/classes/[id]/edit`**, and it is the story that finally implements the
**AD-16 concurrency-safe admin-edit contract** that 2.1/2.2 deliberately deferred to here.

This is the **FIRST place in the app to take a `FOR UPDATE` row lock inside an interactive transaction.**
`reserveSeat()` / `enrollment.ts` (the other AD-16/AD-4 lock holder) do NOT exist yet — they arrive in Epic 3/4.
You are establishing the `db.$transaction` + `SELECT … FOR UPDATE` pattern; later `reserveSeat` will lock the
**same** `GroupSession` row and the two will serialise naturally on that row. Build it forward-compatibly.

What already exists and MUST be reused (do NOT recreate):

- **`GroupSession` model, fully migrated — including `updatedAt DateTime @default(now()) @updatedAt`.** The
  AD-16 optimistic-concurrency token **already exists in the schema** (verified `schema.prisma:131`) and in the
  `init` migration's `DEFAULT CURRENT_TIMESTAMP`. **NO schema change and NO migration are in scope for this story.**
  Fields: `id cuid`, `subjectId → Subject`, `level String`, `title`, `description?`, `start`, `end`, `capacity Int`,
  `priceCents Int`, `mode Mode @default(ONLINE)`, `location String?`, `meetingUrl String?`,
  `status GroupSessionStatus @default(SCHEDULED)`, `createdAt`, `updatedAt`. [Source: acce-nextjs/prisma/schema.prisma:114-132]
- **`Enrollment` model** — `status ∈ {PENDING, CONFIRMED, CANCELLED, ATTENDED, NO_SHOW}`, `pendingExpiresAt DateTime?`,
  `priceCents Int` (the **immutable price snapshot** taken at reserve-time — AD-16: a class-price edit must NEVER
  touch it), relation `session → GroupSession`, index `@@index([groupSessionId, status])` that backs the occupancy
  count. **This story writes NO Enrollment row — it only COUNTS occupancy to gate capacity.** [Source: schema.prisma:134-158]
- **`occupiedEnrollmentWhere(now)` + `computeSeatsLeft(cap, occ)`** in `src/lib/class-occupancy.ts` — the SINGLE
  source of the AD-5 occupancy predicate (already unit-tested in 2.2). **Reuse it** to count occupied seats for the
  capacity-floor check; do NOT re-derive the filter inline. [Source: acce-nextjs/src/lib/class-occupancy.ts]
- **`createClassSchema` + `toCents(priceRand)`** in `(admin)/admin/classes/new/class-form-schema.ts` — the pure,
  `db`-free Zod schema with the SAME field set + cross-field rules (end>start, IN_PERSON→location) you need for edit,
  plus the AD-9 Rand→cents conversion. **Reuse the field shape** (see Task 1 for the extract-vs-duplicate call).
  [Source: acce-nextjs/src/app/(admin)/admin/classes/new/class-form-schema.ts]
- **`createClassAction`** (`new/actions.ts`) — the reference for the guard→validate→re-check→convert→write order and
  the discriminated `{ ok:true } | { ok:false, fieldErrors, message }` result shape. Your `updateClassAction` mirrors
  it, **but wraps the write in a transaction with a lock** (create had none — AD-16 is edit-only).
  [Source: acce-nextjs/src/app/(admin)/admin/classes/new/actions.ts]
- **`ClassForm`** (`new/class-form.tsx`) — the react-hook-form + zodResolver + shadcn form component (incl. the
  `toDatetimeLocal()` helper and the `typedResolver` cast for coerced date/number fields). The edit form is this
  component **pre-filled with the existing row's values + a hidden `expectedUpdatedAt`**; either parametrise the
  existing component or copy it. [Source: acce-nextjs/src/app/(admin)/admin/classes/new/class-form.tsx]
- **`requireAdmin()`** (`src/lib/auth-guards.ts`) — the TRUSTED guard (AD-3). Call it FIRST inside the action AND at
  the top of the edit page. [Source: acce-nextjs/src/lib/auth-guards.ts]
- **`db` singleton** (`@/lib/db`, `@prisma/adapter-pg` + `pg.Pool`) — the only `PrismaClient` (AD-2). It supports
  interactive transactions (`db.$transaction(async (tx) => …)`) and raw SQL (`tx.$queryRaw`) for the `FOR UPDATE`
  lock. Never `new PrismaClient()`. [Source: acce-nextjs/src/lib/db.ts]
- **The 2.2 list page** (`(admin)/admin/classes/page.tsx`) renders one row per class — you add a per-row **"Edit"**
  link to `/admin/classes/[id]/edit`. [Source: acce-nextjs/src/app/(admin)/admin/classes/page.tsx:158-189]
- **shadcn primitives + sonner** are all present (`card`, `input`, `textarea`, `select`, `form`, `button`, `badge`;
  `toast` from `@/components/ui/sonner`). No new dependency. [Source: acce-nextjs/src/components/ui/*]

**This story = an admin edit route (`(admin)/admin/classes/[id]/edit`) with a pre-filled client form, a colocated
Zod-validated `updateClassAction` that saves changes to the SAME `GroupSession` under a `FOR UPDATE` lock with the
capacity-vs-occupied floor and an optimistic-concurrency (`updatedAt`) check (AD-16), plus a per-row "Edit" link on
the 2.2 list. NO schema/migration change, NO delete, NO status-transition/enrollment/wallet code, NO new dependency.**

## Acceptance Criteria

**AC1 — Editing a class saves the changes to the SAME GroupSession (FR16).**
Given an existing `GroupSession`,
When an authenticated ADMIN opens its edit form at `/admin/classes/[id]/edit`, the form is **pre-populated with the
current values** (subject, level, title, description, start, end, capacity, per-seat price in Rand, mode, location,
`meetingUrl`), and they change one or more fields (**including per-seat price and `meetingUrl`**) and submit,
Then the input is validated with **Zod inside the server action**, `requireAdmin()` passes, and the **same row**
(`id` unchanged) is updated — `priceCents` re-stored as integer cents (Rand × 100, `Math.round`, AD-9),
`meetingUrl` set/updated/cleared as entered — and the admin sees a success confirmation (sonner) and is returned to
`/admin/classes`. No new `GroupSession` row is created.

**AC2 — Capacity cannot be lowered below already-occupied seats, checked under the lock (AD-16).**
Given a class whose current occupancy is `N = count(Enrollment where AD-5 occupancy predicate)`,
When the ADMIN submits an edit that sets `capacity < N`,
Then the edit is **rejected with a clear field-level message** (e.g. "Capacity cannot be below the 4 seats already
taken") and **no write occurs**. The occupancy count and the capacity comparison are evaluated **inside the same
`GroupSession` `FOR UPDATE` transaction** that performs the update, so the check cannot race a concurrent
`reserveSeat` (AD-16). Setting `capacity ≥ N` (including `= N`) is allowed.

**AC3 — Invalid input is rejected with field-level errors (same rules as create).**
Given invalid input — **end at or before start**, **capacity < 1**, a **missing required field**, a
**non-positive/non-numeric price**, or **mode = IN_PERSON with no location** —
When the ADMIN submits,
Then no write occurs and the specific field-level error(s) render on the form; unexpected/server failures surface a
sonner error toast. Expected validation failures return a discriminated `{ ok:false, fieldErrors }` — never a throw
across the UI boundary.

**AC4 — Concurrent/stale edits are rejected (optimistic concurrency, AD-16).**
Given two admins (or two tabs) open the same class, and one saves first,
When the second submits an edit built from the now-stale snapshot,
Then the second write is **rejected** because the `expectedUpdatedAt` it carries no longer matches the row's current
`updatedAt` — the admin sees a clear "this class was changed by someone else, reload and try again" message and
**their stale values do NOT overwrite** the newer ones. The freshly-saved (first) edit is untouched.

**AC5 — Authorization enforced at the entry, and price edits never mutate existing charges (AD-3, AD-16).**
Given a non-admin (or unauthenticated) actor invoking the update action directly, `requireAdmin()` blocks it
server-side **before any read/lock/write** — the `(admin)` layout/middleware is defense-in-depth, not the guard.
And given a class with existing enrollments, when its `priceCents` is edited, the update touches **only the
`GroupSession` row** — no `Enrollment.priceCents` (the immutable reserve-time snapshot) is read for write or changed.

**AC6 — Chain stays green (no regressions), with new unit tests on the edit schema + capacity-floor rule.**
`npx prisma validate` passes (schema untouched), `npm run build` succeeds (tsc clean; `/admin/classes/[id]/edit`
appears in the route table), and `npm test` (vitest) stays green **including new unit tests** on (a) the edit Zod
schema (mirrors the AC3 invalid cases + happy path + Rand→cents) and (b) the **pure** capacity-vs-occupied predicate.
No schema/migration files are modified. The dynamic edit route is added to the 1.5 authenticated-route manifest
(using a deterministic seeded class id) so the 200-smoke covers it (live run deferred to CI ephemeral-Postgres).

## Tasks / Subtasks

- [x] **Task 1 — Edit Zod schema, reusing the create field-shape (pure, `db`-free) (AC1, AC3, AC6).**
  - [x] The edit form needs the SAME fields + cross-field rules as create (`class-form-schema.ts`) **plus** two
    identity/concurrency fields: `id` (non-empty string) and `expectedUpdatedAt` (ISO datetime string, e.g.
    `z.string().min(1)` or `z.coerce.date()` — pick one and be consistent with what the form carries). **Prefer
    extracting** the shared field object out of `new/class-form-schema.ts` into a reusable base (e.g. export a
    `classFieldsSchema` object + a `refineClassFields` helper, or a `baseClassObject` you `.extend()`), then build
    BOTH `createClassSchema` and the new `editClassSchema` from it — so the two never drift. If a clean extract is
    disproportionate (the `.refine`/`.superRefine` on a `ZodEffects` is awkward to `.extend()`), duplicating the
    field block into `editClassSchema` colocated with the edit route is acceptable — but log the choice. Put the edit
    schema in `(admin)/admin/classes/[id]/edit/edit-class-schema.ts` (pure, no `db` import — vitest-safe).
  - [x] Reuse `toCents` from the create schema module (do NOT define a second cents conversion — AD-9 single site).
  - [x] Note `meetingUrl`: on edit it is a first-class editable field (this is the story where Priyanka pastes it,
    AD-13). Allow set/replace and allow **clearing** it (empty string → stored `null`). Same optional-URL validation.
- [x] **Task 2 — Pure capacity-floor helper (`db`-free) (AC2, AC6).**
  - [x] Add a pure predicate — either `capacityBelowOccupied(newCapacity: number, occupied: number): boolean`
    (= `newCapacity < occupied`) or reuse/extend `class-occupancy.ts`. Keep it a single tiny testable function so the
    AD-16 floor rule is pinned in a unit test without a live DB. The occupancy COUNT itself is a DB read (Task 3); this
    helper only encodes the comparison. Put it in `src/lib/class-occupancy.ts` (domain-adjacent, next to the AD-5
    predicate it pairs with) so Epic 3/4's `reserveSeat` can reuse the same floor concept. [Source: ARCHITECTURE-SPINE.md#AD-16, #AD-5]
- [x] **Task 3 — `updateClassAction` — locked, concurrency-safe server action (AC1, AC2, AC3, AC4, AC5).**
  - [x] Create `(admin)/admin/classes/[id]/edit/actions.ts` with `"use server"`. Export
    `updateClassAction(input: unknown): Promise<UpdateClassResult>` where
    `UpdateClassResult = { ok:true; id:string } | { ok:false; fieldErrors?; message? }` (mirror `CreateClassResult`).
  - [x] Order (AD-3 mandate + AD-16 lock):
    1. `await requireAdmin()` FIRST — trusted guard, before any parse/read/lock/write.
    2. `editClassSchema.safeParse(input)`; on failure return `{ ok:false, fieldErrors: error.flatten().fieldErrors }`.
    3. Re-check `subjectId` exists (`db.subject.findUnique`) — reject unknown subject (mirror create).
    4. `priceCents = toCents(parsed.priceRand)` (AD-9).
    5. **Open an interactive transaction and lock the row (AD-16):** inside `db.$transaction(async (tx) => { … })`:
       - Take the row lock: `await tx.$queryRaw\`SELECT id, "updatedAt" FROM "GroupSession" WHERE id = ${id} FOR UPDATE\``
         (raw SQL — Prisma has no `findUnique … FOR UPDATE`). If it returns no row → the class was deleted → return a
         "class no longer exists" failure. This is the SAME `GroupSession` row `reserveSeat` will lock later, so an
         edit and a reservation serialise on it.
       - **Optimistic-concurrency check (AC4):** compare the locked row's `updatedAt` to the submitted
         `expectedUpdatedAt`. If they differ → return `{ ok:false, message: "This class was changed by someone else…" }`
         and do NOT write. (Equivalently, do the update as
         `tx.groupSession.updateMany({ where: { id, updatedAt: expected }, data })` and treat `count === 0` as the
         stale-write rejection — but you STILL need the count-under-lock for AC2, so the explicit lock-then-check is
         cleaner. Pick one; the invariant is: a stale `updatedAt` never overwrites a newer row.)
       - **Capacity floor (AC2), inside the lock:** compute `const now = new Date()`, then
         `const occupied = await tx.enrollment.count({ where: { groupSessionId: id, ...occupiedEnrollmentWhere(now) } })`.
         If `capacityBelowOccupied(parsed.capacity, occupied)` → return
         `{ ok:false, fieldErrors: { capacity: [\`Capacity cannot be below the ${occupied} seats already taken\`] } }`
         and do NOT write. Counting inside the lock is what makes AC2 race-free against a concurrent reserve (AD-16).
       - **Write:** `tx.groupSession.update({ where: { id }, data: { subjectId, level, title, description|null,
         start, end, capacity, priceCents, mode, location (null unless IN_PERSON), meetingUrl (value or null),
         status left untouched } })`. `@updatedAt` bumps `updatedAt` automatically → next stale edit is rejected.
         **Do NOT touch any `Enrollment` row** (AC5 — the `priceCents` snapshot is immutable).
    6. Return `{ ok:true, id }`.
  - [x] Wrap the transaction in try/catch; return `{ ok:false, message: … }` for unexpected DB errors (never throw
    across the boundary for expected failures). `requireAdmin()`'s `NEXT_REDIRECT` must propagate — do not swallow it
    (mirror the create action's no-try/catch-around-requireAdmin fix). [Source: 2-1…md Debug Log]
- [x] **Task 4 — Edit page + pre-filled client form (AC1, AC3, AC4).**
  - [x] Create `(admin)/admin/classes/[id]/edit/page.tsx` as a **server component**: `await requireAdmin()` FIRST,
    then load the class: `db.groupSession.findUnique({ where: { id }, include/select: subject + all editable fields
    incl. updatedAt })` and `db.subject.findMany({ orderBy: { name: "asc" } })` for the options. If the class is not
    found → `notFound()` (Next `not-found`). Pass the row's values + subjects + `LEVELS` + the serialised
    `expectedUpdatedAt` (row.updatedAt.toISOString()) as plain serialisable props to the client form (avoids the 1.5
    RSC non-children-prop 500 trap — pass DATA, never a client element through a non-`children` prop).
  - [x] Render the pre-filled form. **Reuse `ClassForm`** by parametrising it (add optional `mode: "create" | "edit"`,
    `initialValues`, `expectedUpdatedAt`, and a `submitAction`/`onSubmit` seam) OR copy it to
    `[id]/edit/edit-class-form.tsx`. Whichever: (a) `defaultValues` seed every field from the existing row (use
    `toDatetimeLocal()` for start/end); (b) carry `id` + `expectedUpdatedAt` (hidden inputs or in the submitted
    object); (c) on submit call `updateClassAction`, map `fieldErrors` via `setError`, on `{ ok:true }` `toast.success`
    + `router.push("/admin/classes")`, on the stale/concurrent `{ ok:false, message }` show the toast so AC4 is
    visible; (d) keep the single gold-accent CTA using token classes `bg-accent text-accent-foreground hover:bg-accent/90`
    (label "Save changes") — **NOT hardcoded hex** (the 2.1 code-review fix, UX-DR2/DR6); (e) ≥44px targets, visible
    focus rings, both-mode contrast (NFR10). Keep it a client island fed by serialisable props (no RSC-500 trap).
- [x] **Task 5 — Wire the "Edit" link + e2e manifest (AC1, AC6).**
  - [x] In `(admin)/admin/classes/page.tsx` add a per-row **"Edit"** action linking to `/admin/classes/${cls.id}/edit`
    (a shadcn `Button asChild` with a `<Link>`, small/secondary variant — keep the ONE dominant gold CTA rule: the
    "New class" button stays the accent CTA; the row "Edit" is a lower-emphasis link). Add a trailing "Actions"/"" header
    cell. Page stays a server component (no client island added).
  - [x] Append the dynamic edit route to `tests/e2e/authenticated-routes.ts` using a **deterministic seeded id** —
    `{ path: "/admin/classes/seed-class-acc-1/edit", role: "ADMIN" }` (the 1.4 seed creates `seed-class-acc-1`). The
    manifest header already documents "dynamic routes use a real seeded id". Live authenticated smoke is DB-bound →
    deferred to CI ephemeral-Postgres (same wall as 1.5/2.1/2.2); the manifest entry is the regression net.
    [Source: acce-nextjs/prisma/seed-data.ts:62; tests/e2e/authenticated-routes.ts:22-24]
- [x] **Task 6 — Unit tests (AC2, AC3, AC6).**
  - [x] `tests/unit/edit-class-schema.test.ts` — mirror the 2.1 schema suite against `editClassSchema`: happy path
    parses (incl. `id` + `expectedUpdatedAt`); `end<=start` fails; `capacity=0`/negative fails; missing required
    fields fail; `price<=0`/non-numeric fails; `mode=IN_PERSON` with no location fails; `mode=ONLINE` with no
    `meetingUrl` passes; `meetingUrl` set AND cleared (empty) both parse; missing `id`/`expectedUpdatedAt` fails.
  - [x] `tests/unit/class-occupancy.test.ts` (extend) — assert `capacityBelowOccupied(3,4)===true`,
    `(4,4)===false`, `(5,4)===false`, `(1,0)===false` (the AC2 floor: `= occupied` is allowed, `< occupied` rejected).
  - [x] Do NOT unit-test `updateClassAction` (imports `db`) and do NOT over-mock Prisma to fake the `FOR UPDATE`
    lock / count — the concurrency behaviour is a real-Postgres concern (see Task 7). The tested seams are the pure
    schema + the pure floor predicate.
- [x] **Task 7 — Verify the chain (AC6).**
  - [x] `npx prisma validate` → passes (schema untouched — `updatedAt @updatedAt` already present).
  - [x] `npm run build` → succeeds (tsc clean; `/admin/classes/[id]/edit` present in the route table as ƒ Dynamic).
    Watch the same `zodResolver` INPUT-vs-OUTPUT generic cast the create form needed (`typedResolver`) — reuse it.
  - [x] `npm test` → vitest green including the new edit-schema + capacity-floor assertions (baseline 142; added 48 → 190 total).
  - [x] **Live-DB + concurrency verification deferred to CI ephemeral-Postgres** — the `FOR UPDATE` lock, the
    capacity-race, and the optimistic-concurrency reject can only be exercised against a real Postgres (unit mocks
    can't reproduce lock semantics). This is the SAME posture AD-4 states for the no-oversell integration test and the
    same sandbox wall as 1.1/1.4/1.5/2.1/2.2. Do NOT fake a live update. Static verification is the bar here; record
    the deferred concurrency integration test in `deferred-work.md`.

## Dev Notes

### Architecture guardrails (from ARCHITECTURE-SPINE — binding)
- **AD-16 — Admin class edits are governed and concurrency-safe (THE central invariant of this story):** edits run
  under the **same `GroupSession` `FOR UPDATE` lock** as reservation; the **capacity-cannot-drop-below-occupied**
  check is evaluated **inside** that lock; edits carry an **optimistic-concurrency check** on `updatedAt` (reject a
  write against a stale token); `Enrollment.priceCents` is the immutable reserve-time snapshot — later class-price
  edits never alter existing enrollments' charges. This is the first `FOR UPDATE` lock in the codebase; `reserveSeat`
  (Epic 3/4) will lock the same row and serialise with these edits. [Source: ARCHITECTURE-SPINE.md#AD-16]
- **AD-5 — Occupancy is derived, readers-never-write:** the capacity floor counts occupancy via the shared
  `occupiedEnrollmentWhere(now)` predicate; expired PENDING = free. This action **counts** but writes NO Enrollment
  row and performs NO lazy expiry flip (that flip lives only in `enrollment.ts`, a later epic). [Source: ARCHITECTURE-SPINE.md#AD-5]
- **AD-3 — Authorization at the entry, not the layout:** `requireAdmin()` first inside the action AND at the top of
  the page; the `(admin)` layout/middleware is defense-in-depth, not trusted. [Source: ARCHITECTURE-SPINE.md#AD-3]
- **AD-2 — Single data gateway:** import `{ db }` from `@/lib/db`; the transaction uses the injected `tx`; never
  `new PrismaClient()`. [Source: ARCHITECTURE-SPINE.md#AD-2]
- **AD-9 — Money is integer cents (ZAR):** the form takes Rand; `toCents` (single conversion site, reused from the
  create schema) stores integer `priceCents`. No float in domain/DB; Rand only at the UI edge. [Source: ARCHITECTURE-SPINE.md#AD-9]
- **AD-13 — Manual Meet link:** `meetingUrl` is the field this story exists to let Priyanka paste/replace after
  scheduling. Editable, optional, clearable — no auto-generation. [Source: ARCHITECTURE-SPINE.md#AD-13]
- **AD-1 — Additive isolation:** the edit route lives only under `(admin)/admin/classes/[id]/edit`; marketing routes,
  SEO/sitemap, and headers are untouched. [Source: ARCHITECTURE-SPINE.md#AD-1]
- **Convention — server-entry result shape:** discriminated `{ ok:true } | { ok:false, error/fieldErrors }`; Zod at
  the entry before any domain/db work; user-facing errors via sonner. [Source: ARCHITECTURE-SPINE.md#Consistency Conventions]

### Data model facts this story depends on (from schema.prisma — verified)
- `GroupSession.updatedAt` is `DateTime @default(now()) @updatedAt` — **already present** (schema.prisma:131) and
  matches the `init` migration DEFAULT; the AD-16 optimistic-concurrency token needs **no schema change**. `@updatedAt`
  makes Prisma bump it on every `update`, so a stale `expectedUpdatedAt` cleanly fails the AC4 check on the next edit.
- `GroupSession.status` enum `SCHEDULED | CANCELLED | COMPLETED`; `mode` enum `ONLINE | IN_PERSON`. This story does
  NOT change `status` (no cancel/complete transition — that is later scope). [Source: schema.prisma:103-132]
- Occupancy count for AC2: `count(Enrollment where { groupSessionId: id, ...occupiedEnrollmentWhere(now) })` — only
  unexpired `PENDING`+`CONFIRMED` occupy; `CANCELLED/ATTENDED/NO_SHOW` and expired PENDING do NOT. [Source: schema.prisma:134-158; class-occupancy.ts]
- `Subject { id, name @unique }` — reload options and re-check `subjectId` exactly as the create action does.
- Interactive transactions + raw `FOR UPDATE`: `db.$transaction(async (tx) => { … tx.$queryRaw\`… FOR UPDATE\` … })`
  is supported by Prisma 6.19.3 with `@prisma/adapter-pg`. Bind `${id}` via the tagged template (parameterised —
  never string-concatenate SQL). [Source: db.ts; ARCHITECTURE-SPINE.md#Stack]

### Scope boundary (do NOT do — belongs to other stories)
- **No delete / archive**, no status transition (cancel/complete), no roster/attendance — later scope (Epic 6 for
  roster/attendance; a cancel-class flow is not in Epic 2's ACs).
- **No `Enrollment` write of any kind**, no lazy PENDING expiry flip, no wallet/ledger/Paystack/email code (AD-5/AD-14
  — status transitions belong solely to `enrollment.ts`, a later epic).
- **Do NOT build a generic `reserveSeat`/`enrollment.ts` here** — only the `GroupSession`-edit lock. Keep the lock
  logic colocated with the admin edit action (the capability map places admin CRUD under `(admin)/admin/**`, governed
  by AD-16). When `enrollment.ts` lands, it locks the same row; no refactor of this action is forced.
- No schema/migration/enum change; no new dependency; no date library.
- No pagination/search/filter changes to the 2.2 list beyond adding the per-row Edit link.

### Previous story intelligence (Epic 2 / Epic 1)
- **2.1 (done) — create action + form + schema are the direct templates.** Mirror the guard→validate→re-check
  subject→toCents→write order and the discriminated result shape. Its code-review fix: primary CTA must use token
  classes (`bg-accent text-accent-foreground`), NOT hardcoded hex — apply to the "Save changes" CTA. Its build
  gotchas you will hit again: (1) no try/catch around `requireAdmin()` (it throws `NEXT_REDIRECT` natively — wrapping
  it breaks Turbopack); (2) the `zodResolver` INPUT-vs-OUTPUT generic mismatch needs the `typedResolver`
  cast. [Source: 2-1-create-a-group-class.md]
- **2.2 (done) — `class-occupancy.ts` (`occupiedEnrollmentWhere`, `computeSeatsLeft`) is the reusable AD-5 seam** you
  count occupancy through; the list page is where the Edit link attaches. 2.2 also carries the deferred
  **display-timezone** item (start/time rendered in server-local TZ, consistent with 2.1's `datetime-local` parse) —
  do NOT unilaterally pin a TZ here; the edit form's `datetime-local` round-trip must stay consistent with create/list.
  [Source: 2-2-list-and-view-classes-in-admin.md]
- **1.4 pattern:** pure importable schema/constant modules free of `db`/`DATABASE_URL` so vitest tests them without a
  live DB — the edit schema + capacity-floor predicate are the analogs. [Source: 1-4…md]
- **1.5 RSC-500 trap + smoke net:** never pass a Client Component element through a non-`children` prop from a Server
  Component (silent HTTP 500, invisible to tsc/unit). The edit page passes plain data props to the client form — safe;
  adding the dynamic edit route to the authenticated manifest gives the 200-smoke a regression net. [Source: 1-5…md; lessons-learned]
- **Sandbox reality (1.1/1.4/1.5/2.1/2.2):** prod DB creds are blocked interactively; live DB ops + the concurrency
  integration test are deferred to CI ephemeral-Postgres. Static verification (`prisma validate` + `build` + vitest) is
  the bar. Do NOT fake a live update or a lock. [Source: deferred-work.md]
- **Git:** work lands on branch `epic-2` (chained off epic-1 tip). Recent: 2.1 create, 2.2 list. A net-new
  `[id]/edit` route + small list-link + manifest edit conflicts with nothing. [Source: sprint-status.yaml]

### UX / accessibility (UX-DR2, UX-DR6, NFR10)
- Reuse the navy+gold token system + shadcn primitives; NO new palette. One gold-accent primary CTA per view — here
  the "Save changes" submit; the per-row "Edit" link on the list is lower-emphasis (secondary/ghost) so the list's
  "New class" stays the single dominant accent CTA. Use token utilities (`bg-accent text-accent-foreground`), not hex.
- The edit form is pre-filled, so make it obvious which class is being edited (heading with the subject/title). A
  concurrent-edit rejection (AC4) must give an actionable message ("changed by someone else — reload"), not a silent
  no-op or a raw error. [Source: DESIGN.md; 2-1…md; 2-2…md]
- Every control keyboard-operable, visible focus ring, ≥44px targets, ≥4.5:1 body / ≥3:1 large-text contrast in BOTH
  modes; honor `prefers-reduced-motion`. shadcn `Input`/`Select`/`Button` already carry this. [Source: ARCHITECTURE-SPINE.md#Consistency Conventions]

### Testing standards
- Framework: **vitest** (jsdom), `npm test`, specs under `tests/unit/**`. Playwright e2e (`tests/e2e`) is DB-bound —
  not required to run here, but DO add the dynamic edit route to `authenticated-routes.ts`. [Source: acce-nextjs/vitest.config.ts; 2-2…md]
- Unit-test the **pure** edit schema (AC3 cases + happy + Rand→cents + id/expectedUpdatedAt presence + meetingUrl
  set/clear) and the **pure** `capacityBelowOccupied` floor (AC2, incl. the `= occupied` boundary is allowed). Do NOT
  unit-test the action or mock the `FOR UPDATE` lock/count — the concurrency + capacity-race behaviours are a
  real-Postgres integration concern deferred to CI. Over-mocking Prisma to fake a lock proves nothing. [Source: 2-1…md; AD-4 posture]

### Project Structure Notes
- App root `acce-nextjs/`; alias `@/*` → `acce-nextjs/src/*`.
- New files:
  - `src/app/(admin)/admin/classes/[id]/edit/edit-class-schema.ts` — pure edit Zod schema (+ `id`, `expectedUpdatedAt`).
  - `src/app/(admin)/admin/classes/[id]/edit/actions.ts` — `"use server"` `updateClassAction` (locked transaction).
  - `src/app/(admin)/admin/classes/[id]/edit/page.tsx` — server page (guard + load row + subjects + `notFound()`).
  - `src/app/(admin)/admin/classes/[id]/edit/edit-class-form.tsx` — client form (pre-filled) — OR parametrise the
    existing `new/class-form.tsx` for reuse (log the choice).
  - `tests/unit/edit-class-schema.test.ts` — edit schema assertions.
- UPDATE (small, additive):
  - `src/lib/class-occupancy.ts` — add pure `capacityBelowOccupied(newCapacity, occupied)` (AD-16 floor predicate).
  - `src/lib/.../new/class-form-schema.ts` — IF extracting the shared base (Task 1 option A): export the reusable
    field object/refinement; keep `createClassSchema` behaviour identical.
  - `src/app/(admin)/admin/classes/page.tsx` — add per-row "Edit" link (+ header cell).
  - `tests/unit/class-occupancy.test.ts` — add `capacityBelowOccupied` assertions.
  - `tests/e2e/authenticated-routes.ts` — append `{ path: "/admin/classes/seed-class-acc-1/edit", role: "ADMIN" }`.

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.3 / Epic 2 / FR16]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md#AD-16, AD-5, AD-3, AD-2, AD-9, AD-13, AD-1, "Consistency Conventions", "Capability → Architecture Map" (Admin CRUD, AD-16), "Schema deltas" (updatedAt already migrated)]
- [Source: acce-nextjs/prisma/schema.prisma:96-158 (GroupSession incl. updatedAt @updatedAt:131; Enrollment; Subject)]
- [Source: acce-nextjs/src/lib/db.ts (interactive tx + $queryRaw FOR UPDATE); src/lib/auth-guards.ts; src/lib/class-occupancy.ts]
- [Source: acce-nextjs/src/app/(admin)/admin/classes/new/class-form-schema.ts; new/actions.ts; new/class-form.tsx (reuse templates)]
- [Source: acce-nextjs/src/app/(admin)/admin/classes/page.tsx (Edit-link attach point); tests/e2e/authenticated-routes.ts (manifest + dynamic-id note)]
- [Source: acce-nextjs/prisma/seed-data.ts:62 (deterministic seed-class-acc-1 for the e2e manifest)]
- [Source: _bmad-output/implementation-artifacts/2-1-create-a-group-class.md; 2-2-list-and-view-classes-in-admin.md; deferred-work.md (CI ephemeral-Postgres posture)]

### Latest tech notes
- **Prisma 6.19.3 interactive transaction + `FOR UPDATE`:** `db.$transaction(async (tx) => { const rows = await
  tx.$queryRaw<{ id:string; updatedAt: Date }[]>\`SELECT id, "updatedAt" FROM "GroupSession" WHERE id = ${id} FOR
  UPDATE\`; … })`. The tagged-template binds `${id}` as a parameter (safe). All reads/writes inside the callback use
  `tx`, not `db`, so they share the transaction + lock. The lock releases at commit/rollback. Filtered `count` and
  `update` both work on `tx`.
- **`@updatedAt` semantics:** Prisma sets `updatedAt` to "now" on every `update` it issues — so after a successful
  edit the token advances and any other tab's stale `expectedUpdatedAt` fails AC4 on its next submit. Compare tokens
  as `Date.getTime()` equality or exact ISO string equality (serialise via `toISOString()`), consistently on both ends.
- **Next 16 dynamic route:** `[id]/edit/page.tsx` receives `params` (await it in Next 16: `const { id } = await
  params`). Server component: guard → load → `notFound()` if missing → render client form with serialisable props.
- **Zod 4:** reuse `z.coerce.date()/number()`, `.refine`/`.superRefine`; `error.flatten().fieldErrors` for the
  discriminated result. Reuse the `typedResolver` cast pattern for the coerced fields in the client form.

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6 (autopilot subagent, 2026-07-06)

### Debug Log References

- TypeScript error on `defaultValues` in `edit-class-form.tsx`: string start/end vs Date type in `EditClassInput`. Fixed with `as unknown as Partial<EditClassInput>` cast — same pattern as the create form's `typedResolver` cast.

### Completion Notes List

- **Task 1**: Created pure `editClassSchema` in `edit-class-schema.ts`. Field block duplicated from `createClassSchema` (ZodEffects cannot `.extend()`). Re-exports `toCents` from create schema (AD-9 single site). `meetingUrl` is first-class editable + clearable. `id` and `expectedUpdatedAt` (ISO string) are new required fields.
- **Task 2**: Added `capacityBelowOccupied(newCapacity, occupied)` to `class-occupancy.ts` — pure, db-free, `newCapacity < occupied`. Epic 3/4's `reserveSeat` can reuse.
- **Task 3**: Created `updateClassAction` in `actions.ts` with full AD-16 pattern: `requireAdmin()` → safeParse → subjectId re-check → toCents → `db.$transaction` with `tx.$queryRaw FOR UPDATE` lock → ISO-string updatedAt comparison → `tx.enrollment.count` inside lock → `tx.groupSession.update`. No Enrollment row touched. Stale-edit message is actionable ("reload and try again").
- **Task 4**: Created server `page.tsx` (requireAdmin first, parallel loads, notFound(), serialisable props) + client `edit-class-form.tsx` (pre-filled defaultValues, `as unknown` cast, gold-accent "Save changes" CTA, stale-edit toast, router.push on success).
- **Task 5**: Added "Actions" header column + per-row ghost `Button asChild` Edit link to `classes/page.tsx`. Appended `seed-class-acc-1/edit` entry to `authenticated-routes.ts`.
- **Task 6**: 42 tests in `edit-class-schema.test.ts` (happy path, id/expectedUpdatedAt required, meetingUrl set/clear, all AC3 invalid cases, toCents re-export). 6 new tests in `class-occupancy.test.ts` (capacityBelowOccupied boundary cases).
- **Task 7**: `prisma validate` clean. `npm run build` clean with `/admin/classes/[id]/edit` as ƒ Dynamic. `npm test` 190/190 green (baseline 142 + 48 new). Concurrency integration test deferred to CI ephemeral-Postgres per deferred-work.md posture.

### File List

New files:
- `acce-nextjs/src/app/(admin)/admin/classes/[id]/edit/edit-class-schema.ts`
- `acce-nextjs/src/app/(admin)/admin/classes/[id]/edit/actions.ts`
- `acce-nextjs/src/app/(admin)/admin/classes/[id]/edit/page.tsx`
- `acce-nextjs/src/app/(admin)/admin/classes/[id]/edit/edit-class-form.tsx`
- `acce-nextjs/tests/unit/edit-class-schema.test.ts`

Modified files:
- `acce-nextjs/src/lib/class-occupancy.ts` (added `capacityBelowOccupied`)
- `acce-nextjs/src/app/(admin)/admin/classes/page.tsx` (added Actions header + Edit link per row)
- `acce-nextjs/tests/e2e/authenticated-routes.ts` (appended seed-class-acc-1/edit entry)
- `_bmad-output/implementation-artifacts/2-3-edit-an-existing-class.md` (this file)
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Change Log

- **2026-07-06** — Story 2.3 dev-story complete. Added `(admin)/admin/classes/[id]/edit` route: pure `editClassSchema` (id + expectedUpdatedAt + all class fields + cross-field rules), `updateClassAction` (AD-16 FOR UPDATE lock + occupancy floor + optimistic-concurrency check + no-Enrollment-touch), server `page.tsx` (requireAdmin, parallel loads, notFound), client `edit-class-form.tsx` (pre-filled, gold-accent "Save changes", stale-edit toast). Added `capacityBelowOccupied` to `class-occupancy.ts`. Wired per-row Edit link on list page. Added `seed-class-acc-1/edit` to e2e manifest. 190/190 vitest, build clean, prisma validate clean.
