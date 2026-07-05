import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

// Treat ALL guides as published for sitemap tests — the sitemap should register
// every route when content is live. The guides-config.test.ts file separately
// covers the production-off (gated) behavior with its own targeted assertions.
vi.mock("@/config/guides", () => ({
  GUIDE_PUBLISH_STATUS: { groups: true, "ifrs-15": true, "ifrs-16": true },
  isDev: false,
  isGuidesPreview: false,
  isGuidePublished: () => true,
  anyGuidePublished: () => true,
}));

import sitemap from "@/app/sitemap";

/**
 * The sitemap is a hand-maintained list of routes (src/app/sitemap.ts). It's easy to add
 * a new guide page on disk and forget to register it — a silent SEO regression. These
 * tests keep the sitemap and the actual App Router pages in lockstep, in both directions.
 */
const APP_DIR = path.resolve(process.cwd(), "src/app");
const BASE_URL = "https://accetutors.co.za";

const entries = sitemap();
const routePaths = entries.map((e) => e.url.replace(BASE_URL, ""));
const routeSet = new Set(routePaths);

/** Map a sitemap route to the page.tsx that should render it. */
function routeToPageFile(route: string): string {
  const clean = route.replace(/^\/+|\/+$/g, ""); // trim leading/trailing slashes
  return clean === ""
    ? path.join(APP_DIR, "page.tsx")
    : path.join(APP_DIR, clean, "page.tsx");
}

/** Recursively collect every content route that has a page.tsx under src/app. */
function collectPageRoutes(dir: string, prefix = ""): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name === "page.tsx") {
      found.push(prefix === "" ? "/" : prefix);
    } else if (entry.isDirectory() && !entry.name.startsWith("api")) {
      found.push(...collectPageRoutes(path.join(dir, entry.name), `${prefix}/${entry.name}`));
    }
  }
  return found;
}

describe("sitemap integrity", () => {
  it("contains no duplicate routes", () => {
    expect(routeSet.size).toBe(routePaths.length);
  });

  it("includes the homepage and the guides index", () => {
    expect(routeSet.has("/")).toBe(true);
    expect(routeSet.has("/guides")).toBe(true);
  });

  it("registers all three guide series and their expected part counts", () => {
    const parts = (prefix: string) =>
      routePaths.filter((r) => r.startsWith(`${prefix}/part-`)).length;
    expect(parts("/guides/ifrs-16")).toBe(5);
    expect(parts("/guides/ifrs-15")).toBe(5);
    expect(parts("/guides/groups")).toBe(7);
  });

  it("assigns valid, depth-decreasing priorities", () => {
    for (const entry of entries) {
      expect(entry.priority).toBeGreaterThan(0);
      expect(entry.priority).toBeLessThanOrEqual(1);
    }
    const home = entries.find((e) => e.url === `${BASE_URL}/`);
    expect(home?.priority).toBe(1);
  });
});

describe("sitemap ↔ filesystem consistency", () => {
  it("every sitemap route resolves to a real page.tsx on disk", () => {
    const missing = routePaths.filter((route) => !existsSync(routeToPageFile(route)));
    expect(missing, `Sitemap routes with no page.tsx: ${missing.join(", ")}`).toEqual([]);
  });

  it("every content page.tsx on disk is registered in the sitemap", () => {
    const pageRoutes = collectPageRoutes(APP_DIR);
    // Exclude pages that are intentionally outside the marketing sitemap:
    //   - /not-found: 404 handler
    //   - /sign-in: app auth page (no SEO value, not a marketing page)
    //   - /(portal)/*: authenticated portal pages (session-gated, not indexable)
    //   - /(admin)/*: admin-only pages (role-gated, not indexable) — Story 1.3
    const SITEMAP_EXCLUDED = new Set([
      "/not-found",
      "/sign-in",
    ]);
    const contentRoutes = pageRoutes.filter(
      (r) =>
        !SITEMAP_EXCLUDED.has(r) &&
        !r.startsWith("/(portal)") &&
        !r.startsWith("/(admin)"),
    );
    const unregistered = contentRoutes.filter((r) => !routeSet.has(r));
    expect(
      unregistered,
      `Pages missing from sitemap.ts: ${unregistered.join(", ")}`,
    ).toEqual([]);
  });
});
