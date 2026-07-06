"use client";

// CreditWalletForm — Story 3.5 (Task 3, AC1, AC2, AC3, UX-DR5, UX-DR6, NFR10).
// Client island: react-hook-form + zodResolver for instant client-side validation.
// On submit calls creditWalletAction (server action); maps fieldErrors back to form.
// Sonner toasts for success (AC3/UX-DR5) and server/unexpected failures (AC2).
//
// Props: plain `{ studentId: string }` — serialisable (1.5 RSC-500 safe rule).
//
// UX: gold token CTA (bg-accent/text-accent-foreground — NOT hardcoded hex, 2.1 review lesson),
// ≥44px targets (NFR10), keyboard-operable + visible focus ring, aria-busy while pending.
// Label text carries state (UX-DR6). One gold CTA per view (UX-DR2).

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { creditWalletSchema, type CreditWalletInput } from "./credit-schema";
import { creditWalletAction } from "./actions";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CreditWalletFormProps {
  /** The target student's User.id — passed as a plain string prop (RSC-500 safe). */
  studentId: string;
}

// ---------------------------------------------------------------------------
// Type note (mirrors class-form.tsx)
// ---------------------------------------------------------------------------
// zodResolver(creditWalletSchema) is typed with the schema's INPUT type (unknown for
// z.coerce.number fields). Cast to OUTPUT type because zodResolver coerces at runtime
// and onSubmit receives fully-parsed values.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const typedResolver = zodResolver(creditWalletSchema) as unknown as Resolver<CreditWalletInput, any>;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CreditWalletForm({ studentId }: CreditWalletFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreditWalletInput>({
    resolver: typedResolver,
    defaultValues: {
      studentId,
      amountRand: undefined,
    } as Partial<CreditWalletInput>,
  });

  async function onSubmit(values: CreditWalletInput) {
    setIsSubmitting(true);
    try {
      const result = await creditWalletAction(values);

      if (!result.ok) {
        // Map server-side fieldErrors back onto the form for inline display (AC2).
        if (result.fieldErrors) {
          for (const [field, errors] of Object.entries(result.fieldErrors)) {
            if (errors && errors.length > 0) {
              form.setError(field as keyof CreditWalletInput, {
                type: "server",
                message: errors[0],
              });
            }
          }
        }
        toast.error(result.message ?? "Please fix the errors above.");
        return;
      }

      // AC3 + UX-DR5: success toast, reset the amount field, refresh so balance Card + ledger re-render.
      toast.success("Wallet credited");
      form.reset({ studentId, amountRand: undefined });
      router.refresh();
    } catch {
      // UX-DR5: canonical generic fallback wording (matches all other islands' catch blocks).
      toast.error("Something went wrong — please try again");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Credit wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            {/* Hidden studentId field — Zod validates it; not editable by admin UI */}
            <input type="hidden" {...form.register("studentId")} value={studentId} />

            {/* ── Amount (R) ─────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="amountRand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (R)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min={0}
                      placeholder="500"
                      className="min-h-[44px]"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Gold-token CTA (UX-DR2, UX-DR6; NOT hardcoded hex per 2.1 review) ──
                bg-accent / text-accent-foreground = gold+navy via CSS tokens so the
                pairing flips correctly in light / dark mode. */}
            <Button
              type="submit"
              className="w-full min-h-[44px] font-semibold bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "Crediting…" : "Credit wallet"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
