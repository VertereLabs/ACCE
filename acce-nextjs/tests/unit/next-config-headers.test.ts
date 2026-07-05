/**
 * Story 1.5 AC1 / NFR11 — Deploy shell invariants: standalone output + security headers.
 *
 * Asserts that `next.config.ts`:
 *   1. Sets `output: 'standalone'` (NFR7 — Docker prod build).
 *   2. Has a catch-all `source: "/(.*)"` header rule containing all 5 security headers
 *      (NFR11 — CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy).
 *   3. Has NO portal/admin-specific header overrides — so portal and admin routes
 *      INHERIT the security headers from the catch-all rule (AD-1 additive isolation).
 *
 * WHY a unit test, not an e2e assertion:
 *   The e2e suite requires a running Postgres for the authenticated smoke (no sandbox DB).
 *   Importing `next.config.ts` is purely static — `import type { NextConfig }` is stripped
 *   at runtime; the `headers()` function is a plain async function returning a plain array.
 *   A vitest unit test is faster, dependency-free, and directly verifies the config object
 *   rather than the HTTP response (which depends on Next.js header injection middleware).
 *
 * Source: acce-nextjs/next.config.ts
 */

import { describe, expect, it } from "vitest";
// Relative path from tests/unit/ to the project root (acce-nextjs/)
import nextConfig from "../../next.config";

/** The 5 security headers NFR11 requires to be applied to all routes. */
const REQUIRED_SECURITY_HEADERS = [
  "Content-Security-Policy",
  "Referrer-Policy",
  "X-Frame-Options",
  "X-Content-Type-Options",
  "Strict-Transport-Security",
] as const;

describe("next.config.ts — deploy shell invariants (Story 1.5 AC1, NFR7, NFR11)", () => {
  it("sets output: 'standalone' for Docker standalone build (NFR7)", () => {
    expect(nextConfig.output).toBe("standalone");
  });

  it("headers() contains a /(.*)  catch-all rule with all 5 security headers (NFR11)", async () => {
    const rules = await nextConfig.headers!();
    const catchAll = rules.find((r) => r.source === "/(.*)");

    expect(
      catchAll,
      "Must have a /(.*)  catch-all header rule in next.config.ts headers()",
    ).toBeDefined();

    const headerKeys = catchAll!.headers.map((h) => h.key);

    for (const name of REQUIRED_SECURITY_HEADERS) {
      expect(
        headerKeys,
        `Security header "${name}" must be present in the /(.*)  catch-all rule`,
      ).toContain(name);
    }
  });

  it("portal and admin routes have no route-specific header overrides (they inherit /(.*) — AD-1)", async () => {
    // If there were a source matching /portal or /admin, those routes could have
    // DIFFERENT (potentially weaker) headers than the catch-all. The absence of such
    // overrides proves portal/admin inherit the full catch-all security header set.
    const rules = await nextConfig.headers!();
    const portalOrAdminOverrides = rules.filter(
      (r) => r.source.includes("portal") || r.source.includes("admin"),
    );
    expect(
      portalOrAdminOverrides,
      "No portal/admin-specific header rules should exist — they must inherit from /(.*)",
    ).toHaveLength(0);
  });

  it("Strict-Transport-Security value has max-age, includeSubDomains, and preload (NFR11)", async () => {
    const rules = await nextConfig.headers!();
    const catchAll = rules.find((r) => r.source === "/(.*)");
    const hsts = catchAll!.headers.find(
      (h) => h.key === "Strict-Transport-Security",
    );

    expect(hsts).toBeDefined();
    expect(hsts!.value).toContain("max-age=");
    expect(hsts!.value).toContain("includeSubDomains");
    expect(hsts!.value).toContain("preload");
  });

  it("Content-Security-Policy has frame-ancestors 'self' (clickjacking guard)", async () => {
    const rules = await nextConfig.headers!();
    const catchAll = rules.find((r) => r.source === "/(.*)");
    const csp = catchAll!.headers.find(
      (h) => h.key === "Content-Security-Policy",
    );

    expect(csp).toBeDefined();
    expect(csp!.value).toContain("frame-ancestors 'self'");
  });
});
