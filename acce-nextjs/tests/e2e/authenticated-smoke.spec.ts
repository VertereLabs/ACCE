/**
 * Authenticated route-200 smoke — Story 1.5 (AC2, AC3).
 *
 * This is the primary safety net for the RSC non-children-prop 500 trap
 * (global lessons-learned): a render-time 500 is invisible to `tsc` and unit
 * tests, but a route-200 e2e catches it where 314 green unit tests don't.
 *
 * What it tests:
 *   AC2 — Positive smoke: every guarded (portal) route returns 200 for a STUDENT,
 *          every (admin) route returns 200 for an ADMIN. Sessions come from the
 *          storageState files written by globalSetup (tests/e2e/global-setup.ts).
 *   AC3 — Negative smoke: proves the 200s above come from real sessions, not a
 *          disabled guard. An unauthenticated client hitting /portal is redirected
 *          to /sign-in. A STUDENT client hitting /admin is redirected to /portal.
 *
 * Sandbox / no-DB handling (AC5 deferred posture):
 *   When DATABASE_URL is unset, globalSetup writes EMPTY storageState files and
 *   the authenticated tests call `test.skip(!hasSession(...))` to skip gracefully.
 *   The negative/unauthenticated test (no DB needed) still runs in sandbox because
 *   the middleware only checks cookie PRESENCE — no DB lookup required.
 *   The live authenticated green run is deferred to CI + ephemeral Postgres
 *   (deferred-work.md:8). Do NOT stub 200s or disable guards to force a green.
 *
 * Manifest: tests/e2e/authenticated-routes.ts — add new routes there as epics land.
 */

import { expect, test } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

import { AUTHENTICATED_ROUTES } from "./authenticated-routes";

/** Absolute paths to the per-role storageState files (written by globalSetup). */
const STUDENT_STATE = path.join(__dirname, ".auth", "student.json");
const ADMIN_STATE = path.join(__dirname, ".auth", "admin.json");

/**
 * Returns true when the storageState file exists AND contains at least one cookie.
 * An empty state file (written by globalSetup when no DB) returns false → tests skip.
 */
function hasSession(stateFile: string): boolean {
  try {
    const state = JSON.parse(fs.readFileSync(stateFile, "utf-8")) as {
      cookies: unknown[];
    };
    return Array.isArray(state.cookies) && state.cookies.length > 0;
  } catch {
    return false;
  }
}

const studentRoutes = AUTHENTICATED_ROUTES.filter((r) => r.role === "STUDENT");
const adminRoutes = AUTHENTICATED_ROUTES.filter((r) => r.role === "ADMIN");

// ── AC2: Positive smoke — STUDENT routes must return 200 ─────────────────────
test.describe("authenticated STUDENT routes → 200 (AC2)", () => {
  // Override this describe block's context to carry the STUDENT session cookie.
  // storageState is written by globalSetup; if empty (no DB), each test below skips.
  test.use({ storageState: STUDENT_STATE });

  for (const route of studentRoutes) {
    test(`GET ${route.path} → 200 as STUDENT`, async ({ page }) => {
      test.skip(
        !hasSession(STUDENT_STATE),
        "No Postgres in sandbox — authenticated e2e deferred to CI (AC5)",
      );

      const response = await page.goto(route.path);

      expect(response, `No response for ${route.path}`).not.toBeNull();
      expect(
        response!.status(),
        `${route.path} must return 200 for a valid STUDENT session (not a redirect or 500)`,
      ).toBe(200);

      // AC2: "not a 3xx redirect to /sign-in". A failed guard issues redirect('/sign-in'),
      // a 307 that Playwright auto-follows to /sign-in — which ALSO returns 200. So status
      // alone is not enough; assert the final URL is still the guarded route (the session
      // was genuinely honoured, we were not bounced to sign-in).
      expect(
        new URL(page.url()).pathname,
        `${route.path} 200 must come from the route itself, not a redirect to /sign-in (broken/invalid STUDENT session)`,
      ).toBe(route.path);
    });
  }
});

// ── AC2: Positive smoke — ADMIN routes must return 200 ───────────────────────
test.describe("authenticated ADMIN routes → 200 (AC2)", () => {
  test.use({ storageState: ADMIN_STATE });

  for (const route of adminRoutes) {
    test(`GET ${route.path} → 200 as ADMIN`, async ({ page }) => {
      test.skip(
        !hasSession(ADMIN_STATE),
        "No Postgres in sandbox — authenticated e2e deferred to CI (AC5)",
      );

      const response = await page.goto(route.path);

      expect(response, `No response for ${route.path}`).not.toBeNull();
      expect(
        response!.status(),
        `${route.path} must return 200 for a valid ADMIN session (not a redirect or 500)`,
      ).toBe(200);

      // AC2: a STUDENT-role or broken ADMIN session would be redirected (requireAdmin →
      // /portal, or requireSession → /sign-in), both landing on a 200 page. Assert the
      // final URL is still the admin route to prove the 200 is the admin page itself.
      expect(
        new URL(page.url()).pathname,
        `${route.path} 200 must come from the admin route itself, not a redirect (broken/invalid ADMIN session)`,
      ).toBe(route.path);
    });
  }
});

// ── AC3: Negative smoke — guard is real, not bypassed ────────────────────────
// These tests prove the 200s above come from real sessions:
//   • An unauthenticated client is REDIRECTED, not served 200.
//   • A STUDENT cannot access admin routes (redirected to /portal).
//
// These tests do NOT require a Postgres connection:
//   • The unauthenticated test: the middleware checks cookie PRESENCE only (no DB).
//   • The STUDENT-hitting-admin test: uses the storageState but skips if no session.

test.describe("guard correctness — unauthenticated client → /sign-in (AC3)", () => {
  // No test.use({ storageState }) → fully unauthenticated context (default project).
  test("unauthenticated client hitting /portal is redirected to /sign-in", async ({
    page,
  }) => {
    // Navigate to /portal without any session cookie.
    // The middleware detects no better-auth cookie and redirects to /sign-in.
    // Playwright follows the redirect; we verify the final URL.
    await page.goto("/portal");

    expect(
      page.url(),
      "Unauthenticated client must end up at /sign-in, not /portal",
    ).toContain("/sign-in");
  });
});

test.describe(
  "guard correctness — STUDENT role cannot access /admin (AC3)",
  () => {
    test.use({ storageState: STUDENT_STATE });

    test(
      "STUDENT client hitting /admin is redirected to /portal (requireAdmin() fires)",
      async ({ page }) => {
        test.skip(
          !hasSession(STUDENT_STATE),
          "No Postgres in sandbox — deferred to CI (AC5)",
        );

        // Navigate to /admin as a STUDENT:
        //   1. Middleware: cookie present → passes through (coarse UX check only, AD-3).
        //   2. /admin page: requireAdmin() → role !== "ADMIN" → redirect("/portal").
        //   3. /portal page: requireSession() → valid session → 200.
        // Playwright follows all redirects; we verify final URL is /portal, NOT /admin.
        await page.goto("/admin");

        expect(
          page.url(),
          "STUDENT must be redirected to /portal, not served admin content",
        ).toContain("/portal");

        expect(
          page.url(),
          "Final URL must NOT be /admin — student was redirected away",
        ).not.toContain("/admin");
      },
    );
  },
);
