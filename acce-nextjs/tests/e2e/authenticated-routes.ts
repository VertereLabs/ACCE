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
];
