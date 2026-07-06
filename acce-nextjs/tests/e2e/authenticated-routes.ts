/**
 * Authenticated-route manifest — Story 1.5 (AC2).
 *
 * This manifest lists every guarded (portal)/(admin) route that EXISTS today,
 * with the role required to access it. The authenticated smoke suite
 * (authenticated-smoke.spec.ts) drives off this list — just as the public smoke
 * drives off the sitemap — so every guarded route is covered and new routes are
 * trivially added.
 *
 * WHY a manifest (not the sitemap):
 *   Portal/admin routes are intentionally EXCLUDED from `src/app/sitemap.ts`
 *   (Story 1.3 — they must not be indexed by search engines). The public smoke
 *   drives off the sitemap, so it cannot reach these routes. This manifest is
 *   their dedicated coverage source.
 *
 * HOW TO ADD ROUTES (future epics):
 *   Append one entry per new (portal) or (admin) page below.
 *   Examples from ARCHITECTURE-SPINE source tree:
 *     { path: '/portal/classes',       role: 'STUDENT' },
 *     { path: '/portal/my-classes',    role: 'STUDENT' },
 *     { path: '/portal/wallet',        role: 'STUDENT' },
 *     { path: '/admin/classes',        role: 'ADMIN'   },
 *   Dynamic-segment routes (e.g. /portal/classes/[id]) should use a real,
 *   seeded ID in the e2e manifest (or be added to a separate parametrised spec).
 *
 * Source: (portal)/portal/page.tsx (Story 1.2), (admin)/admin/page.tsx (Story 1.3).
 */

export type AuthenticatedRole = "STUDENT" | "ADMIN";

export interface AuthenticatedRoute {
  /** URL path as served by the app (route-group folders are URL-invisible). */
  path: string;
  /** Role required to access this route without being redirected. */
  role: AuthenticatedRole;
}

/**
 * Guarded routes that exist today (after Epic 1, Stories 1.2 + 1.3).
 * Extend this array as each epic adds new authenticated pages.
 */
export const AUTHENTICATED_ROUTES: AuthenticatedRoute[] = [
  // (portal) routes — require a valid session (any role)
  { path: "/portal", role: "STUDENT" },

  // (admin) routes — require role === "ADMIN"
  { path: "/admin", role: "ADMIN" },
  // Story 2.1 backfill — create form was shipped without a manifest entry.
  { path: "/admin/classes/new", role: "ADMIN" },
  // Story 2.2 — read-only admin classes index (RSC-500 smoke guard, 1.5 pattern).
  { path: "/admin/classes", role: "ADMIN" },
  // Story 2.3 — dynamic edit route (uses deterministic seeded id seed-class-acc-1).
  // Dynamic routes use a real seeded id so the RSC-500 smoke covers the route.
  // Live authenticated run is DB-bound → deferred to CI ephemeral-Postgres (same wall as 2.1/2.2).
  { path: "/admin/classes/seed-class-acc-1/edit", role: "ADMIN" },
  // Story 3.1 — read-only student wallet page (RSC-500 smoke guard, 1.5 pattern).
  // Live authenticated run is DB-bound → deferred to CI ephemeral-Postgres.
  { path: "/portal/wallet", role: "STUDENT" },
  // Story 3.2 — read-only student classes browse page (RSC-500 smoke guard, 1.5 pattern).
  // Only the static listing route is added here; the dynamic /portal/classes/[id] detail
  // route belongs to Story 3.3 (mirrors 2.2 leaving the edit route to 2.3).
  // Live authenticated run is DB-bound → deferred to CI ephemeral-Postgres.
  { path: "/portal/classes", role: "STUDENT" },
  // Story 3.3 — dynamic class detail + checkout page (uses deterministic seeded id seed-class-acc-1).
  // Mirrors 2.3's /admin/classes/seed-class-acc-1/edit dynamic-route manifest entry.
  // Live authenticated run is DB-bound → deferred to CI ephemeral-Postgres.
  { path: "/portal/classes/seed-class-acc-1", role: "STUDENT" },
  // Story 3.5 — read-only admin students index (RSC-500 smoke guard, 1.5 pattern).
  // Renders empty-state on a fresh seed (no seeded student — ADMIN_USER only in 1.4).
  // The dynamic /admin/students/[id] route has no deterministic seeded student id to pin
  // (unlike seed-class-acc-1 for 2.3/3.3) — live run deferred to CI ephemeral-Postgres.
  { path: "/admin/students", role: "ADMIN" },
  // Story 5.1 — read-only student my-classes page (RSC-500 smoke guard, 1.5 pattern).
  // Static route; mirrors the 3.1 /portal/wallet entry.
  // Renders empty-state on a fresh seed (no seeded student / no enrollments).
  // Live authenticated+populated-list run deferred to CI ephemeral-Postgres.
  { path: "/portal/my-classes", role: "STUDENT" },
  // Story 6.1 — dynamic admin class roster page (uses deterministic seeded id seed-class-acc-1).
  // Mirrors 2.3's /admin/classes/seed-class-acc-1/edit dynamic-route manifest entry.
  // Renders empty-state on a fresh seed (seed has ADMIN only — no enrollments).
  // Live authenticated+populated-roster run deferred to CI ephemeral-Postgres.
  { path: "/admin/classes/seed-class-acc-1", role: "ADMIN" },
];
