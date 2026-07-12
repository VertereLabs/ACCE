# Web Guide Review: 12 July 2026

Review of the published study guides (Groups, IFRS 15, IFRS 16) covering content accuracy, layout, and the end-of-guide experience.

**Status summary:** all items implemented.

---

## Applicable to All Guides

### 1. Remove suggested reading times — ✅ Implemented

The listed times are not accurate allocations. The idea of showing times is good, but if they are included they need to be appropriate, and timing each read is not practical.

**Resolution:** reading-time labels and the "Total Time" stat removed from all three guide landing pages.

### 2. Whole part card should be clickable — ✅ Implemented

Each part card looks clickable, but only the "Start Part" button on the right-hand side actually was.

**Resolution:** the entire card is now a link on all three guide landing pages, with "Start Part" kept as a visual affordance.

---

## Groups

### Part 2: The Acquisition Method — ✅ Implemented

The guide stated the acquisition date is when legal transfer occurs (shares are transferred, consideration is paid). Challenged as technically inaccurate: per IFRS 3, the acquisition date is the date on which **control is obtained**, which is not necessarily the date of legal transfer.

### Part 4: Analysis of Equity (AOE) — ✅ Implemented

**Section 2, The Structure of the AOE:** remove "columns" from the block titles. The blocks should read simply:

1. At Acquisition
2. Since Acquisition to Start of Current Year
3. Current Year

### Part 6: Associates and Joint Ventures — ✅ Implemented

Sections 2, 3, and 4 used the term "group" when referring to the associate, which is not appropriate: the associate is not part of the group. Per IFRS, a group is defined as the parent and its subsidiaries.

### Part 7: The "You've Finished" block — ✅ Implemented

Add a small note stating that full guides with worked examples are coming soon.

### Part 7: Completion card redesign — ✅ Implemented

The big orange "You've Finished" block doesn't sit well visually. The idea is good, but it should be folded into the "Ready to Ace your Exams" section at the bottom of the page. This treatment applies to the final page of all three guides.

Requested copy (concise, doesn't have to be word for word, keep the fun play at the end):

> Groups Guide Complete! Good luck with your studies and upcoming exams. If you feel you'd like additional support, reach out to me on WhatsApp (link) or you can view the services on offer (link). Otherwise, feel free to check out our other guides (link). We will make sure you are ready to ACCE your exams.

Structured as its own standout card with the three links, styled to look cool and funky.

**Resolution:** new shared `GuideCompletionCard` component replaces both the orange block and the old bottom CTA on Groups Part 7, IFRS 15 Part 5, and IFRS 16 Part 5. The coming-soon note was kept as a small card at the end of the article content.

---

## IFRS 15

### Part 1: Foundations and Core Principle — ✅ Implemented

**Section 2, The Core Principle:** the "(IFRS 15.2)" citation fell outside the highlighted block, which looked odd. Moved inside the block.

### Part 4: The Dual Nature of Warranties — ✅ Implemented

The two warranty cards restructured to the following content:

| | Assurance-Type Warranty | Service-Type Warranty |
|---|---|---|
| **Core Concept** | Guarantees the product works as intended at the time of sale. | Provides an additional, distinct service beyond basic functionality. |
| **Separable?** | No. It is not a distinct performance obligation. | Yes. It is a distinct performance obligation. |
| **Accounting Standard** | Covered under IAS 37 (Provisions). | Covered under IFRS 15 (Revenue Recognition). |
| **Accounting Entry** | Expense the estimated cost and create a liability provision at the time of sale. | Defer a portion of the transaction price and recognize revenue over the warranty period. |

### Part 5: Disclosures & Exam Preparation — ✅ Implemented

**Section 3, Exam Preparation Strategy, "Structure your answer by the FIVE STEPS":** closing sentence updated to:

> Even if the question is only about Step 3, briefly reference the fact that a valid contract and POs have been identified. It shows you are able to identify the issue.

---

## General Commentary

Feedback on the end card displayed at the end of each guide's final part.

### 1. Inconsistent button styles in the completion card — ✅ Implemented

The button styles in the final card change: the "WhatsApp Priyanka" button is one style, while "View Our Services" and "Explore Other Guides" are a different style. In dark mode the secondary buttons rendered as a bare white outline (white on hover), which looked unstyled.

**Resolution:** the secondary buttons were using the `outline` variant, which is navy in light mode but near-white in dark mode. Switched to the gold `heroOutline` variant (using the readable `accent-ink` gold, filling solid gold on hover) so all three buttons share the gold brand treatment in both themes. Verified with screenshots in light and dark mode, including hover states.

### 2. Unique card style per guide — ✅ Implemented

Each guide's final page should have its own unique completion card style, or at least slight variations. Only changing the heading between guides feels a bit cheap.

**Resolution:** the shared card now themes itself per guide, built from each guide's existing visual identity: its icon from the guides index (Groups: building, IFRS 15: receipt, IFRS 16: document), a new "All X Parts Complete" pill (count from the guide catalog), and per-guide tints on the card border, pill, and glow blobs. Groups keeps its gold, IFRS 16 uses its established blue part-badge colour, and IFRS 15 was assigned green from the existing site palette (used by difficulty pills and IFRS 15's own service-type warranty card) since Groups and IFRS 15 were both gold and would have looked identical. Copy and conversion buttons stay the same across all three.

### 3. Lingering "Explore Other Guides" nav button above the card — ✅ Implemented

The bottom navigation row on Groups Part 7 still had an off-brand blue "Explore Other Guides" button just above the completion card, duplicating one of the card's links. The "Master All Standards" wording (from IFRS 16) feels more appropriate for this back-to-guides link.

**Resolution:** all three final pages now use the same "Master All Standards" label in the standard gold next-step button style (accent fill with trailing arrow), matching the nav convention used across every other guide part.

### 4. Same unstyled-button issue on the Subjects page (and site-wide) — ✅ Implemented

The Subjects page CTA cards showed the same bare-outline secondary button in dark mode.

**Resolution:** the root cause was the shared `outline` button variant, which is themed on the primary colour (navy in light mode, near-white in dark mode). Every secondary button using it was affected: `ConversionCtas` (used on Subjects and most content pages), the homepage `Hero` and `CTA` sections, and two one-off guide CTAs that had their own grey overrides. All of them now use the gold `heroOutline` variant, so the site has exactly one secondary-button style paired with the gold primary in both themes.
