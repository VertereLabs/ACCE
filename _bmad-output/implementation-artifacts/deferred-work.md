# Deferred Work

Real-but-not-actionable-now items surfaced during reviews. Each should be picked up in a later loop or explicitly closed.

## Deferred from: code review of story-1.1 (2026-07-05)

- **Partial unique index invisible to Prisma schema** — `LedgerEntry_enrollmentId_booking_charge_key` (AD-8, one BOOKING_CHARGE per enrollment) is hand-added SQL in migration `20260705203800_schema_deltas_spine`. Prisma cannot model partial-unique indexes, so every future `prisma migrate dev` shadow-DB compare will report it as drift and attempt to drop it. Future story authors must preserve it and reject any generated migration that drops it. (Inherent Prisma limitation; documented in schema + migration. Low.)
- **AC5 `migrate deploy` unproven by execution** — the new migration chain (init + schema_deltas_spine) was never run against a real Postgres (dev sandbox blocks prod-credential deploy). Verified statically only (prisma validate, line-by-line SQL review, prisma canonical-diff). Follow-up: add a CI job using an ephemeral Postgres (service container / testcontainers) that runs `prisma migrate deploy` on a fresh DB to prove the full chain applies cleanly before release. (Medium; environmental, not a code defect.)

## Deferred from: code review of story-1.3 (2026-07-05)

- **`priority` boolean prop warning on `next/image` in `Logo.tsx`** — React warns "Received `true` for a non-boolean attribute `priority`" during jsdom render tests (surfaces in `portal-nav.test.tsx` and pre-existing `render-smoke.test.tsx`). Pre-existing in `src/components/Logo.tsx` (not touched by 1.3); cosmetic test-env noise only — Next's real `<Image>` consumes `priority` correctly at build/runtime. Follow-up: when `Logo.tsx` is next touched, confirm the prop is passed to the real Next `Image` and not leaking to the DOM under the mock. (Low; pre-existing, not caused by this change.)

## Deferred from: code review of story-1.4 (2026-07-05)

- **`computeStart` comment vs UTC computation** — `acce-nextjs/prisma/seed-data.ts:132-138` computes class start times in UTC (09:00/14:00 UTC → 11:00/16:00 SAST) but the surrounding comments say "business hours, SAST". Times are still within business hours after the +2h UTC offset, so this is a doc-only mismatch with no behavioural impact. Follow-up: align the comment with the actual UTC basis (or convert to an explicit SAST offset) next time the seed is touched. (Low; cosmetic.)
- **Day-separation unit test can theoretically flake** — `acce-nextjs/tests/unit/seed-data.test.ts:172-178` calls `new Date()` twice and asserts an exact 3-day gap; a UTC-midnight straddle between the two `computeStart` calls could make the `toBe(3)` assertion flaky. Astronomically rare and product-irrelevant. Follow-up: derive both starts from a single injected base date to make it deterministic. (Low; test hygiene.)
