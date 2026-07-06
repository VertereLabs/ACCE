"use client";

// EditClassForm — Story 2.3 (Task 4, AC1, AC3, AC4).
// Client island: react-hook-form + zodResolver for instant validation.
// Pre-filled from the server-rendered row values.
// On submit calls updateClassAction (server action).
//
// AC4: carries id + expectedUpdatedAt; on stale-token rejection shows a clear toast.
// UX: gold-accent CTA via design tokens (UX-DR2/DR6); ≥44px targets; focus rings; NFR10.
// Form label "Save changes"; single dominant gold CTA per view.

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

import { editClassSchema, type EditClassInput } from "./edit-class-schema";
import { updateClassAction } from "./actions";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface Subject {
  id: string;
  name: string;
}

interface EditClassFormProps {
  subjects: Subject[];
  levels: string[];
  initialValues: {
    id: string;
    subjectId: string;
    level: string;
    title: string;
    description: string;
    start: string; // "YYYY-MM-DDTHH:mm"
    end: string;   // "YYYY-MM-DDTHH:mm"
    capacity: number;
    priceRand: number;
    mode: "ONLINE" | "IN_PERSON";
    location: string;
    meetingUrl: string;
    expectedUpdatedAt: string; // ISO string — AC4 optimistic-concurrency token
  };
}

// ---------------------------------------------------------------------------
// Type note
// ---------------------------------------------------------------------------
// `zodResolver(editClassSchema)` is typed with the schema's INPUT type (which
// uses `unknown` for z.coerce.date/number fields). We cast to the OUTPUT type
// (EditClassInput) because zodResolver coerces correctly at runtime and
// onSubmit receives the fully-parsed values.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const typedResolver = zodResolver(editClassSchema) as unknown as Resolver<EditClassInput, any>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert a Date, string, or number (managed by react-hook-form) to
 * "YYYY-MM-DDTHH:mm" expected by <input type="datetime-local">.
 */
function toDatetimeLocal(value: Date | string | number | null | undefined): string {
  if (!value && value !== 0) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 16);
  return String(value).slice(0, 16);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EditClassForm({
  subjects,
  levels,
  initialValues,
}: EditClassFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditClassInput>({
    resolver: typedResolver,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: {
      id: initialValues.id,
      expectedUpdatedAt: initialValues.expectedUpdatedAt,
      subjectId: initialValues.subjectId,
      level: initialValues.level as EditClassInput["level"],
      title: initialValues.title,
      description: initialValues.description,
      // start/end are strings (datetime-local format) at default-values time;
      // zodResolver coerces them to Date on validate/submit (same pattern as create form).
      start: initialValues.start,
      end: initialValues.end,
      capacity: initialValues.capacity,
      priceRand: initialValues.priceRand,
      mode: initialValues.mode,
      location: initialValues.location,
      meetingUrl: initialValues.meetingUrl,
    } as unknown as Partial<EditClassInput>,
  });

  const mode = form.watch("mode");

  async function onSubmit(values: EditClassInput) {
    setIsSubmitting(true);
    try {
      const result = await updateClassAction(values);

      if (!result.ok) {
        // Map server-side fieldErrors back onto the form for inline display.
        if (result.fieldErrors) {
          for (const [field, errors] of Object.entries(result.fieldErrors)) {
            if (errors && errors.length > 0) {
              form.setError(field as keyof EditClassInput, {
                type: "server",
                message: errors[0],
              });
            }
          }
        }
        // AC4: show a clear, actionable message for stale-edit rejection.
        toast.error(result.message ?? "Please fix the errors above and try again.");
        return;
      }

      // Success: AC1 toast + navigate back to the class list.
      toast.success("Class updated successfully!");
      router.push("/admin/classes");
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
                  <FormDescription>
                    Price edits do not affect existing enrollments (immutable per-seat snapshot).
                  </FormDescription>
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

            {/* ── Meet link (shown for ONLINE) — AD-13: first-class editable ── */}
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
                      Paste or update the Google Meet link. Leave blank to clear it.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* ── Submit CTA (gold accent via design tokens, UX-DR2/DR6) ─
                Uses --accent / --accent-foreground so the gold + navy pairing
                flips correctly between light and dark modes (no hardcoded hex). */}
            <Button
              type="submit"
              className="w-full min-h-[44px] font-semibold bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
