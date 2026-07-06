---
baseline_commit: 48faff6e724df6652da4f20636ba52d3831c120f
---

# Story 3.2: Browse upcoming classes with seats-left

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a student,
I want a list of upcoming classes showing how many seats are left,
so that I can pick one before it fills.

## Context & current state (READ FIRST)

Epic 1 (`done`) and Epic 2 (`done`) shipped the foundation and full admin class CRUD. Epic 3 is
in-progress: **Story 3.1 (`done`)** built the wallet domain (`src/lib/wallet.ts` — `getBalance` + the
serialized `mutate` seam) and the read-only `(portal)/portal/wallet` page. **This story is 3.2 — the
first STUDENT-facing browse view of the class catalogue.** It is a read-only listing; no enrollment,
checkout, or wallet interaction happens here.

This story builds ONE page: a student-facing **portal classes listing** at `(portal)/portal/classes` that
shows every upcoming (`SCHEDULED`, future-start) class as a **shadcn `Card`** with subject, date/time,
per-seat price, and a **"N seats left"** `Badge` (UX-DR2, UX-DR3). Plus a tiny pure display helper and
two small wiring edits (portal nav link + e2e manifest entry).

**The occupancy math already exists and MUST be reused — do NOT re-derive it.** Story 2.2 built
`src/lib/class-occupancy.ts` as the *single source* of the AD-5 occupancy predicate; its header explicitly
notes "Epic 3's portal browse (Story 3.2 'N seats left') will import it too." You import
`occupiedEnrollmentWhere(now)` (the filtered `_count` predicate) and `computeSeatsLeft(capacity, occupied)`
from it — you write NO new occupancy logic.

What already exists and MUST be reused (do NOT recreate):

- **`src/lib/class-occupancy.ts`** — `occupiedEnrollmentWhere(now): Prisma.EnrollmentWhereInput` (AD-5:
  `status ∈ {PENDING, CONFIRMED} AND (pendingExpiresAt IS NULL OR pendingExpiresAt > now)`) and
  `computeSeatsLeft(capacity, occupied) = max(0, capacity − occupied)`. Pure, `db`-free, already unit-tested.
  This is the SINGLE source of the seats-left definition — import it, don't inline. [Source: acce-nextjs/src/lib/class-occupancy.ts]
- **`src/lib/class-display.ts`** — `formatZar(cents)` (AD-9 cents→Rand at the UI edge, `29000 → "R290.00"`),
  `formatMode(mode)` (`"Online"` / `"In-person"`). Reuse both. **Add** `formatSeatsLeft(seatsLeft)` here
  (this story) — do NOT re-implement the Rand/label logic elsewhere. [Source: acce-nextjs/src/lib/class-display.ts]
- **`requireSession()`** in `src/lib/auth-guards.ts` — the TRUSTED page-level guard (AD-3). Call it at the
  TOP of the page **before any data fetch or JSX**. Any authenticated session (STUDENT+) may browse the
  catalogue; the listing is not per-student (no `session.user.id` filter on the query — every student sees
  the same upcoming classes). [Source: acce-nextjs/src/lib/auth-guards.ts:25]
- **`db` singleton** from `@/lib/db` — the ONLY `PrismaClient` (AD-2). Never `new PrismaClient()`. [Source: acce-nextjs/src/lib/db.ts]
- **`GroupSession` model** — `id`, `subjectId`+`subject → Subject`, `level String`, `title`, `description?`,
  `start DateTime`, `end DateTime`, `capacity Int`, `priceCents Int`, `mode Mode @default(ONLINE)`,
  `location String?`, `meetingUrl String?`, `status GroupSessionStatus @default(SCHEDULED)`, `enrollments Enrollment[]`.
  Filter by `status = SCHEDULED` AND `start > now`; order `start: asc`. **No schema change.** [Source: acce-nextjs/prisma/schema.prisma#GroupSession]
- **The 2.2 admin classes page** — `(admin)/admin/classes/page.tsx` — is the closest analog: server RSC,
  `requireX()`-first, a filtered `_count` occupancy fetch via `occupiedEnrollmentWhere(now)`, `computeSeatsLeft`,
  empty-state. **Mirror its data-fetch shape** (but render Cards, not a Table — see decision below). [Source: acce-nextjs/src/app/(admin)/admin/classes/page.tsx]
- **shadcn primitives present**: `card` (`Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter`),
  `badge`, `button`, `separator` in `src/components/ui/`. Use `Card` + `Badge` (UX-DR2) — no new dependency. [Source: acce-nextjs/src/components/ui/*]
- **`(portal)/portal-nav.tsx`** — the portal shell nav (client component). It currently has the logo, a
  "Wallet" link (added by 3.1), theme toggle, sign-out. **Add a "Classes" nav link** next to Wallet. Keep it
  keyboard-operable, ≥44px, focus-ring, token-styled. [Source: acce-nextjs/src/app/(portal)/portal-nav.tsx]
- **`tests/e2e/authenticated-routes.ts`** — the 1.5 authenticated-route manifest; its examples literally list
  `{ path: '/portal/classes', role: 'STUDENT' }` as a route to add. Append it. [Source: acce-nextjs/tests/e2e/authenticated-routes.ts]

**This story = a read-only `(portal)/portal/classes/page.tsx` (server component) + a `formatSeatsLeft` pure
helper in `class-display.ts` + a "Classes" portal-nav link + a `/portal/classes` e2e manifest entry + unit
tests for `formatSeatsLeft`. NO enrollment/reserve/checkout, NO class detail page (that is 3.3), NO wallet
interaction, NO schema/migration/dependency change, NO writes of any kind.**

## Acceptance Criteria

**AC1 — Upcoming classes render as Cards with subject, date/time, price, and "N seats left" (FR4, FR5, UX-DR2, UX-DR3).**
Given one or more `SCHEDULED` classes with a future `start`,
When I open `/portal/classes`,
Then I see each such class as a shadcn **`Card`** showing at minimum: the subject name, the class title, the
formatted date/time, the per-seat price (formatted in Rand at the UI edge via `formatZar`, AD-9), and a
**`Badge` reading "N seats left"** where `N = computeSeatsLeft(capacity, occupied)` and
`occupied = count(enrollments matching occupiedEnrollmentWhere(now))` (AD-5: PENDING + CONFIRMED, expired
PENDING freed). Classes are ordered chronologically by `start` (soonest first). The page reuses the existing
navy+gold design tokens and shadcn primitives — no new palette.

**AC2 — A full class shows a "Class full" state, not an active Book action (UX-DR3).**
Given a class where `occupied ≥ capacity` (so `computeSeatsLeft === 0`),
When its Card renders,
Then it displays a clear **"Class full"** state (Badge / label via `formatSeatsLeft(0)`) and does **not** render
an active "Book"/"View class" CTA for that class — a full class must never present a dead/misleading Book button.

**AC3 — Available classes present a Book / View CTA linking to the class detail route (UX-DR2, UX-DR3).**
Given a class with `computeSeatsLeft ≥ 1`,
When its Card renders,
Then it presents a token-styled CTA (e.g. "View class" / "Book") that links to `/portal/classes/${id}` — the
class detail/checkout page built by **Story 3.3**. (That route does not exist yet; this is a deliberate
forward reference, mirroring how Story 2.2 rendered a per-row Edit link to the 2.3-owned route. Only
`/portal/classes` — not the dynamic detail route — is added to the e2e manifest in this story.)

**AC4 — Empty state when there are no upcoming classes (UX-DR4).**
Given there are no `SCHEDULED` classes with a future `start` (all past, cancelled, or none seeded),
When I open `/portal/classes`,
Then I see a clear, calm empty-state message (e.g. "No upcoming classes right now") instead of an empty
grid — no error styling. Any CTA uses the existing token system, not a new palette.

**AC5 — Authorization enforced at the page entry (AD-3).**
Given an unauthenticated actor,
When they request `/portal/classes` directly (bypassing the `(portal)` layout via a direct RSC request),
Then `requireSession()` at the top of the page redirects them to `/sign-in` before any class data is fetched.
The listing query is NOT keyed to `session.user.id` (the catalogue is the same for every student), but the
session gate still runs first.

**AC6 — Chain stays green (no regressions), with new unit tests on `formatSeatsLeft`.**
`npx prisma validate` passes (schema untouched), `npm run build` succeeds (tsc clean, `/portal/classes`
appears in the route table as `ƒ Dynamic`), and `npm test` (vitest) stays green **including new unit tests**
for `formatSeatsLeft` (0 → "Class full", 1 → "1 seat left", ≥2 → "N seats left"). No schema/migration files
are modified. `/portal/classes` is appended to the 1.5 authenticated-route manifest so the 200-smoke covers it.

## Tasks / Subtasks

- [x] **Task 1 — Add the pure `formatSeatsLeft` display helper (`db`-free) (AC1, AC2, AC6).**
  - [x] In `src/lib/class-display.ts` add `formatSeatsLeft(seatsLeft: number): string`:
    - `0` → `"Class full"`
    - `1` → `"1 seat left"`
    - `n ≥ 2` → `` `${n} seats left` ``
  - [x] Keep it pure / `db`-free (mirrors `formatZar`/`formatMode`) so vitest loads it without `DATABASE_URL`.
    Do NOT re-derive seats-left here — the number is computed by `computeSeatsLeft` in `class-occupancy.ts`;
    this helper only formats a label.
- [x] **Task 2 — Student classes listing page (server component, read-only) (AC1–AC5).**
  - [x] Create `src/app/(portal)/portal/classes/page.tsx` as a **server component**: call `await requireSession()`
    FIRST (trusted page guard, AD-3), then compute `const now = new Date()` ONCE, then fetch:
    ```
    db.groupSession.findMany({
      where: { status: "SCHEDULED", start: { gt: now } },
      orderBy: { start: "asc" },
      select: {
        id: true, title: true, start: true, capacity: true, priceCents: true, mode: true,
        subject: { select: { name: true } },
        _count: { select: { enrollments: { where: occupiedEnrollmentWhere(now) } } },
      },
    })
    ```
    Read-only — no writes anywhere. The query is NOT keyed to `session.user.id` (catalogue is shared).
  - [x] For each class compute `occupied = cls._count.enrollments`, `seatsLeft = computeSeatsLeft(cls.capacity, occupied)`,
    `isFull = seatsLeft === 0`.
  - [x] Render a responsive **`Card` grid** (e.g. `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`). Each Card shows:
    subject name (CardTitle or heading), title, formatted date/time (native `toLocaleString("en-ZA", …)` — no
    date library, consistent with 2.2/2.3), `formatZar(priceCents)`, a `Badge` with `formatSeatsLeft(seatsLeft)`,
    and `formatMode(mode)`. If `isFull` → render the "Class full" Badge state and NO active CTA (AC2). If not
    full → render a token-styled CTA `<Link href={`/portal/classes/${cls.id}`}>` ("View class" / "Book") (AC3).
  - [x] If `classes.length === 0` → the AC4 **empty state** (calm message "No upcoming classes right now" — no
    grid, no error styling), using the existing token system.
  - [x] Fully server-rendered — **no client island**, no non-`children` prop trap (1.5 RSC-500 guard). Use a
    plain `<div>` wrapper, NOT a second `<main>` (the `(portal)` layout owns the single `<main>` — 1.3 a11y fix).
- [x] **Task 3 — Wiring: portal nav link + e2e manifest (AC1, AC6).**
  - [x] `src/app/(portal)/portal-nav.tsx`: add a keyboard-operable **"Classes"** `<Link href="/portal/classes">`
    next to the existing "Wallet" link (reuse the identical focus-ring + token + `h-11` ≥44px styling). Keep
    the nav a11y-correct (NFR10).
  - [x] `tests/e2e/authenticated-routes.ts`: append `{ path: "/portal/classes", role: "STUDENT" }` (already shown
    as an example entry in the manifest header). Do NOT add the dynamic `/portal/classes/[id]` detail route —
    that belongs to Story 3.3 (mirrors 2.2 leaving the edit route to 2.3). Manifest shape unchanged.
- [x] **Task 4 — Unit tests for the pure helper (AC6).**
  - [x] `tests/unit/class-display.test.ts` (extend if it exists, else create): pin
    `formatSeatsLeft(0) === "Class full"`, `formatSeatsLeft(1) === "1 seat left"`,
    `formatSeatsLeft(2) === "2 seats left"`, `formatSeatsLeft(6) === "6 seats left"`.
  - [x] Do NOT unit-test the page (it imports `db` + needs `DATABASE_URL`); do NOT over-mock Prisma to fake the
    filtered `_count`. The live occupancy query is a CI concern (Task 5).
- [x] **Task 5 — Verify the chain (AC6).**
  - [x] `npx prisma validate` → passes (schema untouched).
  - [x] `npm run build` → succeeds (tsc clean; `/portal/classes` present in the route table as `ƒ Dynamic`).
  - [x] `npm test` → vitest green including the new `formatSeatsLeft` assertions (223/223 pass, 4 new).
  - [x] Live-DB read of the listing (real occupancy `_count` over seeded classes) → **deferred to CI
    ephemeral-Postgres** (same wall as 1.1/1.5/2.2/2.3/3.1). Do NOT fake a live query. Static verification
    (`prisma validate` + `build` + vitest) is the bar here.

## Dev Notes

### Architecture guardrails (from ARCHITECTURE-SPINE — binding)
- **AD-5 — Capacity is derived, never stored; readers never write:** `occupied = count(Enrollment where status ∈
  {PENDING, CONFIRMED} AND (pendingExpiresAt IS NULL OR pendingExpiresAt > now))`; `seatsLeft = max(0, capacity − occupied)`.
  This browse page is a READER — it issues NO write of any kind. The lazy PENDING→CANCELLED expiry flip belongs
  ONLY inside a locked mutation in `enrollment.ts` (Epic 4). Reuse `occupiedEnrollmentWhere` + `computeSeatsLeft`
  (the single source) — never re-derive the predicate. [Source: ARCHITECTURE-SPINE.md#AD-5; class-occupancy.ts]
- **AD-3 — Authorization at the entry layer, not the layout:** `requireSession()` at the top of the page is the
  trusted guard; the `(portal)` layout is defense-in-depth only (a direct RSC request skips it). `(portal)` entries
  require a `STUDENT`+ session. [Source: ARCHITECTURE-SPINE.md#AD-3; auth-guards.ts]
- **AD-9 — Money is integer cents (ZAR):** `priceCents` is an integer; format to Rand ONLY at the UI edge via
  `formatZar`. No floats. [Source: ARCHITECTURE-SPINE.md#AD-9; class-display.ts]
- **AD-2 — Single data gateway:** import `{ db }` from `@/lib/db`; never `new PrismaClient()`. [Source: ARCHITECTURE-SPINE.md#AD-2]
- **AD-1 — Additive route-group isolation:** the new route lives only under `(portal)/portal/classes`; marketing
  routes, SEO, sitemap, headers untouched. [Source: ARCHITECTURE-SPINE.md#AD-1]
- **AD-10 — Join details gated by CONFIRMED:** NOT in scope here. This browse view shows subject/time/price/seats
  only — it never reveals `meetingUrl`/`location`. Join-detail gating lives on the class detail page (Story 3.3,
  FR6). Do NOT select or render `meetingUrl`/`location` in the listing. [Source: ARCHITECTURE-SPINE.md#AD-10; epics.md#Story 3.3]
- **Capability map:** "Class discovery + seats-left (FR4,5)" lives under `(portal)/portal/classes/**`, governed by
  AD-5, AD-10. [Source: ARCHITECTURE-SPINE.md#Capability → Architecture Map]

### Data model facts this story depends on (from schema.prisma — verified)
- `GroupSession { id cuid, subjectId + subject→Subject, level String, title, description?, start DateTime,
  end DateTime, capacity Int, priceCents Int, mode Mode @default(ONLINE), location String?, meetingUrl String?,
  status GroupSessionStatus @default(SCHEDULED), enrollments Enrollment[] }`. Filter `status = SCHEDULED` AND
  `start > now`. [Source: acce-nextjs/prisma/schema.prisma#GroupSession]
- **Filtered relation `_count`**: `_count: { select: { enrollments: { where: occupiedEnrollmentWhere(now) } } }`
  runs the occupancy count in the DB (no N+1). Supported in installed Prisma 6.19.3 (GA since 5.0) — 2.2 uses
  the identical shape. [Source: acce-nextjs/src/app/(admin)/admin/classes/page.tsx:99-107]
- `Enrollment.status` ∈ `{PENDING, CONFIRMED, CANCELLED, ATTENDED, NO_SHOW}`; occupancy counts only PENDING +
  CONFIRMED unexpired (encoded in `occupiedEnrollmentWhere`). This story does not read enrollment rows directly —
  only the filtered `_count`. [Source: class-occupancy.ts]

### Scope boundary (do NOT do — belongs to other stories)
- **No class detail / checkout page** — that is Story 3.3 (`/portal/classes/[id]`). 3.2 only forward-links to it.
- **No enrollment / reserve / `reserveSeat` / `BOOKING_CHARGE` / wallet interaction** — Story 3.4 (it will call
  `wallet.mutate`). This page never touches the wallet.
- **No `meetingUrl` / `location` reveal** — join-detail gating is Story 3.3 (FR6, AD-10). Do not select those fields.
- **No admin credit / Paystack / cancellation / roster / email code.**
- **No writes of any kind** — pure reader (AD-5). No schema/migration/enum change; no new dependency; no date
  library; no pagination (dataset is tiny in Phase 1a — 6 seeded classes).

### Previous story intelligence (Epic 3 / Epic 2)
- **2.2 (done) is the closest analog** — a read-only server RSC page (guard-first, `db` read via filtered `_count`,
  no client island) reusing `occupiedEnrollmentWhere` + `computeSeatsLeft`. 2.2 rendered a **Table** (admin ops
  view); 3.2 renders a **Card grid** (student browse, UX-DR2/DR3) but the data-fetch is the same shape. [Source: 2-2-list-and-view-classes-in-admin.md]
- **2.2→2.3 forward-link precedent:** 2.2 rendered a per-row Edit `<Link>` to `/admin/classes/[id]/edit` — a route
  that Story 2.3 built afterward — and left the *dynamic* manifest entry for 2.3 to add. 3.2 mirrors this exactly:
  render the "View class" CTA to `/portal/classes/[id]` (built by 3.3), and add only `/portal/classes` to the
  manifest now. [Source: 2-2…md; 2-3…md]
- **CTA token rule (2.1/2.2 code-review):** any gold CTA must use token classes
  (`bg-accent text-accent-foreground hover:bg-accent/90`) — NOT hardcoded hex — so gold+navy flip per light/dark
  mode (UX-DR2/DR6). The 2.2 page shows the exact class string. [Source: 2-1…md; 2-2…md Review]
- **Timezone deferral (2.2/2.3/3.1):** class `start` is displayed via `toLocaleString("en-ZA", …)` with NO explicit
  `timeZone`; timezone hardening is a system-wide deferred decision — follow the same convention here, do NOT
  unilaterally pin a tz. [Source: 2-2…md Review Findings; deferred-work.md]
- **3.1 (done) portal-nav pattern:** the "Wallet" link in `portal-nav.tsx` is the exact template for the new
  "Classes" link (`flex h-11 items-center rounded-md px-3 … focus-visible:ring-2 focus-visible:ring-ring`).
  Copy that pattern. [Source: acce-nextjs/src/app/(portal)/portal-nav.tsx]
- **1.5 RSC-500 trap + smoke net:** never pass a Client Component element through a non-`children` prop from a
  Server Component (silent HTTP 500, invisible to tsc/unit). The classes page is fully server-rendered with no
  client island, so it is safe; adding `/portal/classes` to the authenticated-route manifest gives the 200-smoke
  a regression net. [Source: 1-5…md; lessons-learned]
- **1.3 nested-`<main>` a11y fix:** the `(portal)` layout owns the single `<main>` landmark — the page must use a
  `<div>` wrapper, not a second `<main>`. [Source: (portal)/portal/page.tsx:22-27]
- **Seed reality (1.4):** `prisma/seed-data.ts` seeds 6 `SCHEDULED` classes at future relative dates with capacity
  4–6 and NO enrollments — so on a fresh seed every class shows its full capacity as "seats left" and the browse
  grid is populated (not the empty state). No student user and no enrollments are seeded, so occupancy is 0 across
  the board until Epic 3/4 booking runs. [Source: acce-nextjs/prisma/seed-data.ts; 1-4…md]
- **Sandbox reality (1.1/1.4/1.5/2.x/3.1):** prod DB creds are blocked interactively; live DB reads are deferred to
  CI ephemeral-Postgres. Static verification (`prisma validate` + `build` + vitest) is the bar. Do NOT fake a live
  query. [Source: deferred-work.md; 3-1…md Task 6]
- **Git:** work lands on branch `epic-3` (chained off 3.1 tip `48faff6`). Net-new `portal/classes/page.tsx` + one
  new pure helper in `class-display.ts` + two small UPDATE edits (portal-nav, e2e manifest) — nothing conflicts
  with prior epics. [Source: sprint-status.yaml]

### UX / accessibility (UX-DR2, UX-DR3, UX-DR4, UX-DR6, NFR10)
- **UX-DR2:** class listing reuses shadcn `Card` + `Badge` + the design-token button variants
  (primary / accent-gold CTA / ghost); **one gold accent CTA per view group** — keep the gold CTA dominant, use
  ghost/secondary for anything subordinate. [Source: epics.md:90]
- **UX-DR3:** each card shows a **"N seats left"** indicator (capacity − occupied) as a `Badge`; a full class
  shows a clear **"Class full"** state rather than a dead Book button. [Source: epics.md:91-92]
- **UX-DR4:** portal screens provide empty states — the "no upcoming classes" case must render a calm, clear
  message, not an empty grid or error styling. [Source: epics.md:92]
- **UX-DR6 / NFR10 accessibility floor:** every new control (the "Classes" nav link, each Card CTA) is
  keyboard-operable with a visible focus ring, ≥44px touch target, both-mode contrast, and honours
  `prefers-reduced-motion`. Do NOT rely on colour alone for the "Class full" vs "seats left" distinction — the
  label text carries it. [Source: epics.md:94; DESIGN.md]
- Reuse the navy+gold token system and shadcn primitives (`Card`, `Badge`, `Button`) — NO new palette. The `Card`
  token is `--card` on `--border`, radius `0.625rem`, padding `28px`. [Source: DESIGN.md:213]

### Testing standards
- Framework: **vitest** (jsdom), `npm test`, specs under `tests/unit/**`. Playwright e2e is separate
  (`tests/e2e`, DB-bound) — add the route to `authenticated-routes.ts` but do not run it here. [Source: 2-2…md; acce-nextjs/vitest.config.ts]
- Unit-test the **pure** helper only: `formatSeatsLeft` (0/1/≥2 label boundaries). Do NOT unit-test the page (it
  imports `db` and needs `DATABASE_URL`); do NOT over-mock Prisma to fake the filtered `_count`. The live count is
  a CI concern. Reuse of `occupiedEnrollmentWhere`/`computeSeatsLeft` is already covered by the 2.2 tests. [Source: 2-2…md; 3-1…md Task 5]

### Project Structure Notes
- App root `acce-nextjs/`; alias `@/*` → `acce-nextjs/src/*`.
- New files:
  - `src/app/(portal)/portal/classes/page.tsx` — server component (guard + read-only listing + Card grid) (NEW).
- UPDATE (small, additive):
  - `src/lib/class-display.ts` — add pure `formatSeatsLeft` (UPDATED).
  - `src/app/(portal)/portal-nav.tsx` — add a "Classes" nav link (UPDATED).
  - `tests/e2e/authenticated-routes.ts` — append `{ path: "/portal/classes", role: "STUDENT" }` (UPDATED).
  - `tests/unit/class-display.test.ts` — add `formatSeatsLeft` assertions (NEW or UPDATED).

### Project Structure Notes (alignment)
- Aligns with the ARCHITECTURE-SPINE source tree: `(portal)/portal/` is seeded with `classes, classes/[id],
  my-classes, wallet`, and the capability map routes "Class discovery + seats-left (FR4,5)" to
  `(portal)/portal/classes/**`. No variance. [Source: ARCHITECTURE-SPINE.md#Structural Seed; #Capability → Architecture Map]

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.2 / Epic 3 / FR4 / FR5 / UX-DR2 / UX-DR3 / UX-DR4]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md#AD-1, AD-2, AD-3, AD-5, AD-9, AD-10, "Structural Seed", "Capability → Architecture Map"]
- [Source: acce-nextjs/prisma/schema.prisma#GroupSession / Mode / GroupSessionStatus / Enrollment]
- [Source: acce-nextjs/src/lib/class-occupancy.ts (occupiedEnrollmentWhere + computeSeatsLeft — reuse)]
- [Source: acce-nextjs/src/lib/class-display.ts (formatZar/formatMode reuse; add formatSeatsLeft)]
- [Source: acce-nextjs/src/lib/auth-guards.ts (requireSession); acce-nextjs/src/lib/db.ts (db singleton)]
- [Source: acce-nextjs/src/app/(admin)/admin/classes/page.tsx (read-only RSC + filtered _count occupancy analog)]
- [Source: acce-nextjs/src/app/(portal)/portal-nav.tsx (nav-link pattern); (portal)/portal/page.tsx (single-<main>)]
- [Source: acce-nextjs/tests/e2e/authenticated-routes.ts (manifest + /portal/classes shown as example)]
- [Source: _bmad-output/implementation-artifacts/2-2-list-and-view-classes-in-admin.md; 3-1-view-wallet-balance-and-ledger.md]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md (CI ephemeral-Postgres for live DB ops)]

### Latest tech notes
- **Prisma 6.19.3**: filtered relation `_count` (`enrollments: { where: … }`) runs the occupancy count in the DB —
  no N+1, no enrollment rows loaded. Identical shape to the 2.2 admin page. [Source: (admin)/admin/classes/page.tsx]
- **Next 16 App Router**: `classes/page.tsx` is a server component by default — `await requireSession()` then
  `await db.groupSession.findMany(...)` inline; no route handler or client island needed for a read-only listing.
  Keep it server-rendered to avoid the 1.5 RSC non-children-prop 500 trap. [Source: 2-2…md Latest tech notes]
- **`Intl`/`toLocaleString`**: format `start` with native `Date.toLocaleString("en-ZA", …)` (no `timeZone` pin —
  consistent with 2.2/2.3/3.1, timezone hardening deferred). No `date-fns`/`dayjs`. [Source: 2-2…md Review Findings]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6 (autopilot subagent, 2026-07-06)

### Debug Log References

No debug issues encountered. All tasks completed without regressions.

### Completion Notes List

- Task 1: Added `formatSeatsLeft(seatsLeft: number): string` to `src/lib/class-display.ts`. Pure, db-free. 0→"Class full", 1→"1 seat left", n≥2→"N seats left". Does NOT re-derive seat count — delegates to class-occupancy.ts (AD-5 single source).
- Task 2: Created `src/app/(portal)/portal/classes/page.tsx` as a server component. `requireSession()` first (AD-3), `now = new Date()` once, filtered `_count` occupancy via `occupiedEnrollmentWhere(now)` (mirrors 2.2 admin page shape), Card grid (not Table), full-class "Class full" badge + no CTA (AC2), available-class gold accent CTA linking to `/portal/classes/${id}` (AC3, Story 3.3 forward link), empty state (AC4), plain `<div>` wrapper (1.3 a11y — no nested `<main>`), no meetingUrl/location selected (AD-10).
- Task 3a: Added "Classes" `<Link href="/portal/classes">` to `portal-nav.tsx` using identical `h-11` focus-ring token styling as Wallet link (NFR10, ≥44px touch target).
- Task 3b: Appended `{ path: "/portal/classes", role: "STUDENT" }` to `tests/e2e/authenticated-routes.ts`. Dynamic `/portal/classes/[id]` deferred to Story 3.3 (mirrors 2.2→2.3 pattern).
- Task 4: Extended `tests/unit/class-display.test.ts` with 4 `formatSeatsLeft` assertions (0, 1, 2, 6 boundaries). 14 total tests in that file.
- Task 5: `prisma validate` clean (schema untouched), `npm run build` succeeded (tsc clean, `/portal/classes ƒ Dynamic` in route table), `npm test` 223/223 vitest pass including 4 new formatSeatsLeft assertions. Live DB read deferred to CI ephemeral-Postgres.

### File List

- `acce-nextjs/src/lib/class-display.ts` — UPDATED: added `formatSeatsLeft` pure helper (Task 1)
- `acce-nextjs/src/app/(portal)/portal/classes/page.tsx` — NEW: student browse listing server component (Task 2)
- `acce-nextjs/src/app/(portal)/portal-nav.tsx` — UPDATED: added "Classes" nav link (Task 3a)
- `acce-nextjs/tests/e2e/authenticated-routes.ts` — UPDATED: appended `/portal/classes` STUDENT manifest entry (Task 3b)
- `acce-nextjs/tests/unit/class-display.test.ts` — UPDATED: added 4 formatSeatsLeft boundary assertions (Task 4)

## Change Log

- 2026-07-06: Story 3.2 implemented — student classes browse listing at `/portal/classes`. Added `formatSeatsLeft` pure helper to `class-display.ts`; created `(portal)/portal/classes/page.tsx` server component (requireSession-first, filtered `_count` occupancy reusing AD-5 single-source `occupiedEnrollmentWhere`+`computeSeatsLeft`, Card grid not Table, full=Class-full badge + no CTA, available=gold-accent CTA→/portal/classes/[id], empty-state); added "Classes" nav link to portal-nav; appended `/portal/classes` STUDENT entry to e2e manifest; 4 new `formatSeatsLeft` unit tests; 223/223 vitest, build clean, prisma validate clean.
