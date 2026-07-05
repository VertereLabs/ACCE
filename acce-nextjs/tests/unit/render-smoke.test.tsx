import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import GuidesPage from "@/app/guides/page";
import IFRS16Part1Page from "@/app/guides/ifrs-16/part-1/page";

/**
 * Render smoke tests. A component that throws at render is invisible to `tsc` and unit
 * logic tests but produces an HTTP 500 in the real app (the classic RSC render trap).
 * Rendering the composed pages here is the cheap safety net for that class of bug.
 */
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
  it("mounts IFRS 16 Part 1 with its heading and PDF download", () => {
    const { container } = render(<IFRS16Part1Page />);
    expect(
      screen.getByRole("heading", { name: /IFRS 16: Introduction & Key Changes/i }),
    ).toBeInTheDocument();
    expect(container.querySelector('a[href="/pdfs/ifrs-16-leases.pdf"]')).not.toBeNull();
  });
});

/**
 * Regression guard for the fix applied on 2026-07-04: the homepage Resources section must
 * agree with the guide publish config. With all guides unpublished (shipped state), it must
 * show "Coming Soon", never a false "Available" badge, and must not deep-link into guides.
 */
describe("Resources section reflects the publish config", () => {
  it("shows Coming Soon for every guide and no false Available badge", () => {
    render(<HomePage />);
    const resources = document.getElementById("resources")!;
    expect(resources).not.toBeNull();
    const scoped = within(resources);
    expect(scoped.getAllByText("Coming Soon")).toHaveLength(3);
    expect(scoped.queryByText("Available")).toBeNull();
  });

  it("does not deep-link into unpublished guides, but still links to the guides index", () => {
    const { container } = render(<HomePage />);
    const resources = container.querySelector("#resources")!;
    expect(resources.querySelector('a[href="/guides/groups"]')).toBeNull();
    expect(resources.querySelector('a[href="/guides/ifrs-16"]')).toBeNull();
    // The section-level "View All Guides" button still points at the index.
    expect(resources.querySelector('a[href="/guides/"]')).not.toBeNull();
  });
});
