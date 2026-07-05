import { defineConfig, devices } from "@playwright/test";

/**
 * E2E smoke config. Builds the app and serves it in production mode, then runs the smoke
 * specs against it — so the suite also proves the app builds and that production-only
 * behavior (guide publish gating) is correct, not just dev.
 *
 * Story 1.5 additions:
 *   - `globalSetup` provisions per-role Playwright storageState files before specs run.
 *     When DATABASE_URL is unset (sandbox), it writes empty state files; authenticated
 *     specs detect this and skip gracefully. Live authenticated runs require CI + Postgres.
 *   - Port 3100 and `reuseExistingServer: false` are unchanged (memory: playwright-dedicated-port-gotcha).
 *
 * STANDALONE START NOTE (memory: acce-deploy-standalone-server):
 *   Production serve = `node .next/standalone/server.js` (via the Dockerfile CMD), NOT `next start`.
 *   `next start` warns "does not work with output: standalone" but still serves a prod build
 *   (the pages are built; the standalone SERVER is not used). For route-200 smoke assertions
 *   this is acceptable — the test verifies route behaviour, not the exact server binary.
 *   The Dockerfile CMD is already correct for production. Changing webServer.command to use
 *   `node .next/standalone/server.js -p 3100` is deferred (higher-touch, optional).
 */
export default defineConfig({
  testDir: "./tests/e2e",
  // Runs per-role session provisioning before specs start (Story 1.5 AC4).
  // Writes storageState JSON files to tests/e2e/.auth/ (gitignored).
  globalSetup: "./tests/e2e/global-setup.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  timeout: 30_000,
  use: {
    // Dedicated port so the suite never collides with (or reuses) a dev server on :3000.
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run build && npm run start -- -p 3100",
    url: "http://localhost:3100",
    // Always build + serve our own production server; don't attach to a foreign one.
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
