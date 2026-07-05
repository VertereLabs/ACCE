---
baseline_commit: 1d96dabac5261fc8f54f35d42653eeb26b45c790
---

# Story 2.1: Create a group class

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Priyanka (ADMIN),
I want to create a group class with all its details through an admin form,
so that students have a real, sellable seat to buy.

## Context & current state (READ FIRST)

Epic 1 is `done`: the data layer (`schema.prisma` + `db.ts` singleton), Better Auth (magic-link + admin plugin), the `(portal)`/`(admin)` route groups with role guards, the seed, and the deploy shell all exist and are verified. **This is the first story of Epic 2 (Admin Class Management) and the FIRST server-side mutation in the entire app — there are no existing server actions to copy.** You are establishing the pattern.

What already exists and MUST be reused (do not recreate):

- **`GroupSession` model is fully migrated** — `id cuid`, `subjectId → Subject`, `level String`, `title String`, `description String?`, `start DateTime`, `end DateTime`, `capacity Int`, `priceCents Int`, `mode Mode @default(ONLINE)`, `location String?`, `meetingUrl String?`, `status GroupSessionStatus @default(SCHEDULED)`, `createdAt`, `updatedAt`. **No schema or migration change is in scope for this story.** [Source: acce-nextjs/prisma/schema.prisma:114-132]
- **Enums:** `Mode = ONLINE | IN_PERSON`; `GroupSessionStatus = SCHEDULED | CANCELLED | COMPLETED`. [Source: acce-nextjs/prisma/schema.prisma:103-112]
- **`requireAdmin()`** in `src/lib/auth-guards.ts` — returns the session for `role === "ADMIN"`, else redirects (`/sign-in` if unauthenticated, `/portal` if a non-admin). This is the TRUSTED entry guard (AD-3). Call it INSIDE the server action AND at the top of the page. [Source: acce-nextjs/src/lib/auth-guards.ts:49-58]
- **`db` singleton** from `src/lib/db.ts` — the ONLY `PrismaClient` (AD-2). Never `new PrismaClient()`. Server actions import `{ db }` via the `@/lib/db` alias (Next resolves `@/*`; the tsx-alias caveat only applies to `prisma/seed.ts`). [Source: acce-nextjs/src/lib/db.ts]
- **Admin shell** — `(admin)/layout.tsx` guards with `requireAdmin()` and renders `<PortalNav/>` + `<main>`. The current `(admin)/admin/page.tsx` is a placeholder that literally says "Class management arrives in Epic 2." [Source: acce-nextjs/src/app/(admin)/admin/page.tsx; (admin)/layout.tsx]
- **shadcn UI primitives** are all present: `card`, `button`, `input`, `label`, `textarea`, `select`, `form` (react-hook-form wrapper), `badge`. Sonner `<Toaster/>`-style toasts are **globally mounted** in `src/app/layout.tsx` — import `{ toast }` from `@/components/ui/sonner`. [Source: acce-nextjs/src/components/ui/*; acce-nextjs/src/app/layout.tsx:5]
- **Deps already installed** (no new dependency needed): `zod@^4.3.4`, `react-hook-form@^7.69.0`, `@hookform/resolvers@^5.2.2`, `sonner`, `@prisma/client@^6.7.0`. [Source: acce-nextjs/package.json]

**This story = add a "New class" admin route (`(admin)/admin/classes/new`) with a client form, a colocated Zod-validated server action that persists one `SCHEDULED` `GroupSession` with `priceCents` in integer cents, and a unit test on the validation schema.** No list, no edit (those are Stories 2.2 / 2.3), no enrollment/payment/wallet code.

## Acceptance Criteria

**AC1 — Valid submit creates a SCHEDULED class (FR16).**
Given I am an authenticated ADMIN on the admin "new class" form,
When I enter subject, level, title, description, start, end, capacity, per-seat price (in Rand), mode (online/in-person), location (if in-person), and an optional Meet link (if online) and submit,
Then the input is validated with **Zod inside a server action**, `requireAdmin()` passes, and exactly one `GroupSession` row is persisted with: `status = SCHEDULED`, the selected `subjectId`, `level`, `title`, `description`, `start`, `end`, `capacity`, `mode`, `location`/`meetingUrl` as applicable, and **`priceCents` stored as integer cents** (Rand × 100, `Math.round`, no floats — AD-9).

**AC2 — Invalid input is rejected with field-level errors.**
Given invalid input — **end at or before start**, **capacity < 1**, a **missing required field** (subject, level, title, start, end, capacity, price), a **non-positive or non-numeric price**, or **mode = IN_PERSON with no location** —
When I submit,
Then no `GroupSession` is created and the specific field-level validation error(s) are shown on the form; a submit that fails server validation surfaces an error state (and a sonner error toast for unexpected/server failures).

**AC3 — Success feedback and post-create navigation.**
Given a successful create,
When the server action returns `{ ok: true }`,
Then the admin sees a success confirmation (sonner success toast) and is returned to a sensible admin destination (the admin classes area — `/admin/classes` if it exists, else `/admin`); no client-thrown exception crosses the UI boundary for the expected "validation failed" path (discriminated `{ ok:false, error }` result, not a throw).

**AC4 — Authorization is enforced at the entry, not just the route group.**
Given a non-admin (or unauthenticated) actor,
When the create server action is invoked directly,
Then `requireAdmin()` blocks it server-side before any write — the `(admin)` layout/middleware redirect is defense-in-depth, not the trusted guard (AD-3).

**AC5 — Chain stays green (no regressions).**
`npx prisma validate` passes (schema untouched), `npm run build` succeeds (tsc clean), and `npm test` (vitest) stays green **including a new unit test** on the class-form Zod schema covering the AC2 invalid cases plus a happy path and the Rand→cents conversion. No schema/migration files are modified.

## Tasks / Subtasks

- [x] **Task 1 — Canonical LEVELS constant + Zod schema (pure, testable) (AC1, AC2, AC5).**
  - [x] Add a small canonical constant module in `src/lib` (e.g. `src/lib/class-constants.ts`) exporting `LEVELS = ["Undergrad", "CTA/PGDA"] as const` and its `LevelValue` type. Do **not** import `prisma/seed-data.ts` into app code, and do **not** add a `Level` table (1a schema is locked — level is a `String` tag; the `Level` model arrives in 1b). Small intentional duplication of the seed's LEVELS is accepted. [Source: ARCHITECTURE-SPINE.md#AD-9 conventions; schema.prisma:119; 1-4...md:102-103]
  - [x] Create a **pure exported Zod schema** colocated with the route (e.g. `src/app/(admin)/admin/classes/new/class-form-schema.ts`) — no `db`/Prisma import, so vitest can unit-test it. Model the raw form input (strings from the form) and transform to typed values:
    - `subjectId`: non-empty string (must be one of the subjects loaded server-side; existence re-checked in the action).
    - `level`: `z.enum(LEVELS)`.
    - `title`: non-empty, trimmed, sane max (e.g. ≤200).
    - `description`: optional string (trim; empty → `undefined`).
    - `start`, `end`: coerce to `Date` (`z.coerce.date()`); `refine(end > start, "End must be after start")`.
    - `capacity`: `z.coerce.number().int().min(1, "Capacity must be at least 1")`. (Floor is ≥1 — the only hard invalid boundary the ACs name; show "4–6 recommended" as helper text, not a hard cap.)
    - `priceRand`: `z.coerce.number().positive("Price must be greater than 0")` (accept Rand with optional decimals); the **action** converts to `priceCents = Math.round(priceRand * 100)` (AD-9 — do the cents conversion server-side, never store a float).
    - `mode`: `z.enum(["ONLINE", "IN_PERSON"])`.
    - `location`: optional; add a `superRefine`/`refine` — **required when `mode === "IN_PERSON"`** (attach the error to the `location` path).
    - `meetingUrl`: optional even for online (AD-13 — Priyanka pastes it later via edit; leave null at create). If provided, validate it looks like a URL (`z.string().url()` optional).
  - [x] Export a helper the action reuses to turn parsed input into the Prisma `data` object (or inline it) so cents conversion lives in ONE place.
- [x] **Task 2 — Server action (colocated, Zod-validated, admin-guarded) (AC1, AC2, AC4).**
  - [x] Create `src/app/(admin)/admin/classes/new/actions.ts` with `"use server"`. Export an async `createClassAction(input)` (or `(prevState, formData)` if you wire `useActionState`) that:
    1. calls `await requireAdmin()` FIRST (AD-3 trusted guard — before any parse/write);
    2. parses with the Task-1 schema (`safeParse`); on failure returns a **discriminated** `{ ok: false, fieldErrors }` (from `error.flatten().fieldErrors`) — never throw for expected validation failures (convention: result object at the UI boundary);
    3. re-checks the `subjectId` exists (`db.subject.findUnique`) — reject unknown subject;
    4. computes `priceCents = Math.round(priceRand * 100)`;
    5. `db.groupSession.create({ data: { subjectId, level, title, description, start, end, capacity, priceCents, mode, location (only if IN_PERSON), meetingUrl (only if provided), status: "SCHEDULED" } })` — rely on the model default for `status` or set it explicitly; **do not** set any seat counter (AD-5 — occupancy is derived);
    6. returns `{ ok: true, id }`.
  - [x] Do NOT use a transaction/`FOR UPDATE` here — create has no concurrency invariant (that lock is AD-16 for *edits*, Story 2.3). Keep this action free of enrollment/wallet logic.
- [x] **Task 3 — New-class page + client form (AC1, AC2, AC3).**
  - [x] Create `src/app/(admin)/admin/classes/new/page.tsx` as a **server component**: call `await requireAdmin()` (trusted page guard, AD-3), then `db.subject.findMany({ orderBy: { name: "asc" } })` to get subject options, and render the client form passing `subjects` and the `LEVELS` constant as props.
  - [x] Create the client form (`"use client"`, e.g. `class-form.tsx`) using shadcn `form` + react-hook-form + `@hookform/resolvers/zod` (reuse the Task-1 schema client-side for instant field errors) and shadcn `input`/`textarea`/`select` inside a `card`. Fields: Subject (`select` from props), Level (`select` from LEVELS), Title (`input`), Description (`textarea`), Start & End (native `datetime-local` `input`s), Capacity (`input type=number`, helper "4–6 recommended"), Price in Rand (`input`, label "Per-seat price (R)"), Mode (`select`/radio ONLINE|IN_PERSON), Location (`input`, shown/required when IN_PERSON), Meet link (`input`, optional, shown when ONLINE).
  - [x] On submit call `createClassAction`; if `{ ok:false }` map `fieldErrors` back onto the form (`setError`) and/or show a sonner error toast; if `{ ok:true }` show a sonner success toast and `router.push` to `/admin` (fallback before Story 2.2 ships). Ensure one gold-accent primary CTA (UX-DR2), visible focus rings, ≥44px targets, both-mode contrast (NFR10/UX-DR6). Reuse existing navy+gold tokens — no new palette.
- [x] **Task 4 — Unit test the schema (AC5).**
  - [x] Add `tests/unit/class-form-schema.test.ts` (vitest) importing the **pure** schema (NOT `actions.ts`, which imports `db`). Assert: a happy-path object parses; `end <= start` fails; `capacity = 0`/negative fails; missing `title`/`subjectId`/`start`/`end`/price fails; `price <= 0`/non-numeric fails; `mode = IN_PERSON` with no `location` fails; `mode = ONLINE` with no `meetingUrl` **passes**; and verify the Rand→cents conversion (e.g. `290 → 29000`, `290.5 → 29050`) via the shared helper. Do NOT spin a live DB.
- [x] **Task 5 — Verify the chain (AC5).**
  - [x] `npx prisma validate` → passes (schema untouched).
  - [x] `npm run build` → succeeds (tsc clean; server page passes plain data props to client form — RSC non-children-prop trap avoided; one TS cast needed for zodResolver<>useForm generic mismatch on coerced date/number fields, per decision log).
  - [x] `npm test` → 119/119 vitest green (83 prior + 36 new schema tests).
  - [x] Live-DB create deferred to CI ephemeral-Postgres (same sandbox wall as 1.1/1.4/1.5). Static verification complete.

## Dev Notes

### Architecture guardrails (from ARCHITECTURE-SPINE — binding)
- **AD-3 — Authorization at the data/entry layer:** `requireAdmin()` is called **inside the server action** (trusted) AND at the top of the page (defense-in-depth). A layout/middleware is NOT the security boundary. [Source: ARCHITECTURE-SPINE.md#AD-3; auth-guards.ts]
- **AD-2 — Single data gateway:** import `{ db }` from `@/lib/db`; never `new PrismaClient()`. [Source: ARCHITECTURE-SPINE.md#AD-2]
- **AD-9 — Money is integer cents (ZAR):** the form takes Rand; the action stores `priceCents = Math.round(rand*100)`. No float ever reaches the DB or domain. Format to `R` only at the UI edge. [Source: ARCHITECTURE-SPINE.md#AD-9; schema.prisma:124]
- **AD-5 — Capacity is derived, never stored:** set the `capacity` cap only. Do NOT create/seed any "seats left" or occupancy counter — live occupancy is counted from `Enrollment`. [Source: ARCHITECTURE-SPINE.md#AD-5]
- **AD-13 — Manual Meet link in 1a:** `meetingUrl` is optional at create and typically null; Priyanka pastes it later (Story 2.3). Do not require it and do not fabricate one. [Source: ARCHITECTURE-SPINE.md#AD-13]
- **AD-16 does NOT apply to create:** the `GroupSession` `FOR UPDATE` lock + optimistic-concurrency (`updatedAt`) + capacity-vs-occupied check are for *edits* (Story 2.3). A create has no concurrent invariant — do not add a transaction/lock here. Keep this scoped so 2.3 owns the edit-concurrency contract. [Source: ARCHITECTURE-SPINE.md#AD-16]
- **AD-1 — Additive isolation:** the new route lives only under `(admin)/admin/classes/new`; marketing routes, SEO, and headers are untouched. [Source: ARCHITECTURE-SPINE.md#AD-1]
- **Convention — server-entry result shape:** discriminated `{ ok: true, … } | { ok: false, error }`; never throw across the UI boundary for expected failures. Zod validates at every server entry BEFORE touching domain/db. Errors to the user surface via sonner toasts. [Source: ARCHITECTURE-SPINE.md#Consistency Conventions]

### Data model facts this story depends on (from schema.prisma — verified)
- `GroupSession` fields exactly as listed in "Context & current state"; `status` defaults to `SCHEDULED`, `mode` defaults to `ONLINE`. `id` is `cuid()` (auto — do NOT supply one for admin-created rows; only the seed uses explicit deterministic ids). [Source: schema.prisma:114-132]
- `Subject { id cuid, name @unique, sessions }` — load options with `db.subject.findMany`. The 4 seeded subjects are Accounting, Management Accounting & Finance, Auditing, Tax. [Source: schema.prisma:96-101; 1-4...md]
- `level` is a free `String` column (no FK); constrain it in the app to the two canonical LEVELS values via the Zod enum. [Source: schema.prisma:119]
- Do NOT touch `Enrollment`, `LedgerEntry`, `Payment`, or any Better Auth table.

### Scope boundary (do NOT do — belongs to other stories)
- **No class list / index page** and no empty-state — that's Story 2.2. (You may `router.push('/admin/classes')` on success even though that route lands in 2.2; fall back to `/admin` so the redirect never 404s before 2.2 ships — or push `/admin`. Pick one and note it.)
- **No edit form, no capacity-vs-occupied check, no optimistic-concurrency/`updatedAt` guard, no `FOR UPDATE`** — Story 2.3 (AD-16).
- No schema/migration/enum changes; no new dependency.
- No enrollment, wallet, ledger, Paystack, or email code; no seat-counter.
- No Meet-link generation; `meetingUrl` stays a manual optional field.

### Previous story intelligence (Epic 1)
- **1.4 pattern to mirror:** extract pure, importable constants/schema into a module free of `db`/`DATABASE_URL` so vitest (jsdom) can test it without a live DB. The class-form Zod schema is the analog of `seed-data.ts`. [Source: 1-4...md:54,120]
- **Sandbox reality (1.1/1.4/1.5):** prod DB creds are blocked interactively; live DB operations are deferred to the pipeline/CI ephemeral-Postgres. Static verification (`prisma validate` + `build` + vitest) is the bar here. Do not fake a live create. [Source: 1-1...md:90; 1-4...md:72; deferred-work.md]
- **1.3 established `requireAdmin()`** and the `(admin)` layout as defense-in-depth with per-page trusted checks — reuse exactly; do not invent a new guard. [Source: 1-3...md; auth-guards.ts]
- **1.5 RSC-500 trap:** never pass a Client Component element through a non-`children` prop from a Server Component (silent HTTP 500, invisible to tsc/unit). The new page passes plain serializable props (`subjects`, `levels`) to the client form — safe. If you add the new route to the e2e manifest, the 200-smoke catches a regression. [Source: lessons-learned; 1-5...md; deferred-work.md]
- **Git:** work lands on branch `epic-2` (chained off `epic-1` tip). Recent epic-1 commits: schema+singleton (1.1), Better Auth (1.2), guards+route groups (1.3), seed (1.4), deploy shell+smoke (1.5). Nothing conflicts with a net-new `classes/new` route.

### UX / accessibility (UX-DR2, UX-DR6, NFR10)
- Reuse the existing navy+gold token system and shadcn primitives (`card`, `input`, `select`, `textarea`, `button`, `form`) — no new palette. One gold-accent primary CTA per view (the "Create class" submit).
- Every control keyboard-operable with a visible focus ring, ≥44px touch targets, ≥4.5:1 body / ≥3:1 large-text contrast in both dark and light modes, honor `prefers-reduced-motion`. The shadcn `Input`/`Button` already carry the focus-ring styling used on the sign-in page — follow that page's structure. [Source: sign-in/page.tsx; ARCHITECTURE-SPINE.md#Consistency Conventions]
- Client feedback via sonner: `toast.success(...)` on create, `toast.error(...)` on server/unexpected failure (validation errors render inline on fields). Sonner is already globally mounted. [Source: layout.tsx; sign-in/page.tsx:14,37,42]

### Testing standards
- Framework: **vitest** (jsdom), `npm test`, specs under `tests/unit/**`. Playwright e2e is separate (`tests/e2e`) and DB-bound — not required to run here. [Source: 1-4...md:119; acce-nextjs/vitest.config.ts]
- Unit-test the **pure Zod schema + cents helper** (NOT `actions.ts`, which imports `db` and throws without `DATABASE_URL`). Cover every AC2 invalid case, a happy path, and the Rand→cents conversion. Do not mock PrismaClient to fake a create — over-mocking proves nothing; live create is a pipeline/CI concern.

### Project Structure Notes
- App root `acce-nextjs/`; alias `@/*` → `acce-nextjs/src/*` (Next + vitest; server actions/pages use the alias freely — the tsx no-alias caveat is only for `prisma/seed.ts`).
- New files (all NEW):
  - `src/lib/class-constants.ts` — `LEVELS` constant + type.
  - `src/app/(admin)/admin/classes/new/class-form-schema.ts` — pure Zod schema + cents helper.
  - `src/app/(admin)/admin/classes/new/actions.ts` — `"use server"` create action.
  - `src/app/(admin)/admin/classes/new/page.tsx` — server page (guard + subject fetch).
  - `src/app/(admin)/admin/classes/new/class-form.tsx` — `"use client"` form.
  - `tests/unit/class-form-schema.test.ts` — schema unit test.
- Optional UPDATE: add a link/button on `(admin)/admin/page.tsx` to `/admin/classes/new`, and/or add the route to the 1.5 authenticated-route e2e manifest. Keep any placeholder-page edits minimal.

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1 / Epic 2 / FR16]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md#AD-1, AD-2, AD-3, AD-5, AD-9, AD-13, AD-16, "Consistency Conventions", "Capability → Architecture Map" (Admin CRUD)]
- [Source: acce-nextjs/prisma/schema.prisma:96-132] · [Source: acce-nextjs/src/lib/auth-guards.ts] · [Source: acce-nextjs/src/lib/db.ts]
- [Source: acce-nextjs/src/app/(admin)/admin/page.tsx; (admin)/layout.tsx; src/app/sign-in/page.tsx (form/toast pattern)]
- [Source: _bmad-output/implementation-artifacts/1-4-seed-subjects-levels-priyanka-and-the-6-test-3-classes.md (pure-module testability, sandbox posture, LEVELS)]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md (CI ephemeral-Postgres for live DB ops)]

### Latest tech notes
- **Zod 4** (`^4.3.4`): use `z.coerce.number()/date()` for form-string inputs; `z.enum([...] as const)`; cross-field rules via `.refine`/`.superRefine`; surface field errors with `error.flatten().fieldErrors`. [Source: package.json; zod v4]
- **react-hook-form 7 + @hookform/resolvers 5**: `useForm({ resolver: zodResolver(schema) })`; map server `fieldErrors` back via `setError`. [Source: package.json; src/components/ui/form.tsx]
- **Next 16 server actions**: `"use server"` module; a server action can return a plain serializable result object consumed by the client form — no route handler needed. Guard (`requireAdmin`) runs server-side inside the action.

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6 (autopilot subagent, 2026-07-05)

### Debug Log References

- Build error 1: Turbopack rejected bare `throw;` in catch block (actions.ts:35) — fixed by removing the unnecessary try/catch wrapper around `requireAdmin()` (which throws NEXT_REDIRECT natively).
- TypeScript error 1: `zodResolver(createClassSchema)` inferred with schema INPUT type (`unknown` for z.coerce.date/number fields) incompatible with `useForm<CreateClassInput>` (OUTPUT type). Fixed by casting to `unknown as Resolver<CreateClassInput, any>` — runtime behavior is correct (zodResolver coerces and passes OUTPUT to onSubmit). Documented in decision log.

### Completion Notes List

- **Task 1**: Created `src/lib/class-constants.ts` (LEVELS + LevelValue) and `src/app/(admin)/admin/classes/new/class-form-schema.ts` (pure Zod 4 schema with z.coerce.date/number, cross-field refine/superRefine for end>start and IN_PERSON location; `toCents` helper for AD-9 Rand→cents). No db import — vitest-safe.
- **Task 2**: Created `src/app/(admin)/admin/classes/new/actions.ts` (`"use server"`) with `createClassAction(input: unknown)`: requireAdmin() first (AD-3), safeParse, subjectId re-check, toCents, db.groupSession.create with SCHEDULED status. Discriminated result shape `{ ok: true, id } | { ok: false, fieldErrors?, message? }`. No transaction (AD-16 scoped to edits), no occupancy counter (AD-5).
- **Task 3**: Created `page.tsx` (server component: requireAdmin + subject fetch + ClassForm render with serialisable props) and `class-form.tsx` (client: react-hook-form + zodResolver, all fields, conditional location/meetingUrl, gold CTA, ≥44px targets, inline + toast error feedback, router.push('/admin') on success per decision log).
- **Task 4**: 36 new vitest assertions in `tests/unit/class-form-schema.test.ts` covering every AC2 invalid case, happy paths, and toCents conversion (290→29000, 290.5→29050, etc.).
- **Task 5**: `npx prisma validate` ✓ (schema untouched), `npm run build` ✓ (tsc clean, `/admin/classes/new` appears in route table), `npm test` ✓ 119/119 (83 prior + 36 new). Live DB create deferred to CI ephemeral-Postgres.
- Post-create navigation set to `/admin` (fallback until Story 2.2 delivers `/admin/classes` list).

### File List

- `acce-nextjs/src/lib/class-constants.ts` — NEW: LEVELS constant + LevelValue type
- `acce-nextjs/src/app/(admin)/admin/classes/new/class-form-schema.ts` — NEW: pure Zod schema + toCents helper
- `acce-nextjs/src/app/(admin)/admin/classes/new/actions.ts` — NEW: createClassAction server action
- `acce-nextjs/src/app/(admin)/admin/classes/new/page.tsx` — NEW: server page (guard + subject fetch)
- `acce-nextjs/src/app/(admin)/admin/classes/new/class-form.tsx` — NEW: client form component
- `acce-nextjs/tests/unit/class-form-schema.test.ts` — NEW: 36 unit assertions on schema + toCents

## Change Log

- 2026-07-05: Story implemented (dev-story). Added LEVELS constant, pure Zod schema + toCents helper, createClassAction server action (requireAdmin guard, safeParse, subjectId re-check, priceCents conversion, groupSession.create), admin page + client form (react-hook-form + zodResolver, conditional fields, sonner toasts, gold CTA). 36 new vitest assertions. `prisma validate` + build + 119/119 tests all green. Status → review.
- 2026-07-06: Code review (fresh reasoning, adversarial). All 5 ACs + guardrails AD-2/3/5/9/13/16 independently verified. Confirmed: requireAdmin() runs first inside the action (AC4 trusted guard, before parse/write); discriminated `{ ok }` result never throws on the validation path (AC3); toCents integer-cents conversion is the single conversion site (AD-9); no seat counter (AD-5), no transaction/lock (AD-16 scoped to 2.3); datetime-local values are coerced to Date client-side by the resolver and round-trip to the server as correct absolute instants (no timezone drift). **1 MEDIUM finding auto-fixed:** the primary "Create class" CTA hardcoded `style={{ backgroundColor: "#d4a91e", color: "#1a2744" }}`, bypassing the mode-flipping `--accent`/`--accent-foreground` tokens the story mandated (UX-DR2/DR6, no-new-palette) — replaced with `bg-accent text-accent-foreground hover:bg-accent/90`. 0 HIGH/critical. Re-verified after fix: `prisma validate` clean, `npm run build` clean (`/admin/classes/new` present), 119/119 vitest green. Status → done. Live-DB create remains deferred to CI ephemeral-Postgres (same sandbox wall as 1.1/1.4/1.5).
