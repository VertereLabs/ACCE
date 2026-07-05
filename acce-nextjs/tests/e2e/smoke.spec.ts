import { test, expect } from "@playwright/test";
import sitemap from "../../src/app/sitemap";

/**
 * Route-200 smoke: the single highest-value e2e for a content site. It caught nothing a
 * type-check would, but catches render-time 500s, broken imports, and build breakage that
 * green unit tests miss. Driven off the real sitemap so new routes are covered automatically.
 */
const BASE_URL = "https://accetutors.co.za";
const routes = sitemap().map((entry) => entry.url.replace(BASE_URL, ""));

test.describe("every sitemap route serves 200", () => {
  for (const route of routes) {
    test(`GET ${route}`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response, `no response for ${route}`).not.toBeNull();
      expect(response!.status(), `${route} should return 200`).toBe(200);
    });
  }
});

test("homepage renders and exposes the WhatsApp CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/ACCE Tutors/);
  await expect(
    page.locator('a[href="https://wa.me/27713255295"]').first(),
  ).toBeVisible();
});

test("guides index lists the series and gates them as Coming Soon in production", async ({
  page,
}) => {
  await page.goto("/guides");
  await expect(page.getByText("IFRS 16: Leases")).toBeVisible();
  await expect(page.getByText("Groups & Business Combinations")).toBeVisible();
  // All publish flags ship false → the index must show Coming Soon, not deep links.
  await expect(page.getByText("Coming Soon").first()).toBeVisible();
});

test("homepage Resources section agrees with the publish config", async ({ page }) => {
  await page.goto("/");
  const resources = page.locator("#resources");
  await expect(resources).toBeVisible();
  // Regression guard for the 2026-07-04 fix: no false "Available", no deep links while unpublished.
  await expect(resources.getByText("Available")).toHaveCount(0);
  await expect(resources.locator('a[href="/guides/groups"]')).toHaveCount(0);
});

test("unknown route serves the 404 page", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist");
  expect(response!.status()).toBe(404);
  await expect(page.getByText("404")).toBeVisible();
});
