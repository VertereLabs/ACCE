// tests/integration/helpers.ts — Story 4.3 (AC4).
//
// Shared integration-test helpers. Mirrors the skip-gate pattern from
// tests/e2e/global-setup.ts (the established sandbox-vs-CI seam).
//
// CRITICAL: do NOT import @/lib/db here (it throws on missing DATABASE_URL).
// All db-dependent imports are done dynamically inside beforeAll in the spec,
// after the skip guard fires. This file is safe to import at module-load time
// regardless of whether DATABASE_URL is set.

/**
 * Returns true when a real Postgres is available (DATABASE_URL env is set).
 * Used with Vitest's `describe.skipIf(!hasDb())` to skip the entire integration
 * suite in the sandbox, matching the pattern in tests/e2e/global-setup.ts.
 */
export const hasDb = (): boolean => !!process.env.DATABASE_URL;
