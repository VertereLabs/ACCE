/**
 * Guardrail: no em dash (U+2014) in rendered source strings.
 *
 * This test fs-reads every in-scope source file, strips JS/TS line comments
 * (// ...) and block comments (/* ... * /) so that an em dash in a code
 * comment never fails the assertion, then asserts the stripped content
 * contains zero U+2014 characters.
 *
 * AC5: Story 4.1 - a future em dash cannot silently re-enter rendered copy.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Repo root is two levels up from tests/unit/
const root = resolve(__dirname, "../../");

/**
 * Strip single-line (// ...) and block (/* ... * /) comments from source text.
 * This is a conservative strip: handles the common cases well enough for a
 * guardrail test. It does not handle string literals containing comment-like
 * sequences, but that edge case is not present in these files.
 */
function stripComments(src: string): string {
    // Remove block comments first (including multiline)
    let stripped = src.replace(/\/\*[\s\S]*?\*\//g, "");
    // Remove single-line comments
    stripped = stripped.replace(/\/\/[^\n]*/g, "");
    return stripped;
}

const EM_DASH = "—";

// All in-scope files: rendered body copy + metadata + rendered config data.
// Test infra files, Logo.tsx, and guides/page.tsx are intentionally excluded
// (they contain em dashes only in code comments; stripping would also handle
// them, but keeping them out of scope matches the story's explicit list).
const IN_SCOPE_FILES = [
    // Guide index pages
    "src/app/guides/groups/page.tsx",
    "src/app/guides/ifrs-15/page.tsx",
    "src/app/guides/ifrs-16/page.tsx",

    // Guide part pages
    "src/app/guides/groups/part-1/page.tsx",
    "src/app/guides/groups/part-2/page.tsx",
    "src/app/guides/groups/part-3/page.tsx",
    "src/app/guides/groups/part-4/page.tsx",
    "src/app/guides/groups/part-6/page.tsx",
    "src/app/guides/ifrs-15/part-1/page.tsx",
    "src/app/guides/ifrs-15/part-5/page.tsx",
    "src/app/guides/ifrs-16/part-1/page.tsx",
    "src/app/guides/ifrs-16/part-5/page.tsx",

    // Tutor / hub pages (title metadata)
    "src/app/cta-tutor/page.tsx",
    "src/app/tax-tutor/page.tsx",
    "src/app/pgda-tutor/page.tsx",

    // Rendered config data
    "src/config/groupSessions.ts",
];

describe("no-em-dash guardrail", () => {
    it.each(IN_SCOPE_FILES)("no U+2014 in rendered strings of %s", (relPath) => {
        const fullPath = resolve(root, relPath);
        const raw = readFileSync(fullPath, "utf-8");
        const stripped = stripComments(raw);
        expect(
            stripped.includes(EM_DASH),
            `Found em dash (U+2014) in rendered content of ${relPath} after stripping comments`
        ).toBe(false);
    });
});
