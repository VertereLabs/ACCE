// empty-state.tsx — Story 6.4 (Task 1, AC2, AC4, UX-DR4, NFR10).
// Shared Server Component for empty list states across portal and admin.
//
// ONE canonical shell: Card + CardContent with centred flex layout.
// Copy (message, optional title) is page-specific; the shell is shared.
//
// RSC-500 safety (1.5 lesson): `action` is plain data { href, label } — NEVER
// a Client Component element through a non-children prop. The CTA is rendered
// as Button asChild wrapping a next/link INSIDE this Server Component.
//
// UX-DR2: gold CTA accent only when the empty state IS the primary call-to-action
// (e.g. admin "Create a class"). Subordinate navigational links use the default
// Button variant. Prop-level control via `action` being present or absent.
//
// NFR10 / UX-DR6: CTA has min-h-[44px] touch target, focus-visible ring using
// --ring token, text label carries intent, token colours (no hardcoded hex).
//
// A11y: no nested <main> — the parent layout owns the single landmark.

import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface EmptyStateProps {
  /** Optional heading rendered above the message. */
  title?: string;
  /** Required body copy — page-specific, rendered in text-muted-foreground. */
  message: string;
  /**
   * Optional call-to-action. Plain data — never a JSX element (RSC-500 safe).
   * When present, renders a Button wrapping a next/link.
   * Use accent (gold) styling only when this IS the primary action on the view.
   */
  action?: {
    href: string;
    label: string;
    /** Use gold accent CTA when true; default subordinate link otherwise. */
    accent?: boolean;
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        {/* Optional title */}
        {title && <p className="font-semibold">{title}</p>}

        {/* Body copy — page-specific */}
        <p className="text-muted-foreground">{message}</p>

        {/* CTA — optional; rendered as Button asChild wrapping next/link (RSC-500 safe) */}
        {action && (
          <Button
            asChild
            className={[
              "min-h-[44px]",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              action.accent
                ? "bg-accent text-accent-foreground hover:bg-accent/90"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <Link href={action.href}>{action.label}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
