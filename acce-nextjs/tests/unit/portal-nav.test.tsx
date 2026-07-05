/**
 * Story 1.3 AC4 — portal shell nav render smoke test.
 *
 * Per the testing standards: server-component async layouts are awkward to unit-test
 * directly. Instead we test the PortalNav shell component:
 *   - Logo, ThemeToggle, and SignOutButton are present.
 *   - Logo links to /portal.
 *   - No marketing-only or admin-exclusive content leaks into the portal shell.
 *   - All interactive controls have accessible labels (a11y floor NFR10).
 *
 * The authenticated-route-200 Playwright smoke (which exercises the real guard chain)
 * is Story 1.5. This is the cheap render-level guard against RSC-500 class bugs.
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PortalNav } from "@/app/(portal)/portal-nav";

// SignOutButton uses useRouter (App Router hook). Stub it so the render
// does not throw in the jsdom test environment.
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
}));

// next-themes useTheme stub so Logo and ThemeToggle don't throw in jsdom.
vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "dark", setTheme: vi.fn() }),
}));

// authClient signOut stub so SignOutButton does not try to call auth.
vi.mock("@/lib/auth-client", () => ({
  signOut: vi.fn().mockResolvedValue(undefined),
  authClient: {
    signIn: {},
    signOut: vi.fn().mockResolvedValue(undefined),
    useSession: vi.fn().mockReturnValue({ data: null }),
  },
}));

describe("PortalNav shell renders without throwing", () => {
  it("mounts the portal nav without errors", () => {
    expect(() => render(<PortalNav />)).not.toThrow();
  });

  it("renders the logo linking to /portal", () => {
    render(<PortalNav />);
    // The Logo is wrapped in a Link pointing to /portal.
    const logoLink = screen.getByRole("link", { name: /ACCE Tutors.*portal home/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/portal");
  });

  it("renders a sign-out control", () => {
    render(<PortalNav />);
    // SignOutButton renders a button with text "Sign out".
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
  });

  it("renders the theme toggle button with an accessible label", () => {
    render(<PortalNav />);
    // ThemeToggle renders a button. In unmounted state it shows "Toggle theme";
    // after mount it shows "Switch to <target> mode". Either is valid here.
    const themeBtn = screen.getByRole("button", { name: /toggle theme|switch to/i });
    expect(themeBtn).toBeInTheDocument();
  });

  it("does not render marketing-only content (WhatsApp CTA, hero text)", () => {
    render(<PortalNav />);
    // The marketing Navbar has WhatsApp CTA text; the portal shell must not.
    expect(screen.queryByText(/book a session/i)).toBeNull();
    expect(screen.queryByText(/wa\.me/i)).toBeNull();
  });

  it("does not render admin-exclusive content", () => {
    render(<PortalNav />);
    // Admin badge/breadcrumb is Epic 2+ scope — not in the base portal nav.
    expect(screen.queryByText(/^Admin$/i)).toBeNull();
  });
});
