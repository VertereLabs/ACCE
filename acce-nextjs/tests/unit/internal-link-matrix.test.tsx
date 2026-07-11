import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import SubjectsPage from "@/app/subjects/page";
import AccountingTutorPage from "@/app/accounting-tutor/page";
import FinancialManagementTutorPage from "@/app/financial-management-tutor/page";
import TaxTutorPage from "@/app/tax-tutor/page";
import AuditingTutorPage from "@/app/auditing-tutor/page";
import CtaTutorPage from "@/app/cta-tutor/page";
import PgdaTutorPage from "@/app/pgda-tutor/page";

/**
 * Full internal-link matrix regression guard.
 *
 * The render-smoke.test.tsx asserts only ONE representative outbound edge per page,
 * which means a silently dropped edge stays green there. This file asserts the COMPLETE
 * required outbound edge set for every page in the hub-and-spoke matrix, making it a
 * durable regression contract.
 *
 * Required edges (source: page-catalog.md CAP-9):
 *   homepage (Services.tsx): 4 spokes + /cta-tutor + /pgda-tutor
 *   /subjects: 4 spokes + /cta-tutor + /pgda-tutor
 *   each spoke (/accounting-tutor, /financial-management-tutor, /tax-tutor, /auditing-tutor):
 *     /cta-tutor + /pgda-tutor + /subjects
 *   /cta-tutor: 4 spokes + /pgda-tutor
 *   /pgda-tutor: 4 spokes + /cta-tutor
 *
 * NOT asserted here:
 *   /accounting-tutor -> /guides/ifrs-15, /guides/ifrs-16
 *   (pending Epic 3 guide release, GUIDE_PUBLISH_STATUS: false; wired by Story 3.3)
 */

type PageSpec = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: () => any;
  edges: string[];
};

const MATRIX: PageSpec[] = [
  {
    name: "HomePage",
    Component: HomePage,
    edges: [
      "/accounting-tutor",
      "/financial-management-tutor",
      "/tax-tutor",
      "/auditing-tutor",
      "/cta-tutor",
      "/pgda-tutor",
    ],
  },
  {
    name: "SubjectsPage",
    Component: SubjectsPage,
    edges: [
      "/accounting-tutor",
      "/financial-management-tutor",
      "/tax-tutor",
      "/auditing-tutor",
      "/cta-tutor",
      "/pgda-tutor",
    ],
  },
  {
    name: "AccountingTutorPage",
    Component: AccountingTutorPage,
    edges: ["/cta-tutor", "/pgda-tutor", "/subjects"],
  },
  {
    name: "FinancialManagementTutorPage",
    Component: FinancialManagementTutorPage,
    edges: ["/cta-tutor", "/pgda-tutor", "/subjects"],
  },
  {
    name: "TaxTutorPage",
    Component: TaxTutorPage,
    edges: ["/cta-tutor", "/pgda-tutor", "/subjects"],
  },
  {
    name: "AuditingTutorPage",
    Component: AuditingTutorPage,
    edges: ["/cta-tutor", "/pgda-tutor", "/subjects"],
  },
  {
    name: "CtaTutorPage",
    Component: CtaTutorPage,
    edges: [
      "/accounting-tutor",
      "/financial-management-tutor",
      "/tax-tutor",
      "/auditing-tutor",
      "/pgda-tutor",
    ],
  },
  {
    name: "PgdaTutorPage",
    Component: PgdaTutorPage,
    edges: [
      "/accounting-tutor",
      "/financial-management-tutor",
      "/tax-tutor",
      "/auditing-tutor",
      "/cta-tutor",
    ],
  },
];

/**
 * Count outbound links to `href` that belong to the page BODY, excluding the shared
 * chrome (Navbar/Footer). Every page renders <Navbar/>, whose desktop nav always emits
 * a link to /subjects. Without this exclusion the spoke pages' required /subjects edge
 * would be satisfied by the Navbar even if the in-body cross-link were dropped, so a
 * regressed edge would stay green -- the exact failure mode this test exists to prevent.
 * Scoping to non-nav/non-footer anchors makes each assertion enforce the real matrix edge.
 */
function bodyEdgeCount(container: HTMLElement, href: string): number {
  return Array.from(container.querySelectorAll(`a[href="${href}"]`)).filter(
    (a) => !a.closest("nav") && !a.closest("footer"),
  ).length;
}

describe("internal link matrix", () => {
  for (const { name, Component, edges } of MATRIX) {
    it(`${name} contains all required outbound edges`, () => {
      const { container } = render(<Component />);
      for (const edge of edges) {
        expect(
          bodyEdgeCount(container, edge),
          `${name} must contain an in-body link to ${edge}`,
        ).toBeGreaterThan(0);
      }
    });
  }

  // Pending edge: /accounting-tutor -> IFRS guides (Epic 3 gate, GUIDE_PUBLISH_STATUS: false)
  // Wire by Story 3.3 when guide flags flip to true:
  //   add <Link href="/guides/ifrs-15" ...> + <Link href="/guides/ifrs-16" ...> to
  //   src/app/accounting-tutor/page.tsx and extend the AccountingTutorPage edges above.
  it.todo(
    "accounting-tutor links to relevant IFRS guides once Epic 3 releases them",
  );
});
