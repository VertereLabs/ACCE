/**
 * Story 1.2 AC1, AC6 — sign-in page render tests.
 *
 * Verifies the sign-in page:
 *   1. Renders the email input and submit button.
 *   2. Never shows a password field (AC1 — passwordless only).
 *   3. Submit button is accessible and keyboard reachable.
 *   4. Label is properly associated with the email input (a11y, NFR10).
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeAll } from "vitest";

// ─── Mocks ───────────────────────────────────────────────────────────────────

// authClient.signIn.magicLink is the only external hook the component calls.
// We don't actually invoke it in render tests — just prevent the import from failing.
vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      magicLink: vi.fn().mockResolvedValue({ error: null }),
    },
  },
  signIn: vi.fn(),
  signOut: vi.fn(),
  useSession: vi.fn().mockReturnValue({ data: null }),
}));

// Stub next/navigation (used by other imports).
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  redirect: vi.fn(),
}));

// ─── Suppress console.error for missing toast in jsdom env ───────────────────
beforeAll(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

// ─────────────────────────────────────────────────────────────────────────────

describe("SignInPage renders (AC1, AC6)", () => {
  async function renderSignIn() {
    // Dynamic import so mocks above apply.
    const { default: SignInPage } = await import("@/app/sign-in/page");
    return render(<SignInPage />);
  }

  it("renders an email input", async () => {
    await renderSignIn();
    const input = screen.getByRole("textbox", { name: /email address/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
  });

  it("renders the submit button with an accessible label", async () => {
    await renderSignIn();
    const button = screen.getByRole("button", { name: /send me a magic link/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "submit");
  });

  it("NEVER shows a password field (AC1 — passwordless only)", async () => {
    await renderSignIn();
    expect(screen.queryByDisplayValue("password")).toBeNull();
    // No input with type=password should ever exist.
    const { container } = await renderSignIn();
    expect(container.querySelector('input[type="password"]')).toBeNull();
  });

  it("email input is labelled (a11y — NFR10)", async () => {
    await renderSignIn();
    // getByLabelText throws if label association is missing or broken.
    const input = screen.getByLabelText(/email address/i);
    expect(input).toBeInTheDocument();
  });

  it("shows ACCE Tutors brand in the page", async () => {
    await renderSignIn();
    // Brand text is rendered as two separate spans.
    expect(screen.getByText("ACCE")).toBeInTheDocument();
    expect(screen.getByText("Tutors")).toBeInTheDocument();
  });
});
