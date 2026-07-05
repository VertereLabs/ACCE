import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import React from "react";

// Unmount React trees between tests so queries don't bleed across cases.
afterEach(() => {
  cleanup();
});

// Lightweight stand-ins for Next's Link/Image so components render as plain
// DOM in jsdom without pulling in the App Router runtime.
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: unknown }) =>
    React.createElement("a", { href: typeof href === "string" ? href : "#", ...props }, children),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: unknown; alt?: string }) =>
    React.createElement("img", {
      src: typeof src === "string" ? src : "",
      alt: alt ?? "",
      ...props,
    }),
}));
