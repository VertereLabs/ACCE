// vitest.integration.config.ts — Story 4.3 (AC4).
//
// Node-environment Vitest project scoped to tests/integration/** only.
// This config is invoked via `npm run test:integration` (a separate npm script);
// the default `vitest run` (`npm test`) uses vitest.config.ts (jsdom + tests/unit/**)
// and is NOT affected by this file.
//
// Key differences from vitest.config.ts:
//   - environment: "node"   — no jsdom, no React mocks, no tests/setup.ts
//   - include: integration  — tests/integration/**/*.{test,spec}.ts only
//   - longer timeouts       — real DB transactions + retry/backoff > unit test budget
//
// AD-13: no new runtime dependency — uses existing vitest, @prisma/adapter-pg, pg.

import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    // No setupFiles — tests/setup.ts mocks next/link and next/image for jsdom;
    // it is irrelevant and wrong for node-environment integration tests.
    include: ["tests/integration/**/*.{test,spec}.ts"],
    globals: true,
    hookTimeout: 30000, // real Postgres tx + retry/backoff can take time
    testTimeout: 30000,
  },
});
