import { defineConfig, devices } from "@playwright/test";

/**
 * E2E smoke config. Builds the app and serves it in production mode, then runs the smoke
 * specs against it — so the suite also proves the app builds and that production-only
 * behavior (guide publish gating) is correct, not just dev.
 */
export default defineConfig({
  testDir: "./tests/e2e",
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
