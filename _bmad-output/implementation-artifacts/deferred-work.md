# Deferred Work

Real-but-not-actionable-now items surfaced during reviews. Each should be picked up in a later loop or explicitly closed.

## Deferred from: code review of story-1.1 (2026-07-05)

- **Partial unique index invisible to Prisma schema** — `LedgerEntry_enrollmentId_booking_charge_key` (AD-8, one BOOKING_CHARGE per enrollment) is hand-added SQL in migration `20260705203800_schema_deltas_spine`. Prisma cannot model partial-unique indexes, so every future `prisma migrate dev` shadow-DB compare will report it as drift and attempt to drop it. Future story authors must preserve it and reject any generated migration that drops it. (Inherent Prisma limitation; documented in schema + migration. Low.)
- **AC5 `migrate deploy` unproven by execution** — the new migration chain (init + schema_deltas_spine) was never run against a real Postgres (dev sandbox blocks prod-credential deploy). Verified statically only (prisma validate, line-by-line SQL review, prisma canonical-diff). Follow-up: add a CI job using an ephemeral Postgres (service container / testcontainers) that runs `prisma migrate deploy` on a fresh DB to prove the full chain applies cleanly before release. (Medium; environmental, not a code defect.)

## Deferred from: code review of story-1.3 (2026-07-05)

- **`priority` boolean prop warning on `next/image` in `Logo.tsx`** — React warns "Received `true` for a non-boolean attribute `priority`" during jsdom render tests (surfaces in `portal-nav.test.tsx` and pre-existing `render-smoke.test.tsx`). Pre-existing in `src/components/Logo.tsx` (not touched by 1.3); cosmetic test-env noise only — Next's real `<Image>` consumes `priority` correctly at build/runtime. Follow-up: when `Logo.tsx` is next touched, confirm the prop is passed to the real Next `Image` and not leaking to the DOM under the mock. (Low; pre-existing, not caused by this change.)
