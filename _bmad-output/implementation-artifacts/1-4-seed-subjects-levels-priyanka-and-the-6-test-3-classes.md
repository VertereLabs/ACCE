---
baseline_commit: 52ab5a0a20e1f96d890c3c10f21cda224135a443
---

# Story 1.4: Seed subjects, levels, Priyanka and the 6 Test-3 classes

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Priyanka,
I want the database seeded with the real subjects, levels, my admin account, and the 6 Test-3 classes,
so that the portal shows real, sellable classes from day one.

## Context & current state (READ FIRST)

The data layer from Story 1.1 (`done`) is complete and migrated; auth (1.2) and role-guarded route groups (1.3) are `done`. **This story writes `prisma/seed.ts` — the file does not exist yet.** The `db:seed` plumbing is already wired and MUST NOT be re-created:

- `package.json` → `"db:seed": "tsx prisma/seed.ts"` and `"prisma": { "seed": "tsx prisma/seed.ts" }` already point at the file you are creating. **Do not change these scripts.** [Source: acce-nextjs/package.json:14-22]
- `tsx@^4.19.2` is already a devDependency (the runner for the seed). **No new runtime dependency is needed.** [Source: acce-nextjs/package.json:97]
- The Prisma singleton `src/lib/db.ts` exists and is the ONLY permitted `PrismaClient` (AD-2). It **throws at import** if `DATABASE_URL` is unset. [Source: acce-nextjs/src/lib/db.ts:8-11]
- Story 1.1 explicitly deferred seed content here: *"No `prisma/seed.ts` content — that is Story 1.4 (FR19). The `db:seed` script already points at `prisma/seed.ts`; leave the script, don't author the seed."* [Source: 1-1-database-prisma-foundation.md:117]

**This story = author an idempotent `prisma/seed.ts` that populates 4 subjects, 2 level constants, Priyanka as ADMIN, and 6 SCHEDULED GroupSession classes — reusing the existing singleton and schema, changing NO schema and NO migration.**

## Acceptance Criteria

**AC1 — Seed populates the required data (FR19).**
Given an empty database after migration,
When `prisma/seed.ts` runs,
Then the **4 subjects** exist with exactly these names: `Accounting`, `Management Accounting & Finance`, `Auditing`, `Tax`,
And the **2 levels** (`Undergrad`, `CTA/PGDA`) exist as canonical strings used on the seeded classes (Phase 1a has no `Level` table — level is a `String` tag on `GroupSession`; see Dev Notes),
And **Priyanka** exists as a `User` with `role = "ADMIN"` and `emailVerified = true`,
And the **6 Test-3 classes** exist as `SCHEDULED` `GroupSession` rows with the subject mix **2 Accounting, 2 Tax, 1 Auditing, 1 Management Accounting**, each 2 hours long, `priceCents = 29000` (R290), and `capacity` in the range 4–6.

**AC2 — Idempotent re-run.**
Given the seed has already been run once,
When it is run a second time,
Then it creates **no duplicate** subjects, levels, admin user, or classes (row counts are unchanged), and it does not throw.

**AC3 — Classes are genuinely upcoming and sellable.**
Given the seeded classes,
Then each `GroupSession` has `status = SCHEDULED`, `start` in the future (relative to seed run), `end = start + 2h`, a `subjectId` FK to the matching seeded `Subject`, a non-empty `title`, a `level` from the two canonical values, `mode = ONLINE` (default), and `meetingUrl` left null (MANUAL provider fills it later — do NOT invent a Meet link).

**AC4 — Chain stays green (no regressions).**
`npx prisma validate` passes, `npm run build` succeeds, and `npm test` (vitest) stays green **including a new unit test** that asserts the seed dataset shape (see Testing). No schema/migration files are modified by this story.

## Tasks / Subtasks

- [x] **Task 1 — Author `prisma/seed.ts` data constants (AC1, AC3).**
  - [x] Create `acce-nextjs/prisma/seed.ts`. Import the singleton with a **relative** path: `import { db } from "../src/lib/db";` (tsx does NOT resolve the `@/*` tsconfig alias — a bare `@/lib/db` import will fail). Do NOT `new PrismaClient()` (AD-2).
  - [x] Define exported pure constants so they can be unit-tested without a DB: `SUBJECTS = ["Accounting","Management Accounting & Finance","Auditing","Tax"]`, `LEVELS = ["Undergrad","CTA/PGDA"]`, and a `CLASSES` array of 6 entries (subject name, level, title, capacity 4–6, `priceCents: 29000`, an offset used to compute `start`). Extracted into `prisma/seed-data.ts` (pure, no Prisma import) so the unit test imports data without importing `db.ts` (which throws when `DATABASE_URL` is unset in the jsdom test env).
  - [x] Enforce the subject mix in `CLASSES`: 2 × Accounting, 2 × Tax, 1 × Auditing, 1 × Management Accounting & Finance.
  - [x] Compute `start` per class relative to `new Date()` (e.g. staggered a few days apart, business-hours time) and `end = start + 2h`. Rationale: classes must be **upcoming** so Epic-3 browse shows "real, sellable classes from day one". Do not hardcode fixed calendar dates.
- [x] **Task 2 — Idempotent writes via upsert (AC2).**
  - [x] Subjects: `db.subject.upsert({ where: { name }, create: { name }, update: {} })` (Subject.name is `@unique`). Capture returned ids to link classes.
  - [x] Priyanka (ADMIN): `db.user.upsert({ where: { email }, create: {...}, update: { role: "ADMIN" } })`. `User.email` is `@unique`. `User.id` has **no default** — supply an explicit stable id (e.g. `"seed-priyanka-admin"`). Set `name` (e.g. "Priyanka"), `emailVerified: true`, `role: "ADMIN"`. Email = `process.env.SEED_ADMIN_EMAIL ?? "priyankamikaya21@gmail.com"` (the address used across the UX contact blocks). Do NOT add a required env var — the fallback keeps it optional.
  - [x] Classes: give each seeded `GroupSession` a **deterministic explicit id** (e.g. `"seed-class-acc-1"`, `"seed-class-tax-2"`, …) and upsert by that id: `db.groupSession.upsert({ where: { id }, create: {...}, update: {...} })`. GroupSession has no natural unique key, so deterministic ids are the only non-destructive idempotency mechanism. **Never `deleteMany` then recreate** — that would wipe real enrollments/ledger in later runs.
  - [x] Set on each class: `subjectId` (from Task 2 subjects), `level`, `title`, `description` (optional short string ok), `start`, `end`, `capacity`, `priceCents: 29000`, `status: "SCHEDULED"` (or rely on the `@default(SCHEDULED)`), leave `mode` default (`ONLINE`), `meetingUrl: null`.
- [x] **Task 3 — Wrap and log (AC1, AC2).**
  - [x] Run writes inside `main()`; on completion `console.log` a one-line summary (counts). Ensure the process exits cleanly (`await`; disconnect the pool/client if the process hangs — `await db.$disconnect()` in a `finally`).
  - [x] Handle errors: `main().catch((e) => { console.error(e); process.exit(1); })`.
- [x] **Task 4 — Unit test the seed dataset (AC4, Testing).**
  - [x] Add `tests/unit/seed-data.test.ts` (vitest, jsdom) importing the **pure** `prisma/seed-data.ts` constants (NOT `seed.ts`, which imports `db.ts` and throws without `DATABASE_URL`). Assert: 4 subject names exactly; 2 level values; 6 classes; subject-mix counts (2/2/1/1); every class `priceCents === 29000`; every `capacity` in 4..6; every `level` ∈ LEVELS; deterministic ids are unique.
  - [x] Do NOT write a live-DB integration test here — there is no test Postgres in the vitest env (jsdom, no DB). Real-DB idempotency belongs to the deploy pipeline / a future integration suite (mirrors 1.1's deferred `migrate deploy` proof).
- [x] **Task 5 — Verify the chain (AC4).**
  - [x] `npx prisma validate` → passes (schema unchanged — no schema touched).
  - [x] `npm run build` → succeeds (tsc clean, Next.js 16.1.1 build green).
  - [x] `npm test` → vitest 78/78 green incl. 23 new seed-data tests.
  - [x] No reachable DATABASE_URL in sandbox; real-DB seed deferred to pipeline (NFR7: `db:seed` once on release, consistent with Story 1.1 `migrate deploy` posture).

## Dev Notes

### Architecture guardrails (from ARCHITECTURE-SPINE — binding)
- **AD-2 Single data gateway:** `src/lib/db.ts` is the ONLY `PrismaClient`. The seed imports `{ db }` from it (relative path from `prisma/`). Never instantiate a second client. The 1.1 grep rule (`grep -rn "new PrismaClient" src/` → only `db.ts`) is scoped to `src/`; keep `prisma/seed.ts` clean of `new PrismaClient` too. [Source: ARCHITECTURE-SPINE.md#AD-2; 1-1...md:97]
- **AD-9 Money is integer cents:** `priceCents = 29000` for R290. No floats, no decimals. [Source: ARCHITECTURE-SPINE.md; schema.prisma:124]
- **AD-5 Capacity is derived, never stored:** set only `capacity` (the cap). Do NOT add/seed any seat-counter or "seats left" value — live occupancy is counted from `Enrollment` via `@@index([groupSessionId, status])`. [Source: ARCHITECTURE-SPINE.md#AD-5; schema.prisma:157]
- **AD-13 Manual meeting link in 1a:** `meetingUrl` stays null at seed time; Priyanka pastes one Meet link per class later via admin. Do not fabricate URLs. [Source: ARCHITECTURE-SPINE.md#AD-13]
- **Seed ownership:** `Seed (FR19) | prisma/seed.ts | AD-2` — this file is the designated seed home. [Source: ARCHITECTURE-SPINE.md:293, :239]
- **Naming:** Prisma models PascalCase; enum values SCREAMING_SNAKE (`SCHEDULED`, `ONLINE`); domain ids normally `cuid()` but seed rows use **explicit deterministic ids** for idempotency. Better Auth `User` ids are plain strings with **no default** — you must supply one. [Source: schema.prisma:24, :115]

### Data model facts the seed depends on (from schema.prisma — verified)
- `Subject { id cuid, name @unique, sessions }` — upsert by `name`. [schema.prisma:96-101]
- `GroupSession { id cuid(default), subjectId→Subject, level String, title String, description String?, start DateTime, end DateTime, capacity Int, priceCents Int, mode Mode @default(ONLINE), location String?, meetingUrl String?, status GroupSessionStatus @default(SCHEDULED), createdAt, updatedAt }` — supply explicit `id`; `end = start + 2h`. [schema.prisma:114-132]
- `User { id String @id (NO default), name, email @unique, emailVerified Boolean @default(false), role String? @default("STUDENT"), ... }` — upsert by `email`; set `id`, `role:"ADMIN"`, `emailVerified:true`. Better Auth owns this table but a direct Prisma upsert of a pre-verified admin is fine (magic-link login will find her by email). [schema.prisma:23-42]
- Enums: `Mode = ONLINE|IN_PERSON`; `GroupSessionStatus = SCHEDULED|CANCELLED|COMPLETED`. [schema.prisma:103-112]
- Do NOT touch `Enrollment`, `LedgerEntry`, `Payment` — the seed creates none of these. Priyanka is an ADMIN, not a student; she has no enrollment/ledger rows.

### Running the seed (env + entrypoint)
- **Run via `npx prisma db seed`**, which loads `.env` before invoking `tsx prisma/seed.ts`. Running `npm run db:seed` (raw tsx) does NOT auto-load `.env`, and `db.ts` throws if `DATABASE_URL` is unset (there is no `dotenv` dep and adding one is out of scope). [Source: acce-nextjs/src/lib/db.ts:8-11; package.json:17,21]
- The deploy pipeline already expects `db:seed` once on release after `migrate deploy` (NFR7). This story provides the content that runs there. [Source: 1-1...md:75,127; ARCHITECTURE-SPINE.md:276]

### Scope decision — "levels exist" with no Level table
Phase 1a has **no `Level` model**; `GroupSession.level` is a `String` ("Level model arrives with 1b" — schema.prisma:119). Satisfy AC1's "levels exist" by defining `LEVELS = ["Undergrad","CTA/PGDA"]` as a seed constant and applying those exact strings to the seeded classes. **Do NOT add a Level table/migration** — 1.1 locked the 1a schema and deferred Level to 1b; re-migrating shared tables mid-sprint is the anti-pattern 1.1 called out. (Logged: autopilot-decisions.md, medium.)

### Do NOT do (out of scope for 1.4)
- No schema or migration changes (no new models, columns, enums, constraints).
- No `package.json` script changes; no new dependencies (tsx already present).
- No admin CRUD UI, no portal class-list UI (Epic 2/3), no enrollment/wallet/payment rows.
- No Meet-link generation; no email; no Paystack.
- No `deleteMany`/truncate-based reseeding (non-idempotent-safe, destructive).

### Previous story intelligence (1.1 → 1.3)
- 1.1 authored the full schema + the singleton and **explicitly reserved seed content for this story**; the `db:seed`/`prisma.seed` scripts and `tsx` are already in place. Reuse them. [Source: 1-1...md:117,27]
- 1.1 pattern: migrations/prod-DB ops are run by the pipeline, not the dev sandbox (prod creds blocked interactively). Expect the same here — static verification (`prisma validate`, `build`, vitest) is the sandbox bar; the real seed runs on release. [Source: 1-1...md:90,163]
- 1.2/1.3 configured Better Auth (magic-link + admin plugin); `role` is a plain string column defaulting to `STUDENT`. Seeding `role:"ADMIN"` directly is consistent with how the admin plugin reads it (`session.user.role`). [Source: acce-nextjs/src/lib/auth.ts:60-63]
- Git: recent epic-1 commits landed on branch `epic-1`; last work = 1.3 middleware cookie-prefix fix + a11y. Nothing conflicts with a new `prisma/seed.ts`.

### Testing standards
- Framework: **vitest** (jsdom), `npm test`; specs in `tests/unit/**`. Playwright e2e is separate (`tests/e2e`), not needed here. [Source: acce-nextjs/vitest.config.ts]
- The unit test asserts the **pure seed dataset** (counts, subject mix, price, capacity, level membership, id uniqueness) — importing `prisma/seed-data.ts`, NOT `seed.ts`/`db.ts` (which throw without `DATABASE_URL` in jsdom). This is why extracting the constants into a pure module is recommended.
- Do not mock PrismaClient to fake a live seed — over-mocking proves nothing. Real-DB idempotency is a pipeline/integration concern (documented, deferred — same posture as 1.1's `migrate deploy` proof).

### Project Structure Notes
- App root `acce-nextjs/`; alias `@/*` → `acce-nextjs/src/*` (Next/vitest only — NOT tsx, hence the relative import in seed.ts).
- New files: `acce-nextjs/prisma/seed.ts` (NEW), `acce-nextjs/prisma/seed-data.ts` (NEW, recommended), `acce-nextjs/tests/unit/seed-data.test.ts` (NEW). No UPDATE files expected beyond these; if you must touch anything else, justify it.

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.4 / Epic 1 / FR19]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md#AD-2, AD-5, AD-9, AD-13, "Structural Seed" seed.ts, "Deployment & Environment"]
- [Source: acce-nextjs/prisma/schema.prisma] · [Source: acce-nextjs/src/lib/db.ts] · [Source: acce-nextjs/package.json] · [Source: acce-nextjs/vitest.config.ts]
- [Source: _bmad-output/implementation-artifacts/1-1-database-prisma-foundation.md#Do NOT do / Files to touch / release strategy]
- Priyanka contact email `priyankamikaya21@gmail.com` [Source: _bmad-output/planning-artifacts/ux-designs/ux-ACCE-2026-07-05/EXPERIENCE.md:36]
- Global lessons: Prisma singleton rule; native fetch (no axios) — n/a to seed but keep in mind.

### Latest tech notes
- Prisma seeding runs through the `prisma db seed` command which reads the `prisma.seed` script and loads `.env` first — this is the env-safe entrypoint given `db.ts` throws on missing `DATABASE_URL`.
- `upsert` with an explicit `id` in `where` is the idiomatic Prisma idempotent-seed pattern for models without a natural unique business key. `update: {}` (empty) makes re-runs a no-op for already-present rows.

## Dev Agent Record

### Agent Model Used
claude-sonnet-4-6 (autopilot subagent, 2026-07-05)

### Debug Log References
None — implementation went cleanly; no debugging required.

### Completion Notes List
- Created `prisma/seed-data.ts` as a pure constants module (no Prisma/db import) containing `SUBJECTS`, `LEVELS`, `ADMIN_USER`, `CLASSES` (ClassDef[]), `computeStart`, and `computeEnd`. This separation was critical to allow jsdom unit testing without DATABASE_URL.
- Created `prisma/seed.ts` importing `{ db }` via relative path `../src/lib/db` (AD-2 compliant; tsx doesn't resolve `@/*` aliases). Uses `upsert` throughout: Subject by `name` (@unique), User by `email` (@unique), GroupSession by deterministic explicit id (no natural unique key on GroupSession). Never calls `new PrismaClient()`.
- 6 classes seeded with staggered future dates (7–19 days offset, 09:00 or 14:00 UTC), end = start + 2h. Correct subject mix: 2 × Accounting, 2 × Tax, 1 × Auditing, 1 × Management Accounting & Finance. All priceCents = 29000 (AD-9). Capacities 4–6. meetingUrl = null (AD-13).
- Created `tests/unit/seed-data.test.ts` with 23 assertions covering: subject count/names, level count/values, class count, subject-mix counts, priceCents, capacity range, level membership, id uniqueness, admin user fields, date helper correctness.
- All 78 tests pass (55 existing + 23 new). `npx prisma validate` clean. `npm run build` clean. `tsc --noEmit` clean.
- Live DB seed (`npx prisma db seed`) not run in sandbox — consistent with Story 1.1 posture (pipeline runs `migrate deploy` + `db:seed` on release per NFR7). No DATABASE_URL available in this sandbox environment.

### Change Log
- 2026-07-05: Created `acce-nextjs/prisma/seed-data.ts` (pure seed constants)
- 2026-07-05: Created `acce-nextjs/prisma/seed.ts` (idempotent seed entrypoint)
- 2026-07-05: Created `acce-nextjs/tests/unit/seed-data.test.ts` (23 unit assertions; 78/78 green)

### File List
- acce-nextjs/prisma/seed-data.ts (NEW)
- acce-nextjs/prisma/seed.ts (NEW)
- acce-nextjs/tests/unit/seed-data.test.ts (NEW)
- _bmad-output/implementation-artifacts/1-4-seed-subjects-levels-priyanka-and-the-6-test-3-classes.md (UPDATED)
- _bmad-output/implementation-artifacts/sprint-status.yaml (UPDATED)
- _bmad-output/implementation-artifacts/autopilot-decisions.md (UPDATED)
