---
baseline_commit: 8277014271ac57213e2a673c721d218fbd291fc2
---

# Story 6.2: Mark attended / no-show

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Priyanka (ADMIN),
I want to mark each `CONFIRMED` student on a class roster as **Attended** or **No-show** after the class,
so that attendance is recorded on the enrollment and reflected on the roster (and the no-show state is on the books for policy).

## Context & current state (READ FIRST)

This is the **SECOND story of Epic 6**, building directly on **Story 6.1** (the roster page, `done`). Epics 1–5 are `done`
and 6.1 shipped the admin class-detail/roster at `(admin)/admin/classes/[id]/page.tsx` — a **read-only** table of a class's
non-cancelled enrollments with a paid/pending/attended/no-show **status label** (`formatEnrollmentStatus`) and Badge variant
(`enrollmentStatusBadgeVariant`). 6.1 deliberately **left a place to attach controls** and reserved reuse of those helpers:
its Dev Notes state verbatim *"This story only surfaces the labels so 6.2 has a place to attach the controls."*

**Story 6.2 makes the roster actionable:** it adds per-row **"Attended" / "No-show"** controls (a client island) to each
`CONFIRMED` row, a colocated admin server action, and the **first `Enrollment.status` attendance transition** in
`enrollment.ts` (`markAttendance`). Marking flips `CONFIRMED → ATTENDED` or `CONFIRMED → NO_SHOW`; the roster then re-renders
with the updated Badge (the labels/variants already exist from 6.1 — no display work needed).

**Architecture headline (AD-14 — attendance needs NO lock).** `enrollment.ts` is the SOLE writer of every `Enrollment.status`
transition. But unlike reserve/confirm/cancel — which run inside a Serializable + `GroupSession FOR UPDATE` + retry envelope
because they are **seat-affecting** — attendance is **not** seat-affecting. AD-14 says verbatim the transition function
*"takes the appropriate lock (GroupSession row for seat-affecting transitions; **none needed for `ATTENDED`/`NO_SHOW`**)."*
So `markAttendance` is a **plain, atomic, status-guarded `updateMany`** — **do NOT cargo-cult** the Serializable/FOR UPDATE/
retry machinery from `reserveSeat`/`cancelEnrollment`. There is no oversell/last-seat/ledger invariant to protect here.

**No wallet / no refund.** Marking `NO_SHOW` records a status only — it writes **NO** `LedgerEntry` and calls **NO** `wallet.ts`.
FR14's "no-show → 0% refund" is already satisfied statically by the AD-11 cancellation tier constant and only bites on the
**cancel** path (Story 5.2). A no-show simply forfeits the already-taken `BOOKING_CHARGE` (0% back = the *absence* of a refund,
not a new debit). See Dev Notes "Ledger model".

What already exists and MUST be reused (do NOT recreate):

- **`enrollment.ts`** — the SOLE `Enrollment.status` writer (AD-14). ADD `markAttendance` here as a new exported function. Reuse the `db` singleton import already at the top; do NOT reuse the Serializable retry loop for this fn. [Source: acce-nextjs/src/lib/enrollment.ts:78-991]
- **`(admin)/admin/classes/[id]/page.tsx`** — the 6.1 roster page. ADD an **Actions** column + render the new client island for `CONFIRMED` rows. It already selects `enrollment.id` + `status` (all the island needs). Keep the page a server component; the island is the only client boundary. [Source: acce-nextjs/src/app/(admin)/admin/classes/[id]/page.tsx]
- **`formatEnrollmentStatus` / `enrollmentStatusBadgeVariant`** in `src/lib/enrollment-display.ts` — already map `ATTENDED → "Attended"` / `NO_SHOW → "No-show"` with Badge variants (built by 6.1). **Reuse as-is; do NOT touch this file.** After a mark, the existing status column renders the new label automatically. [Source: acce-nextjs/src/lib/enrollment-display.ts]
- **`requireAdmin()`** in `src/lib/auth-guards.ts` — the TRUSTED entry guard (AD-3). Call it FIRST in the server action, before any parse or write. [Source: acce-nextjs/src/lib/auth-guards.ts:49-58]
- **`db` singleton** from `@/lib/db` (AD-2). Never `new PrismaClient()`. [Source: acce-nextjs/src/lib/db.ts]
- **Admin server-action recipe** — `(admin)/admin/students/[id]/actions.ts` (`creditWalletAction`) is the exact template: `"use server"` → `requireAdmin()` FIRST → `schema.safeParse` → domain call → `revalidatePath` → discriminated result. **Mirror it.** (No Serializable/FOR UPDATE — same "don't cargo-cult 3.4" note applies.) [Source: acce-nextjs/src/app/(admin)/admin/students/[id]/actions.ts]
- **Client-island recipe** — `(portal)/portal/my-classes/cancel-enrollment-button.tsx` (`CancelEnrollmentButton`) is the exact template: `"use client"`, plain-string props (RSC-500 safe), `useState` pending guard, `toast` from `@/components/ui/sonner`, `router.refresh()` on success, `Button` with `min-h-[44px]` + focus-visible ring (NFR10). **Mirror it** (attendance needs two buttons, no AlertDialog required). [Source: acce-nextjs/src/app/(portal)/portal/my-classes/cancel-enrollment-button.tsx]
- **Pure schema + message-mapper recipe** — `src/lib/cancel-schema.ts` (`cancelInputSchema` + `getCancelErrorMessage` + `CANCEL_SUCCESS_MESSAGE`) is the exact template for a new pure, `db`-free `attendance-schema.ts`. Unit-tested with no `DATABASE_URL`. [Source: acce-nextjs/src/lib/cancel-schema.ts]
- **shadcn primitives present**: `button`, `badge`, `table`, `sonner` in `src/components/ui/`. **No new dependency.** [Source: acce-nextjs/src/components/ui/*]
- **e2e route manifest** — `/admin/classes/seed-class-acc-1` (ADMIN) is already in `tests/e2e/authenticated-routes.ts` from 6.1. **No manifest change needed** (the roster route is unchanged; the mark controls are POST-side actions, not GET routes). [Source: acce-nextjs/tests/e2e/authenticated-routes.ts]

**This story = a new `enrollment.markAttendance(enrollmentId, outcome)` transition (AD-14 sole writer, atomic status-guarded `updateMany`, NO lock/NO Serializable/NO wallet), a colocated `markAttendanceAction` admin server action, a `MarkAttendanceButtons` client island wired into the 6.1 roster's new Actions column for `CONFIRMED` rows, a pure unit-tested `attendance-schema.ts`, and a small edit to the roster page. NO schema/migration/enum change, NO email (6.3), NO portal polish (6.4), NO new dependency.**

## Acceptance Criteria

**AC1 — Admin marks a CONFIRMED enrollment ATTENDED or NO_SHOW, and the roster reflects it (FR17, UX-DR8).**
Given a class with a `CONFIRMED` enrollment on its roster,
When an authenticated ADMIN clicks **"Attended"** (or **"No-show"**) on that row,
Then `enrollment.markAttendance` flips that enrollment `CONFIRMED → ATTENDED` (or `CONFIRMED → NO_SHOW`), the action revalidates the roster, and the row's status Badge re-renders as **"Attended"** (or **"No-show"**) using the existing `formatEnrollmentStatus` + `enrollmentStatusBadgeVariant` (6.1 helpers, reused unchanged). A success toast is shown (UX-DR5).

**AC2 — Only CONFIRMED rows are markable; the transition is atomic and guarded (AD-14).**
Given enrollments in various states on the roster,
When the roster renders,
Then the **"Attended"/"No-show"** controls appear **only on `CONFIRMED` rows** — `PENDING` rows (unpaid, nothing to attend) and already-marked `ATTENDED`/`NO_SHOW` rows show their status Badge with **no action** (the label already communicates the state; UX-DR6). And `markAttendance` guards the transition in the WHERE clause (`{ id, status: "CONFIRMED" }`) so a stale/duplicate click on an already-marked row is a safe no-op (returns a `not_markable` result → informative toast), never an incorrect overwrite. (Correcting a mistaken mark — `ATTENDED ↔ NO_SHOW` — is intentionally out of scope; see Dev Notes.)

**AC3 — `markAttendance` is the sole status writer, takes NO seat lock, and touches NO wallet (AD-14, AD-6).**
Given the attendance transition,
When it runs,
Then it lives in `src/lib/enrollment.ts` (AD-14 sole `Enrollment.status` writer — no page/action writes status inline), performs a **plain atomic `db.enrollment.updateMany`** with **no `GroupSession FOR UPDATE`, no `Serializable` isolation, and no retry loop** (AD-14: attendance is not seat-affecting — "none needed for `ATTENDED`/`NO_SHOW`"), and issues **NO `wallet.mutate` / no `LedgerEntry` / no refund / no fee** (a no-show forfeits the already-taken `BOOKING_CHARGE`; the "0% refund" is the absence of a refund, not a new write). The outcome is Zod-restricted to exactly `"ATTENDED" | "NO_SHOW"` so the action can never be coerced into writing any other status.

**AC4 — Authorization enforced at the action entry (AD-3).**
Given a non-admin (or unauthenticated) actor invoking the mark action,
When the server action runs,
Then `requireAdmin()` is called **FIRST** (before any Zod parse or DB write) and redirects them (`/sign-in` if unauthenticated, `/portal` if a non-admin). The action never trusts a client-supplied role; the `enrollmentId` and `outcome` are the only client inputs and both are Zod-validated server-side.

**AC5 — The chain stays green with a new unit test; no schema change.**
`npx prisma validate` passes (schema untouched — `EnrollmentStatus` already has `ATTENDED`/`NO_SHOW`). `npm run build` succeeds (tsc clean; the roster route `/admin/classes/[id]` still present as ƒ Dynamic). `npm test` (vitest) stays green **including a new unit test** on the pure `attendance-schema.ts` (the outcome enum + reason→message mapper + success message). The live mark round-trip (a real `CONFIRMED → ATTENDED` DB write and roster re-render) is deferred to CI ephemeral-Postgres — the seed provisions ADMIN only (no student/enrollments), so a fresh-seed roster is the empty state; do NOT fake a live populated mark.

## Tasks / Subtasks

- [x] **Task 1 — Pure, testable attendance-schema (`db`-free) (AC3, AC4, AC5).**
  - [x] Create `src/lib/attendance-schema.ts` (pure, `db`-free, mirrors `cancel-schema.ts`). Export a Zod `markAttendanceInputSchema = z.object({ enrollmentId: z.string().min(1), outcome: z.enum(["ATTENDED", "NO_SHOW"]) })` and its inferred type. The `z.enum` is the guard that makes it impossible for the action to write any status other than the two attendance values (AC3).
  - [x] Export the reason→message mapper + messages mirroring `cancel-schema.ts`: `MarkAttendanceFailureReason = "not_found" | "not_markable" | "error"`, a `MARK_ATTENDANCE_SUCCESS(outcome)` helper (or two constants) returning e.g. `"Marked as attended"` / `"Marked as no-show"`, a `MARK_ATTENDANCE_ERROR_MESSAGES` record (`not_found` → "We couldn't find that enrollment", `not_markable` → "This enrollment can no longer be marked", `error` → "Something went wrong — please try again"), and `getMarkAttendanceErrorMessage(reason: string)` with a safe `error` fallback.
  - [x] Do NOT import Prisma/`db`/the `EnrollmentStatus` runtime here — keep it a plain string-literal union so vitest (jsdom) loads it with no `DATABASE_URL`.
- [x] **Task 2 — `markAttendance` transition in `enrollment.ts` (AC1, AC2, AC3).**
  - [x] Add to `src/lib/enrollment.ts` an exported `MarkAttendanceResult = { ok: true; status: "ATTENDED" | "NO_SHOW" } | { ok: false; reason: "not_found" | "not_markable" | "error" }` and `async function markAttendance(enrollmentId: string, outcome: "ATTENDED" | "NO_SHOW"): Promise<MarkAttendanceResult>`.
  - [x] Implementation (AD-14, **NO lock**): a single atomic `const res = await db.enrollment.updateMany({ where: { id: enrollmentId, status: "CONFIRMED" }, data: { status: outcome } });`. If `res.count === 1` → `{ ok: true, status: outcome }`. If `res.count === 0` → disambiguate with a cheap `db.enrollment.findUnique({ where: { id: enrollmentId }, select: { id: true } })`: exists → `{ ok:false, reason:"not_markable" }` (already marked / not CONFIRMED); missing → `{ ok:false, reason:"not_found" }`. Wrap in `try/catch` → `{ ok:false, reason:"error" }` with a structured `console.error` (never swallow).
  - [x] Add a clear header comment: attendance is NOT seat-affecting (AD-14) → **no `GroupSession FOR UPDATE`, no `Serializable`, no retry loop, no `wallet.mutate`**. The status-guarded `updateMany` is itself atomic — a concurrent double-mark is safe (only one write yields `count===1`). Explicitly note "do NOT cargo-cult reserveSeat's envelope here."
  - [x] Do NOT write `Enrollment.status` anywhere outside `enrollment.ts` (AD-14). Do NOT import `wallet.ts` for this fn.
- [x] **Task 3 — Admin server action (AC1, AC4).**
  - [x] Create `src/app/(admin)/admin/classes/[id]/actions.ts` with `"use server"` and `markAttendanceAction(input: unknown)`. Order (mirror `creditWalletAction`): (1) `await requireAdmin()` FIRST; (2) `markAttendanceInputSchema.safeParse(input)` → on failure return `{ ok:false, reason:"not_found" }` (bad/empty id or bad outcome); (3) `const result = await markAttendance(enrollmentId, outcome)`; (4) on `ok` → `revalidatePath('/admin/classes/' + id)` **and** `revalidatePath('/admin/classes')` (the index shows occupancy — unaffected by attendance, but keep parity with 6.1's link target; the roster revalidate is the load-bearing one) then return the discriminated result; (5) else pass through `{ ok:false, reason }`.
  - [x] Result type: `MarkAttendanceActionResult = { ok: true; status: "ATTENDED" | "NO_SHOW" } | { ok: false; reason: MarkAttendanceFailureReason }`. NEVER throw for expected failures; let `requireAdmin()`'s `NEXT_REDIRECT` propagate (do not wrap it in a swallowing try/catch).
  - [x] The action needs the class `id` for `revalidatePath`. Since the island posts `enrollmentId`, pass the class `id` into the island as a prop (plain string) and include it in the action input, OR derive it — simplest: island holds `classId` (string prop from the page) and sends `{ enrollmentId, outcome }`; the action revalidates `/admin/classes/[id]` using the class id it receives. Choose one and keep the input Zod-covered. (Recommended: add `classId` to the schema so `revalidatePath` is precise.)
- [x] **Task 4 — Client island: per-row Attended / No-show buttons (AC1, AC2).**
  - [x] Create `src/app/(admin)/admin/classes/[id]/mark-attendance-buttons.tsx` (`"use client"`) mirroring `cancel-enrollment-button.tsx`. Props are **plain serialisable** (RSC-500 safe): `{ enrollmentId: string; classId: string; studentLabel: string }`. Render two `Button`s — "Attended" (default/secondary token variant) and "No-show" (outline/subordinate token variant — NOT the gold CTA, UX-DR2). Each: `useState` pending guard, `aria-busy`, `disabled` while pending, `min-h-[44px]`, `focus-visible:ring-2 focus-visible:ring-ring` (NFR10), `aria-label` including the student label.
  - [x] `onClick` → `await markAttendanceAction({ enrollmentId, classId, outcome })`; on `result.ok` → `toast.success(...)` (use the schema's success message) + `router.refresh()` so the row's status Badge updates and the buttons disappear (row is no longer CONFIRMED); else `toast.error(getMarkAttendanceErrorMessage(result.reason))`. Wrap in `try/catch` → generic error toast. No AlertDialog needed (attendance is low-stakes and reversible-by-policy; unlike cancel which moves money).
  - [x] No hardcoded hex — variants resolve to navy+gold tokens per light/dark mode (UX-DR2/DR6).
- [x] **Task 5 — Wire the island into the roster (AC1, AC2).**
  - [x] Edit `src/app/(admin)/admin/classes/[id]/page.tsx`: add an **"Actions"** `TableHead` and a trailing `TableCell` per row. In the cell, render `<MarkAttendanceButtons enrollmentId={enrollment.id} classId={session.id} studentLabel={enrollment.student.name || enrollment.student.email} />` **only when `enrollment.status === "CONFIRMED"`**; otherwise render nothing (or a muted `—`). Import the island at the top. Keep the page a server component (the island is the only client boundary — RSC-500 safe, plain props).
  - [x] The roster query already selects `id`, `status`, `student.name/email` — no query change needed. `session.id` is already selected. Do NOT change the roster's `where`/`orderBy`/scope (6.1 owns it).
- [x] **Task 6 — Unit-test the pure schema (AC3, AC5).**
  - [x] Add `tests/unit/attendance-schema.test.ts`: assert `markAttendanceInputSchema` accepts `{ enrollmentId:"x", outcome:"ATTENDED" }` and `{...outcome:"NO_SHOW"}`; rejects empty `enrollmentId`, a missing/invalid `outcome` (e.g. `"CONFIRMED"`, `"CANCELLED"`, `""`) — this pins the AC3 guarantee that only the two attendance values pass. Assert every `getMarkAttendanceErrorMessage` mapping + the `error` fallback for an unknown reason, and the success message(s). Do NOT unit-test `markAttendance` (imports `db`, needs `DATABASE_URL`) or the page/action (server-only) — the tested seam is the pure schema + mapper.
- [x] **Task 7 — Verify the chain (AC5).**
  - [x] `npx prisma validate` → passes (schema untouched; `EnrollmentStatus` already has `ATTENDED`/`NO_SHOW`).
  - [x] `npm run build` → succeeds (tsc clean; `/admin/classes/[id]` still ƒ Dynamic; the new island compiles as a client component under it).
  - [x] `npm test` → vitest green, including the new `attendance-schema` assertions (32 new tests; 472 total pass).
  - [x] Live mark round-trip (real `CONFIRMED → ATTENDED`/`NO_SHOW` write + roster re-render) deferred to CI ephemeral-Postgres — same sandbox wall as every prior story (prod DB creds blocked interactively; seed = ADMIN only → fresh-seed roster is the empty state). Static verification (`prisma validate` + `build` + vitest) is the bar; do NOT fake a live populated mark.

## Dev Notes

### Architecture guardrails (from ARCHITECTURE-SPINE — binding)
- **AD-14 — `enrollment.ts` is the SOLE `Enrollment.status` writer, and attendance takes NO lock:** *"Every `Enrollment.status` transition — create, `CONFIRMED`, `CANCELLED`, expiry, `ATTENDED`, `NO_SHOW` — is performed by a function in `src/lib/enrollment.ts`; no caller … issues a status `UPDATE` directly. Each transition function takes the appropriate lock (GroupSession row for seat-affecting transitions; **none needed for `ATTENDED`/`NO_SHOW`**)."* → `markAttendance` lives in `enrollment.ts` and uses a plain atomic status-guarded `updateMany` with **no** Serializable/FOR UPDATE/retry. Do NOT cargo-cult `reserveSeat`/`confirmPaidSeat`/`cancelEnrollment`. [Source: ARCHITECTURE-SPINE.md#AD-14]
- **AD-6 — Wallet is the append-only ledger; one serialized mutation path:** attendance writes NO ledger row and calls NO `wallet.ts`. Only reserve/confirm/cancel touch the ledger. [Source: ARCHITECTURE-SPINE.md#AD-6]
- **AD-3 — Authorization at the entry layer:** `requireAdmin()` FIRST in the server action (before any parse/write); the `(admin)` layout is defense-in-depth only. [Source: ARCHITECTURE-SPINE.md#AD-3; auth-guards.ts]
- **AD-2 — Single data gateway:** import `{ db }` from `@/lib/db`; never `new PrismaClient()`. [Source: ARCHITECTURE-SPINE.md#AD-2; db.ts]
- **AD-1 — Additive isolation:** all new surface lives under `(admin)/admin/classes/[id]` + `src/lib`; marketing routes, SEO, sitemap, headers untouched. [Source: ARCHITECTURE-SPINE.md#AD-1]
- **Capability map:** *"Admin class CRUD + roster (FR16,17) → `(admin)/admin/**` → AD-1, AD-3, AD-14, AD-16."* This story is the FR17 attendance half. [Source: ARCHITECTURE-SPINE.md#Capability → Architecture Map]
- **Open item (do NOT build):** the spine's future-work list records *"an admin-action audit log (who changed a class / marked attendance) … open items, not yet decided."* Do NOT add an audit-trail table/log in this story. [Source: ARCHITECTURE-SPINE.md#Deferred/Out-of-scope]

### Ledger model — why NO_SHOW writes nothing (BINDING)
- The `BOOKING_CHARGE = -priceCents` was already taken when the seat was reserved (Story 3.4 balance path or 4.2 webhook confirm). A **no-show forfeits** that charge: the student gets **0% back**, which is the **absence** of a refund — **not** a new debit or fee row. Writing any `LedgerEntry` on a NO_SHOW mark would either double-count or invent a charge with no invariant behind it. So `markAttendance` performs **zero** wallet writes. [Source: epics.md FR14; 5-2 Ledger model note; ARCHITECTURE-SPINE.md#AD-6/AD-11]
- FR14's "…or no-show → 0%" refers to the **cancellation refund tier constant** (AD-11), which is consumed only on the **cancel** path (Story 5.2, `computeRefund`). The attendance mark and the refund policy are **not** runtime-coupled. [Source: epics.md FR14; cancellation.ts; 5-2-...md]

### Concurrency & atomicity (why no Serializable is correct)
- The transition guard lives in the WHERE clause: `updateMany({ where: { id, status: "CONFIRMED" }, data: { status: outcome } })`. Postgres applies this as a single atomic statement. Two concurrent marks on the same row: exactly one observes `status="CONFIRMED"` and writes (`count===1`); the other sees the already-changed row and writes nothing (`count===0` → `not_markable`). No lost update, no oversell surface, no need for SSI. This is the textbook "conditional update" idempotency guard. [Source: AD-14; contrast reserveSeat's seat-affecting envelope in enrollment.ts:190-462]
- Because attendance does not read-then-write occupancy, price, or balance, there is nothing for a `FOR UPDATE`/Serializable envelope to protect. Adding it would be the exact anti-pattern the 3.5 `creditWalletAction` header warns against ("cargo-culting 3.4's Serializable would be wrong"). [Source: (admin)/admin/students/[id]/actions.ts:24-26]

### Scope boundary (do NOT do — belongs to other stories or is deferred)
- **No `ATTENDED ↔ NO_SHOW` correction / re-marking** — the AC is "Given a CONFIRMED enrollment"; correcting a misclick is additive scope. Guard is `status === "CONFIRMED"` only; widen the WHERE `status` filter later if a correction story lands. (Decision logged.)
- **No class-start-time guard** — the AC does not require the class to have started before marking; minimal interpretation allows marking any CONFIRMED enrollment. Do NOT add a `start <= now` gate (it would block the CI live test and is unspecified). (Decision logged.)
- **No seat-confirmation email, no `email.ts`/`meeting.ts` touch** — Story 6.3.
- **No portal polish / seats-left / empty-state / toast-consistency sweep** — Story 6.4 (this story adds only the two success/failure toasts its own action needs).
- **No wallet write / no refund / no fee ledger row** — see Ledger model above (AD-6).
- **No schema/migration/enum change** — `EnrollmentStatus` already has `ATTENDED`/`NO_SHOW` (verified). No new dependency, no date library, no pagination/search (rosters are ≤ capacity 6 in 1a).
- **No admin-action audit log** — spine open item, not decided (see guardrails).
- **No change to the 6.1 roster query scope** (`where: { groupSessionId, status: { not: "CANCELLED" } }`, `orderBy createdAt asc`) — 6.1 owns it; only ADD the Actions column.

### Previous story intelligence (6.1 + the reuse map)
- **6.1 (`/admin/classes/[id]` roster, done)** is the direct predecessor: it built the read-only roster and the `formatEnrollmentStatus`/`enrollmentStatusBadgeVariant` helpers that already cover `ATTENDED`/`NO_SHOW`. It deliberately left the row as a place to attach controls. You ADD an Actions column + the island; do NOT re-implement the table, header, empty-state, or status helpers. [Source: 6-1-enrollment-roster-with-paid-pending-status.md]
- **5.2 (`cancelEnrollment` + `cancelEnrollmentAction` + `CancelEnrollmentButton` + `cancel-schema.ts`, done)** is the closest structural template for a status-transition + action + client island + pure schema — mirror the file shapes and the plain-string-props RSC-500 discipline. **But do NOT copy 5.2's Serializable/FOR UPDATE/retry envelope** — cancel is seat-affecting and moves money; attendance is neither. [Source: enrollment.ts#cancelEnrollment; my-classes/actions.ts; cancel-enrollment-button.tsx; cancel-schema.ts]
- **3.5 (`creditWalletAction`, done)** is the exact admin-action recipe and carries the explicit "no Serializable — don't cargo-cult 3.4" precedent that applies verbatim here. [Source: (admin)/admin/students/[id]/actions.ts]
- **1.5 RSC-500 trap + smoke net:** never pass a Client Component element through a non-`children` prop from a Server Component. The island takes only plain string props from the roster page → safe. The roster route is already in the e2e manifest (6.1) — the 200-smoke still covers the page; the action is POST-side (not a GET route). [Source: 1-5-...md; lessons-learned; tests/e2e/authenticated-routes.ts]
- **Sandbox reality (every prior story):** prod DB creds are blocked interactively; live status-write round-trips are deferred to CI ephemeral-Postgres. Static verification (`prisma validate` + `build` + vitest) is the bar. Seed = ADMIN only (no student/enrollments) → a fresh-seed roster is the empty state, so there is no CONFIRMED row to click locally — do NOT fake one. [Source: deferred-work.md; 6-1 Task 5]
- **Git:** work continues on branch `epic-6` (6.1 already landed here). New files: `attendance-schema.ts`, `[id]/actions.ts`, `[id]/mark-attendance-buttons.tsx`, `tests/unit/attendance-schema.test.ts`; edits: `enrollment.ts` (+`markAttendance`), `[id]/page.tsx` (+Actions column). Nothing conflicts with prior epics. [Source: sprint-status.yaml]

### Data model facts this story depends on (from schema.prisma — verified)
- `Enrollment { id, studentId, student → User, groupSessionId, session → GroupSession, priceCents, status EnrollmentStatus @default(PENDING), pendingExpiresAt DateTime?, paymentRef String? @unique, createdAt, @@unique([studentId, groupSessionId]), @@index([groupSessionId, status]) }`. The `updateMany({ where:{ id, status } })` guard uses the primary key + status; the `@@index([groupSessionId, status])` is for the roster read (6.1), not needed for the id-keyed write. [Source: schema.prisma:142-167]
- `EnrollmentStatus` enum values: `PENDING, CONFIRMED, CANCELLED, ATTENDED, NO_SHOW` — `ATTENDED`/`NO_SHOW` already exist; no migration. [Source: schema.prisma:134-141]

### UX / accessibility (UX-DR8, UX-DR2/DR6, UX-DR5, NFR10)
- **UX-DR8 (roster readability):** the Actions column keeps the roster scannable; "Attended" is the primary/positive mark (default or secondary token variant), "No-show" is subordinate (outline). Already-marked rows show only the Badge — the label carries the state (UX-DR6), no lingering controls. [Source: DESIGN.md; UX-DR8]
- **UX-DR5 (toasts):** success and each failure reason produce a sonner toast via `getMarkAttendanceErrorMessage` (mirrors 5.2's `getCancelErrorMessage`). [Source: cancel-enrollment-button.tsx; UX-DR5]
- **UX-DR2/DR6:** buttons use token variants (navy+gold per light/dark), NO hardcoded hex; the gold CTA stays reserved for primary create/pay actions, not per-row admin marks. State is carried by label text, not colour alone. [Source: DESIGN.md; ARCHITECTURE-SPINE.md#Consistency Conventions]
- **NFR10:** both buttons keyboard-operable, visible focus ring, ≥44px touch target, ≥4.5:1 / ≥3:1 contrast in both modes, `aria-busy` while pending, honor `prefers-reduced-motion`. shadcn `Button` carries focus-ring + tokens. [Source: ARCHITECTURE-SPINE.md#Consistency Conventions; NFR10]

### Testing standards
- Framework: **vitest** (jsdom), `npm test`, specs under `tests/unit/**`. Playwright e2e is separate (`tests/e2e`, DB-bound) — not run here; the roster route is already in `authenticated-routes.ts` (6.1). [Source: acce-nextjs/vitest.config.ts; 6-1-...md]
- Unit-test the **pure** `attendance-schema.ts` only: the `outcome` enum accepts exactly `ATTENDED`/`NO_SHOW` and rejects everything else (pins AC3's guard), plus the reason→message mapper + fallback + success message(s). Do NOT unit-test `markAttendance` (imports `db`) or the action/island (server/client) — the live write is a CI concern. Do NOT over-mock Prisma to fake `updateMany`. [Source: cancel-schema.test.ts pattern; 6-1 Task 4]

### Project Structure Notes
- App root `acce-nextjs/`; alias `@/*` → `acce-nextjs/src/*`.
- New files:
  - `src/lib/attendance-schema.ts` — pure Zod input schema (`enrollmentId` + `outcome` enum + optional `classId`) + reason→message mapper + success message(s).
  - `src/app/(admin)/admin/classes/[id]/actions.ts` — `"use server"` `markAttendanceAction` (requireAdmin → safeParse → `markAttendance` → revalidatePath).
  - `src/app/(admin)/admin/classes/[id]/mark-attendance-buttons.tsx` — `"use client"` per-row Attended/No-show island (plain string props, sonner toast, router.refresh).
  - `tests/unit/attendance-schema.test.ts` — schema + mapper assertions.
- UPDATE (additive):
  - `src/lib/enrollment.ts` — add exported `markAttendance` + `MarkAttendanceResult` (AD-14 sole writer, no lock).
  - `src/app/(admin)/admin/classes/[id]/page.tsx` — add an Actions column rendering the island on CONFIRMED rows only.
- NOT modified: `src/lib/enrollment-display.ts` (6.1 helpers reused as-is), the roster query scope, `tests/e2e/authenticated-routes.ts` (route already present), `prisma/schema.prisma`.

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 6.2 / Epic 6 / FR17, FR14, UX-DR8]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md#AD-14 (sole status writer, "none needed for ATTENDED/NO_SHOW"), AD-6, AD-3, AD-2, AD-1, "Capability → Architecture Map" (Admin roster FR17), Deferred (admin-action audit log open item)]
- [Source: acce-nextjs/prisma/schema.prisma:134-167 (EnrollmentStatus + Enrollment)]
- [Source: acce-nextjs/src/lib/enrollment.ts (AD-14 sole writer; add markAttendance)] · [Source: acce-nextjs/src/lib/enrollment-display.ts (reuse formatEnrollmentStatus + badge variant)]
- [Source: acce-nextjs/src/lib/auth-guards.ts (requireAdmin)] · [Source: acce-nextjs/src/lib/db.ts (db singleton)]
- [Source: acce-nextjs/src/app/(admin)/admin/classes/[id]/page.tsx (6.1 roster — add Actions column)]
- [Source: acce-nextjs/src/app/(admin)/admin/students/[id]/actions.ts (admin server-action recipe + "no Serializable" precedent)]
- [Source: acce-nextjs/src/app/(portal)/portal/my-classes/cancel-enrollment-button.tsx (client-island recipe, RSC-500-safe plain props)]
- [Source: acce-nextjs/src/lib/cancel-schema.ts + tests/unit/cancel-schema.test.ts (pure schema + mapper + unit-test template)]
- [Source: _bmad-output/implementation-artifacts/6-1-enrollment-roster-with-paid-pending-status.md (predecessor — roster + reserved helper reuse)]
- [Source: _bmad-output/implementation-artifacts/5-2-...done note in sprint-status.yaml (ledger model precedent for fee/refund audit rows)]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md (CI ephemeral-Postgres for live DB ops)]

### Latest tech notes
- **Prisma 6.19.3**: `updateMany({ where:{ id, status:"CONFIRMED" }, data:{ status } })` returns `{ count }` — a single atomic conditional UPDATE, the idiomatic optimistic guard without a transaction. No `$transaction`/Serializable needed for a non-seat-affecting status flip. [Source: schema.prisma generator; ARCHITECTURE-SPINE.md#AD-14]
- **Next 16 App Router**: colocated `"use server"` `actions.ts` + a `"use client"` island under the `[id]` segment is the established pattern (see `(portal)/portal/classes/[id]` and `my-classes`). The roster `page.tsx` stays a server component; only the island is a client boundary. `params` remains a `Promise` in the page (unchanged from 6.1). [Source: (portal)/portal/my-classes/*; (admin)/admin/students/[id]/*]
- **`revalidatePath('/admin/classes/${id}')`** invalidates the roster RSC cache so `router.refresh()` in the island fetches the fresh server render with the updated Badge — the same success pattern 5.2 uses for the cancel flow. No client-side status mutation. [Source: my-classes/actions.ts + cancel-enrollment-button.tsx]

## Dev Agent Record

### Agent Model Used
claude-sonnet-4-6 (autopilot subagent)

### Debug Log References
No debug issues encountered. All tasks implemented cleanly on first attempt.

### Completion Notes List

- Task 1: Created `src/lib/attendance-schema.ts` — pure db-free Zod schema (`enrollmentId` + `classId` + `outcome` enum) + `MarkAttendanceFailureReason` + `MARK_ATTENDANCE_SUCCESS(outcome)` helper returning "Marked as attended"/"Marked as no-show" + `MARK_ATTENDANCE_ERROR_MESSAGES` record + `getMarkAttendanceErrorMessage` with `error` fallback. No Prisma/db import → safe for jsdom vitest. AC3 guard verified: `z.enum(["ATTENDED","NO_SHOW"])` rejects "CONFIRMED", "CANCELLED", "PENDING", "" (pinned by 32 unit tests).
- Task 2: Appended `MarkAttendanceResult` + `markAttendance(enrollmentId, outcome)` to `src/lib/enrollment.ts`. Plain atomic `updateMany({where:{id,status:"CONFIRMED"},data:{status:outcome}})` — NO GroupSession FOR UPDATE, NO Serializable, NO retry loop, NO wallet.mutate (AD-14 verbatim). count===1→ok, count===0→cheap findUnique disambiguates not_markable vs not_found. try/catch → error with structured console.error.
- Task 3: Created `src/app/(admin)/admin/classes/[id]/actions.ts` (`"use server"`). Order: (1) `requireAdmin()` FIRST (AD-3); (2) `markAttendanceInputSchema.safeParse` with outcome enum guard (AC3); (3) `markAttendance(enrollmentId, outcome)` (AD-14 sole writer); (4) `revalidatePath('/admin/classes/${classId}')` + `revalidatePath('/admin/classes')` on success. NEXT_REDIRECT propagates naturally from requireAdmin().
- Task 4: Created `src/app/(admin)/admin/classes/[id]/mark-attendance-buttons.tsx` (`"use client"`). Plain string props (RSC-500 safe). Two shadcn Buttons — "Attended" (variant="secondary") + "No-show" (variant="outline"). useState pending guard, aria-busy, disabled while pending, min-h-[44px], focus-visible ring (NFR10), aria-label with studentLabel. Success → MARK_ATTENDANCE_SUCCESS toast + router.refresh(). Error → getMarkAttendanceErrorMessage toast. try/catch → generic error toast. No AlertDialog (attendance low-stakes).
- Task 5: Updated `src/app/(admin)/admin/classes/[id]/page.tsx` — added "Actions" TableHead + trailing TableCell per row. Renders `<MarkAttendanceButtons enrollmentId={enrollment.id} classId={session.id} studentLabel={...} />` only for CONFIRMED rows; muted "—" otherwise. Imported island at top. Page stays server component; island is only client boundary (RSC-500 safe).
- Task 6: Created `tests/unit/attendance-schema.test.ts` with 32 assertions covering schema valid/invalid (enrollmentId, classId, outcome enum AC3 guard), MARK_ATTENDANCE_SUCCESS per-outcome, MARK_ATTENDANCE_ERROR_MESSAGES all 3 reasons, getMarkAttendanceErrorMessage per-reason + fallback.
- Task 7: `npx prisma validate` → clean (schema untouched). `npm test` → 472/472 pass (32 new). `npm run build` → tsc clean, `/admin/classes/[id]` ƒ Dynamic present. Live mark round-trip deferred to CI ephemeral-Postgres (seed = ADMIN only → empty roster).

### File List

- `acce-nextjs/src/lib/attendance-schema.ts` — NEW: pure Zod input schema + failure reason type + success helper + error messages + mapper
- `acce-nextjs/src/lib/enrollment.ts` — UPDATED: appended `MarkAttendanceResult` + `markAttendance()` (AD-14 sole writer, plain atomic updateMany, no lock)
- `acce-nextjs/src/app/(admin)/admin/classes/[id]/actions.ts` — NEW: `"use server"` `markAttendanceAction` (requireAdmin→safeParse→markAttendance→revalidatePath)
- `acce-nextjs/src/app/(admin)/admin/classes/[id]/mark-attendance-buttons.tsx` — NEW: `"use client"` per-row Attended/No-show island (plain string props, sonner toast, router.refresh)
- `acce-nextjs/src/app/(admin)/admin/classes/[id]/page.tsx` — UPDATED: added Actions column + MarkAttendanceButtons island for CONFIRMED rows
- `acce-nextjs/tests/unit/attendance-schema.test.ts` — NEW: 32 unit tests for pure schema + mapper + AC3 outcome-enum guard


## Change Log

- 2026-07-07: Story implemented — attendance-schema.ts (pure schema + mapper), markAttendance in enrollment.ts (AD-14 plain atomic updateMany no lock), markAttendanceAction server action (requireAdmin-first), MarkAttendanceButtons client island, Actions column wired into 6.1 roster page, 32 new unit tests; 472/472 vitest, build clean, prisma validate clean.
