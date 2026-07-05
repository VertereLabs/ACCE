// Pure Zod schema for "create group class" form — no db/Prisma import (Story 2.1 Task 1).
// Importable by vitest/jsdom WITHOUT a DATABASE_URL being set.
//
// AD-9: Rand→cents conversion (toCents helper) lives here so there is exactly ONE
// conversion site: the server action calls toCents(parsed.priceRand) before the DB write.
// No float ever reaches the DB or domain layer.
//
// Mirror of the 1.4 "seed-data.ts" testability pattern: pure constants + schema, zero deps.

import { z } from "zod";
import { LEVELS } from "@/lib/class-constants";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

export const createClassSchema = z
  .object({
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

    // Optional — empty string is allowed; action normalises "" → undefined before the DB write.
    description: z.string().trim().optional(),

    start: z.coerce.date({
      error: () => ({ message: "Start date/time is required" }),
    }),

    end: z.coerce.date({
      error: () => ({ message: "End date/time is required" }),
    }),

    // z.coerce.number("") coerces "" to 0, which then fails min(1). That is the intended behaviour.
    capacity: z
      .coerce
      .number({ error: () => ({ message: "Capacity must be a number" }) })
      .int("Capacity must be a whole number")
      .min(1, "Capacity must be at least 1"),

    // z.coerce.number("") coerces "" to 0, which then fails positive(). Intended.
    priceRand: z
      .coerce
      .number({ error: () => ({ message: "Price must be a number" }) })
      .positive("Price must be greater than 0"),

    mode: z.enum(["ONLINE", "IN_PERSON"], {
      error: () => ({ message: "Mode is required" }),
    }),

    // meetingUrl is optional at create (AD-13) — Priyanka pastes it later (Story 2.3).
    // If provided, must look like a URL. Empty string → passes (treated as "not provided").
    meetingUrl: z
      .string()
      .trim()
      .optional()
      .refine(
        (v) => !v || /^https?:\/\/.+/.test(v),
        { message: "Meeting URL must be a valid URL (https://…)" }
      ),

    // location: optional string; required when mode === "IN_PERSON" (enforced via superRefine).
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

export type CreateClassInput = z.infer<typeof createClassSchema>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert a price in Rand (from the form) to integer priceCents for DB storage.
 * AD-9: Always Math.round — no floats in domain or DB.
 *
 * Examples:
 *   toCents(290)    → 29000
 *   toCents(290.5)  → 29050
 *   toCents(290.55) → 29055
 */
export function toCents(priceRand: number): number {
  return Math.round(priceRand * 100);
}
