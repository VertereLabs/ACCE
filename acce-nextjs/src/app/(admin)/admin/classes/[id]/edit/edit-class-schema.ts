// Pure Zod schema for "edit group class" form — no db/Prisma import (Story 2.3 Task 1).
// Importable by vitest/jsdom WITHOUT a DATABASE_URL being set.
//
// Strategy: field block duplicated from createClassSchema rather than extracting a
// shared ZodEffects base (the create schema's .refine().superRefine() produces a
// ZodEffects which cannot be .extend()-ed cleanly — duplication is the story-approved path).
//
// Key additions vs createClassSchema:
//   - `id` — the GroupSession being edited (non-empty string)
//   - `expectedUpdatedAt` — ISO datetime string for AC4 optimistic-concurrency check
//   - `meetingUrl` — first-class editable + clearable (AD-13: this is the "paste it later" story)
//
// AD-9: toCents re-exported from create schema — NO second conversion site.

import { z } from "zod";
import { LEVELS } from "@/lib/class-constants";

// Re-export toCents from the create schema module — AD-9 single conversion site.
export { toCents } from "@/app/(admin)/admin/classes/new/class-form-schema";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

export const editClassSchema = z
  .object({
    // ── Identity / concurrency ──────────────────────────────────────────────
    id: z.string().min(1, "Class id is required"),

    // ISO string carried from the server-rendered row's updatedAt.toISOString().
    // Used server-side for the AC4 optimistic-concurrency check (compare to DB value).
    expectedUpdatedAt: z.string().min(1, "Concurrency token is required"),

    // ── Fields — same shape as createClassSchema ────────────────────────────
    subjectId: z
      .string()
      .min(1, "Subject is required"),

    level: z.enum(LEVELS, {
      error: () => ({ message: "Level is required" }),
    }),

    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(200, "Title must be 200 characters or fewer"),

    description: z.string().trim().optional(),

    start: z.coerce.date({
      error: () => ({ message: "Start date/time is required" }),
    }),

    end: z.coerce.date({
      error: () => ({ message: "End date/time is required" }),
    }),

    capacity: z
      .coerce
      .number({ error: () => ({ message: "Capacity must be a number" }) })
      .int("Capacity must be a whole number")
      .min(1, "Capacity must be at least 1"),

    priceRand: z
      .coerce
      .number({ error: () => ({ message: "Price must be a number" }) })
      .positive("Price must be greater than 0"),

    mode: z.enum(["ONLINE", "IN_PERSON"], {
      error: () => ({ message: "Mode is required" }),
    }),

    // meetingUrl: first-class editable in edit (AD-13 — this is where Priyanka pastes it).
    // Allow set/replace AND clearing (empty string → stored null).
    // Same optional-URL validation as create; empty string passes (treated as "clear").
    meetingUrl: z
      .string()
      .trim()
      .optional()
      .refine(
        (v) => !v || /^https?:\/\/.+/.test(v),
        { message: "Meeting URL must be a valid URL (https://…)" }
      ),

    location: z.string().trim().optional(),
  })
  // Cross-field rule 1: end must be strictly after start.
  .refine((data) => data.end > data.start, {
    message: "End must be after start",
    path: ["end"],
  })
  // Cross-field rule 2: location is required for in-person classes.
  .superRefine((data, ctx) => {
    if (data.mode === "IN_PERSON" && !data.location) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Location is required for in-person classes",
        path: ["location"],
      });
    }
  });

export type EditClassInput = z.infer<typeof editClassSchema>;
