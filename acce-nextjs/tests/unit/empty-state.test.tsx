/**
 * Story 6.4 AC5 — EmptyState component jsdom render test.
 *
 * Mirrors the pattern from tests/unit/portal-nav.test.tsx.
 * next/link is already mocked to a plain <a> in tests/setup.ts.
 *
 * Tests:
 *   - Renders the required `message` prop.
 *   - Renders the optional `title` when provided; omits it otherwise.
 *   - Renders the CTA as a link when `action` is provided.
 *   - Omits the CTA when `action` is not provided.
 *   - CTA link has min-h-[44px] and focus-visible:ring classes (NFR10/UX-DR6).
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "@/components/ui/empty-state";

describe("EmptyState", () => {
  it("renders the required message", () => {
    render(<EmptyState message="No upcoming classes right now. Check back soon." />);
    expect(
      screen.getByText("No upcoming classes right now. Check back soon."),
    ).toBeInTheDocument();
  });

  it("renders the optional title when provided", () => {
    render(<EmptyState title="Nothing here" message="Some message." />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.getByText("Some message.")).toBeInTheDocument();
  });

  it("does NOT render a title element when title is omitted", () => {
    render(<EmptyState message="Some message." />);
    // Only the message paragraph should be present; no separate title.
    const allText = screen.queryByText("Nothing here");
    expect(allText).toBeNull();
  });

  it("renders the CTA as a link to action.href with action.label when action is given", () => {
    render(
      <EmptyState
        message="You haven't booked any upcoming classes yet."
        action={{ href: "/portal/classes", label: "Browse available classes" }}
      />,
    );
    const ctaLink = screen.getByRole("link", { name: "Browse available classes" });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute("href", "/portal/classes");
  });

  it("omits the CTA when action is not given", () => {
    render(<EmptyState message="No wallet activity yet." />);
    // No link should be rendered.
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("CTA carries min-h-[44px] class for touch target (NFR10)", () => {
    render(
      <EmptyState
        message="Test message."
        action={{ href: "/test", label: "Go somewhere" }}
      />,
    );
    const ctaLink = screen.getByRole("link", { name: "Go somewhere" });
    // The Button wrapper adds min-h-[44px] — the <a> rendered by next/link mock
    // inherits the className from the Button's asChild Slot pass-through.
    expect(ctaLink.className).toContain("min-h-[44px]");
  });

  it("CTA carries focus-visible:ring class for keyboard accessibility (NFR10/UX-DR6)", () => {
    render(
      <EmptyState
        message="Test message."
        action={{ href: "/test", label: "Go somewhere" }}
      />,
    );
    const ctaLink = screen.getByRole("link", { name: "Go somewhere" });
    // focus-visible:ring-2 is part of the Button's base class (cva) and our explicit
    // className — either form satisfies this check.
    expect(ctaLink.className).toContain("focus-visible:ring");
  });

  it("renders the message in a text-muted-foreground element", () => {
    render(<EmptyState message="Empty here." />);
    const msgEl = screen.getByText("Empty here.");
    expect(msgEl.className).toContain("text-muted-foreground");
  });
});
