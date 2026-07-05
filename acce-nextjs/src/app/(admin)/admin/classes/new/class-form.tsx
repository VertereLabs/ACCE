"use client";

// ClassForm — Story 2.1 (Task 3, AC1, AC2, AC3).
// Client component: react-hook-form + zodResolver for instant client-side validation.
// On submit calls createClassAction (server action); maps fieldErrors back to form.
// Sonner toasts for success (AC3) and server/unexpected failures (AC2).
//
// UX: navy + gold token system (UX-DR2), ≥44px targets (NFR10), visible focus rings,
// ≥4.5:1 contrast. One gold-accent CTA. Conditional fields (location / Meet link).
// Post-create navigation: /admin (fallback until Story 2.2 ships /admin/classes).

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createClassSchema, type CreateClassInput } from "./class-form-schema";
import { createClassAction } from "./actions";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface Subject {
  id: string;
  name: string;
}

interface ClassFormProps {
  subjects: Subject[];
  levels: string[];
}

// ---------------------------------------------------------------------------
// Type note
// ---------------------------------------------------------------------------
// `zodResolver(createClassSchema)` is typed with the schema's INPUT type (which
// uses `unknown` for z.coerce.date/number fields). We cast it to the OUTPUT
// type (CreateClassInput) because zodResolver coerces correctly at runtime
// and onSubmit receives the fully-parsed values.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const typedResolver = zodResolver(createClassSchema) as unknown as Resolver<CreateClassInput, any>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert a Date or string (managed by react-hook-form) to "YYYY-MM-DDTHH:mm"
 * expected by a <input type="datetime-local">.
 */
function toDatetimeLocal(value: Date | string | null | undefined): string {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 16);
  return String(value).slice(0, 16);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ClassForm({ subjects, levels }: ClassFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateClassInput>({
    resolver: typedResolver,
    defaultValues: {
      subjectId: "",
      title: "",
      description: "",
      mode: "ONLINE",
      location: "",
      meetingUrl: "",
    } as Partial<CreateClassInput>,
  });

  const mode = form.watch("mode");

  async function onSubmit(values: CreateClassInput) {
    setIsSubmitting(true);
    try {
      const result = await createClassAction(values);

      if (!result.ok) {
        // Map server-side fieldErrors back onto the form for inline display (AC2).
        if (result.fieldErrors) {
          for (const [field, errors] of Object.entries(result.fieldErrors)) {
            if (errors && errors.length > 0) {
              form.setError(field as keyof CreateClassInput, {
                type: "server",
                message: errors[0],
              });
            }
          }
        }
        toast.error(result.message ?? "Please fix the errors above and try again.");
        return;
      }

      // AC3: success toast + navigate to admin dashboard (fallback until Story 2.2).
      toast.success("Class created successfully!");
      router.push("/admin");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            {/* ── Subject ──────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger className="min-h-[44px]">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Level ────────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger className="min-h-[44px]">
                        <SelectValue placeholder="Select a level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {levels.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Title ────────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. CTA Audit Bootcamp"
                      className="min-h-[44px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Description ──────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description{" "}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What will this class cover?"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Start ────────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      className="min-h-[44px]"
                      value={toDatetimeLocal(field.value)}
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

            {/* ── End ──────────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      className="min-h-[44px]"
                      value={toDatetimeLocal(field.value)}
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

            {/* ── Capacity ─────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      placeholder="6"
                      className="min-h-[44px]"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormDescription>4–6 recommended</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Per-seat price ────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="priceRand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Per-seat price (R)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="0.01"
                      placeholder="290"
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

            {/* ── Mode ─────────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mode</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? "ONLINE"}>
                    <FormControl>
                      <SelectTrigger className="min-h-[44px]">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ONLINE">Online</SelectItem>
                      <SelectItem value="IN_PERSON">In Person</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Location (shown for IN_PERSON) ────────────────────────── */}
            {mode === "IN_PERSON" && (
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Room 101, Building A"
                        className="min-h-[44px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* ── Meet link (shown for ONLINE) ──────────────────────────── */}
            {mode === "ONLINE" && (
              <FormField
                control={form.control}
                name="meetingUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Meet link{" "}
                      <span className="font-normal text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://meet.google.com/…"
                        className="min-h-[44px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      You can add or update this later (Story 2.3 edit).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* ── Submit CTA (gold accent, UX-DR2) ─────────────────────── */}
            <Button
              type="submit"
              className="w-full min-h-[44px] font-semibold"
              style={{ backgroundColor: "#d4a91e", color: "#1a2744" }}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "Creating…" : "Create class"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
