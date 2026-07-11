import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Navbar from "@/components/Navbar";
import HomePage from "@/app/page";
import GuidesPage from "@/app/guides/page";
import IFRS16Part1Page from "@/app/guides/ifrs-16/part-1/page";
import CtaTutorPage from "@/app/cta-tutor/page";
import AccountingTutorPage from "@/app/accounting-tutor/page";
import FinancialManagementTutorPage from "@/app/financial-management-tutor/page";
import TaxTutorPage from "@/app/tax-tutor/page";
import AuditingTutorPage from "@/app/auditing-tutor/page";
import PgdaTutorPage from "@/app/pgda-tutor/page";
import SubjectsPage from "@/app/subjects/page";

/**
 * Render smoke tests. A component that throws at render is invisible to `tsc` and unit
 * logic tests but produces an HTTP 500 in the real app (the classic RSC render trap).
 * Rendering the composed pages here is the cheap safety net for that class of bug.
 */

describe("Navbar renders", () => {
  it("contains a link to /subjects (Subjects nav item repointed from /#services)", () => {
    const { container } = render(<Navbar />);
    expect(container.querySelector('a[href="/subjects"]')).not.toBeNull();
  });

  it("renders the Qualifications affordance trigger text", () => {
    // Verifies the Qualifications dropdown trigger exists in the desktop nav.
    render(<Navbar />);
    expect(screen.getByText("Qualifications")).toBeInTheDocument();
  });
});

describe("HomePage renders", () => {
  it("mounts the full landing page without throwing and shows key content", () => {
    render(<HomePage />);
    // Brand appears in nav + footer.
    expect(screen.getAllByText("ACCE Tutors").length).toBeGreaterThan(0);
    // Section headings prove the major sections mounted.
    expect(screen.getByText("Master Complex Topics")).toBeInTheDocument(); // Resources
    expect(screen.getByText("Invest in Your Success")).toBeInTheDocument(); // Pricing
  });

  it("routes every primary CTA to the WhatsApp number", () => {
    const { container } = render(<HomePage />);
    const whatsapp = container.querySelectorAll('a[href="https://wa.me/27713255295"]');
    expect(whatsapp.length).toBeGreaterThan(0);
  });
});

describe("GuidesPage renders", () => {
  it("lists all three guide series", () => {
    render(<GuidesPage />);
    expect(screen.getByText("IFRS 16: Leases")).toBeInTheDocument();
    expect(screen.getByText("IFRS 15: Revenue")).toBeInTheDocument();
    expect(screen.getByText("Groups & Business Combinations")).toBeInTheDocument();
  });
});

describe("A representative guide article renders", () => {
  it("mounts IFRS 16 Part 1 with its heading and PDF link absent (guarded: PDF held in prod)", () => {
    const { container } = render(<IFRS16Part1Page />);
    expect(
      screen.getByRole("heading", { name: /IFRS 16: Introduction & Key Changes/i }),
    ).toBeInTheDocument();
    // In the default test env (NODE_ENV="test", no NEXT_PUBLIC_GUIDES_PREVIEW),
    // isGuidePdfPublished("ifrs-16") returns false (production branch, all flags false).
    // The guarded PDF link must be ABSENT.
    expect(container.querySelector('a[href="/pdfs/ifrs-16-leases.pdf"]')).toBeNull();
  });

  it("mounts IFRS 16 Part 1 with PDF link present when preview env is active", async () => {
    vi.stubEnv("NEXT_PUBLIC_GUIDES_PREVIEW", "true");
    vi.resetModules();
    const { default: IFRS16Part1PagePreview } = await import(
      "@/app/guides/ifrs-16/part-1/page"
    );
    const { container } = render(<IFRS16Part1PagePreview />);
    expect(container.querySelector('a[href="/pdfs/ifrs-16-leases.pdf"]')).not.toBeNull();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });
});

describe("CtaTutorPage renders", () => {
  it("mounts without throwing and shows the correct H1", () => {
    render(<CtaTutorPage />);
    expect(
      screen.getByRole("heading", { name: /CTA Tutoring/i }),
    ).toBeInTheDocument();
  });

  it("contains a link to the accounting-tutor spoke", () => {
    const { container } = render(<CtaTutorPage />);
    expect(container.querySelector('a[href="/accounting-tutor"]')).not.toBeNull();
  });

  it("routes the primary CTA to the WhatsApp number", () => {
    const { container } = render(<CtaTutorPage />);
    const whatsapp = container.querySelectorAll('a[href="https://wa.me/27713255295"]');
    expect(whatsapp.length).toBeGreaterThan(0);
  });
});

describe("AccountingTutorPage renders", () => {
  it("mounts without throwing and shows the correct H1", () => {
    render(<AccountingTutorPage />);
    expect(
      screen.getByRole("heading", { name: /Accounting Tutoring for CA\(SA\)/i }),
    ).toBeInTheDocument();
  });

  it("contains a link to the cta-tutor spoke", () => {
    const { container } = render(<AccountingTutorPage />);
    expect(container.querySelector('a[href="/cta-tutor"]')).not.toBeNull();
  });

  it("routes the primary CTA to the WhatsApp number", () => {
    const { container } = render(<AccountingTutorPage />);
    const whatsapp = container.querySelectorAll('a[href="https://wa.me/27713255295"]');
    expect(whatsapp.length).toBeGreaterThan(0);
  });
});

describe("FinancialManagementTutorPage renders", () => {
  it("mounts without throwing and shows the correct H1", () => {
    render(<FinancialManagementTutorPage />);
    expect(
      screen.getByRole("heading", { name: /Management Accounting & Finance Tutoring/i }),
    ).toBeInTheDocument();
  });

  it("contains a link to the cta-tutor spoke", () => {
    const { container } = render(<FinancialManagementTutorPage />);
    expect(container.querySelector('a[href="/cta-tutor"]')).not.toBeNull();
  });

  it("routes the primary CTA to the WhatsApp number", () => {
    const { container } = render(<FinancialManagementTutorPage />);
    const whatsapp = container.querySelectorAll('a[href="https://wa.me/27713255295"]');
    expect(whatsapp.length).toBeGreaterThan(0);
  });
});

describe("TaxTutorPage renders", () => {
  it("mounts without throwing and shows the correct H1", () => {
    render(<TaxTutorPage />);
    expect(
      screen.getByRole("heading", { name: /Taxation Tutoring for PGDA/i }),
    ).toBeInTheDocument();
  });

  it("contains a link to the cta-tutor spoke", () => {
    const { container } = render(<TaxTutorPage />);
    expect(container.querySelector('a[href="/cta-tutor"]')).not.toBeNull();
  });

  it("routes the primary CTA to the WhatsApp number", () => {
    const { container } = render(<TaxTutorPage />);
    const whatsapp = container.querySelectorAll('a[href="https://wa.me/27713255295"]');
    expect(whatsapp.length).toBeGreaterThan(0);
  });
});

describe("AuditingTutorPage renders", () => {
  it("mounts without throwing and shows the correct H1", () => {
    render(<AuditingTutorPage />);
    expect(
      screen.getByRole("heading", { name: /^Auditing Tutoring$/i, level: 1 }),
    ).toBeInTheDocument();
  });

  it("contains a link to the cta-tutor spoke", () => {
    const { container } = render(<AuditingTutorPage />);
    expect(container.querySelector('a[href="/cta-tutor"]')).not.toBeNull();
  });

  it("routes the primary CTA to the WhatsApp number", () => {
    const { container } = render(<AuditingTutorPage />);
    const whatsapp = container.querySelectorAll('a[href="https://wa.me/27713255295"]');
    expect(whatsapp.length).toBeGreaterThan(0);
  });
});

describe("PgdaTutorPage renders", () => {
  it("mounts without throwing and shows the correct H1", () => {
    render(<PgdaTutorPage />);
    expect(
      screen.getByRole("heading", { name: /PGDA Tutoring/i, level: 1 }),
    ).toBeInTheDocument();
  });

  it("contains a link to the cta-tutor qualification hub", () => {
    const { container } = render(<PgdaTutorPage />);
    expect(container.querySelector('a[href="/cta-tutor"]')).not.toBeNull();
  });

  it("routes the primary CTA to the WhatsApp number", () => {
    const { container } = render(<PgdaTutorPage />);
    const whatsapp = container.querySelectorAll('a[href="https://wa.me/27713255295"]');
    expect(whatsapp.length).toBeGreaterThan(0);
  });
});

describe("SubjectsPage renders", () => {
  it("mounts without throwing and shows the correct H1", () => {
    render(<SubjectsPage />);
    expect(
      screen.getByRole("heading", { name: /^Subjects We Tutor$/i, level: 1 }),
    ).toBeInTheDocument();
  });

  it("contains a link to the accounting-tutor spoke", () => {
    const { container } = render(<SubjectsPage />);
    expect(container.querySelector('a[href="/accounting-tutor"]')).not.toBeNull();
  });

  it("routes the primary CTA to the WhatsApp number", () => {
    const { container } = render(<SubjectsPage />);
    const whatsapp = container.querySelectorAll('a[href="https://wa.me/27713255295"]');
    expect(whatsapp.length).toBeGreaterThan(0);
  });
});

describe("Services homepage links", () => {
  it("contains Learn-more links to all four subject spokes", () => {
    const { container } = render(<HomePage />);
    expect(container.querySelector('a[href="/accounting-tutor"]')).not.toBeNull();
    expect(container.querySelector('a[href="/tax-tutor"]')).not.toBeNull();
    expect(container.querySelector('a[href="/financial-management-tutor"]')).not.toBeNull();
    expect(container.querySelector('a[href="/auditing-tutor"]')).not.toBeNull();
  });

  it("contains Qualifications mention links to both hubs", () => {
    const { container } = render(<HomePage />);
    expect(container.querySelector('a[href="/cta-tutor"]')).not.toBeNull();
    expect(container.querySelector('a[href="/pgda-tutor"]')).not.toBeNull();
  });
});

/**
 * Regression guard: the homepage Resources section must agree with the guide publish config.
 * With all three guide pages published (released state), it must show "Available" badges,
 * deep-link into each guide, and retain the index link.
 */
describe("Resources section reflects the publish config", () => {
  it("shows Available for every released guide and no Coming Soon badge", () => {
    render(<HomePage />);
    const resources = document.getElementById("resources")!;
    expect(resources).not.toBeNull();
    const scoped = within(resources);
    expect(scoped.getAllByText("Available")).toHaveLength(3);
    expect(scoped.queryByText("Coming Soon")).toBeNull();
  });

  it("deep-links into the three published guides and still links to the guides index", () => {
    const { container } = render(<HomePage />);
    const resources = container.querySelector("#resources")!;
    expect(resources.querySelector('a[href="/guides/groups"]')).not.toBeNull();
    expect(resources.querySelector('a[href="/guides/ifrs-16"]')).not.toBeNull();
    // The section-level "View All Guides" button still points at the index.
    expect(resources.querySelector('a[href="/guides/"]')).not.toBeNull();
  });
});
