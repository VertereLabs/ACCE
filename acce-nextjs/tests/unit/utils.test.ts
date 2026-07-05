import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

/**
 * cn() is used on nearly every element. If tailwind-merge conflict resolution ever
 * regresses, class overrides silently break across the whole UI — cheap to guard.
 */
describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("drops falsy/conditional values", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("lets later Tailwind classes win over conflicting earlier ones", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-primary-foreground", "text-accent")).toBe("text-accent");
  });

  it("supports arrays and objects (clsx semantics)", () => {
    expect(cn(["a", "b"], { c: true, d: false })).toBe("a b c");
  });
});
