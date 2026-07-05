# Validation Report — ACCE Tutors (Stage 1 redesign spines)

- **DESIGN.md:** `./DESIGN.md`
- **EXPERIENCE.md:** `./EXPERIENCE.md`
- **Run at:** 2026-07-05
- **Lenses:** Rubric walker · Brand & implementation fidelity
- **Reviewer files:** `review-rubric.md`, `review-fidelity.md`

## Overall verdict

The spine pair is a disciplined, unusually faithful shadcn brand-layer delta: canonical section
order, both color modes fully paired, two-mode system internally coherent, and every mode-token
triple matches the approved mocks with **zero numeric drift**. Validation surfaced **one systemic
spec defect** — load-bearing helper colors (`accent-ink`, `footer-bg/fg`, plus an undocumented
`primary-ink`) lived only in YAML comments, so `{accent-ink}` references resolved to nothing a code
generator could mirror. **That defect (and the other spec-level findings) have now been fixed in
place.** The fidelity review's *critical* finding is **not** a spec defect: the current
`acce-nextjs/globals.css` hardcodes the old burnt-orange look outside the token system, referenced
across **42 component files** — a token swap won't touch it. That, the `next/font` migration, the
`next-themes` config, and the toggle/logo build are **implementation-story work**, captured as a
seed checklist below (from `review-fidelity.md`).

## Category verdicts

| Category | Verdict | Status after fixes |
|---|---|---|
| Flow coverage | adequate | Flow 2 promoted (Sipho) + guides flow added (Nomsa) — **resolved** |
| Token completeness | thin | helper tokens promoted to real per-mode tokens — **resolved** |
| Component coverage | adequate | theme-toggle + tag + ghost-on-CTA rows added — **resolved** |
| State coverage | strong | — |
| Visual reference coverage | thin | 2 finals linked inline; A/B/C archived — **resolved** |
| Bloat & overspecification | strong (clean) | — |
| Inheritance discipline | 1 broken ref | `{accent-ink}` now resolves — **resolved** |
| Shape fit | strong | responsive-reflow note added — **resolved** |
| Mock↔spec fidelity | strong | primary-ink documented; anchor table clarified — **resolved** |
| Two-mode coherence | strong | — |
| Values-swap portability | **thin** | **deferred to implementation story** (not a spec fix) |
| Font migration | adequate | **deferred to implementation story** |

## Findings by severity

### Critical (1) — deferred to implementation story (not a spec defect)
**[Fidelity] Old burnt-orange layer survives a token swap** (`acce-nextjs/src/app/globals.css`).
`body` background is an orange gradient; `--gradient-*`, `--accent-text: 25 85% 35%`, `.hero-tag`,
`.text-accent*` are all hue-25 orange and are referenced across **42 component files**. A palette
values-swap leaves all of it in place — violating the spec's "don't reintroduce burnt-orange" rule.
*Fix (in the port story):* set `body` bg to `hsl(var(--background))`; purge/remap every `--gradient-*`
and orange utility to gold/navy tokens; audit all 42 consumers.

### High (7)
- **[Rubric] `accent-ink` phantom token** — load-bearing but comment-only; `{accent-ink}` unresolved.
  ✅ **Fixed:** promoted to real `colors.light`/`colors.dark` tokens; refs now `{colors.accent-ink}`.
- **[Rubric] Footer surface colors comment-only** (`footer-bg/fg`). ✅ **Fixed:** now real per-mode tokens.
- **[Rubric] Theme toggle had no visual spec** (DESIGN.md Components). ✅ **Fixed:** added a Components row + `theme-toggle` token.
- **[Fidelity] `:root` is currently dark, not light** — must be replaced wholesale with the Warm
  Scholar light palette (no existing light theme to preserve). *Deferred to port story.*
- **[Fidelity] Three non-native tokens must be hand-added** to both blocks (`--accent-ink`,
  `--footer-bg`, `--footer-fg`; + `--primary-ink`). Spec now names them; *wiring deferred to port story.*
- **[Fidelity] Font-loader migration**, not just DM Sans→Inter — app uses a CDN `@import` and **no
  `next/font`**. *Deferred to port story* (add `next/font/google`, delete `@import`).
- **[Fidelity] `next-themes` config contradicts "dark default"** — `enableSystem` gives light-OS
  visitors a light first paint; `disableTransitionOnChange` kills the toggle cross-fade. *Deferred.*

### Medium (selected)
- **[Fidelity] `--primary-ink` used by mocks, absent from DESIGN.md.** ✅ **Fixed:** documented as a real token.
- **[Fidelity] Anchor table vs token table contradiction** (`#002251` ≠ light `--primary`).
  ✅ **Fixed:** anchors relabeled provenance-only; mode triples declared authoritative.
- **[Rubric] Tag description half-true across modes** (navy vs off-white). ✅ **Fixed.**
- **[Rubric] `components.tag` frontmatter entry missing.** ✅ **Fixed.**
- **[Rubric] Mocks not linked per-section; A/B/C candidates orphaned/misleading.** ✅ **Fixed:** finals linked, candidates archived.
- **[Rubric] Flow 2 thin; no guides-library flow.** ✅ **Fixed.**
- **[Fidelity] Theme-toggle control + theme-aware logo are net-new.** *Deferred to port story.*

### Low (selected)
- **[Fidelity] Radius/button-radius port cleanly by coincidence** (`rounded-md` ≈ mock's `*.8`). Documented so no one "fixes" it.
- **[Fidelity] CTA-box ghost override** (`primary-foreground` border/text). ✅ **Fixed:** added `ghost-on-primary` component.
- **[Rubric] Contrast "verified" vs "verify at build" wording mismatch.** ✅ **Fixed:** aligned to "verify at build".
- **[Fidelity] `sidebar-*` tokens off-brand but unused** in Stage 1. Leave; revisit in Stage 2.
- **[Rubric] `src/config/guides.ts` path precision.** ✅ **Fixed.**

## Implementation-story seed checklist (the port into acce-nextjs)

From `review-fidelity.md` — the future "port redesign into `acce-nextjs`" dev story must:

1. **Rewrite both token blocks** in `globals.css`: `:root` ← Warm Scholar **light**, `.dark` ←
   Deep Authority **dark**, verbatim from DESIGN.md frontmatter (HSL format already matches).
2. **Add the 4 non-native tokens** to *both* blocks (`--accent-ink`, `--primary-ink`, `--footer-bg`,
   `--footer-fg`; footer values do not invert). Decide Tailwind-mapped vs arbitrary `hsl(var(--…))`.
3. **Purge the burnt-orange layer**: `body` bg → `hsl(var(--background))`; remove/remap
   `--gradient-*`, `--accent-text`, `.hero-tag`, `.text-accent*`, orange `--shadow-glow`.
4. **Audit all 42 component files** using `gradient-text` / `text-accent` / `hero-tag` /
   `shadow-glow` / `animate-float` / `font-body`; re-point to new tokens (`accent-ink` for gold
   text/icons, `--accent` for fills only).
5. **Swap `--radius`** `0.75rem`→`0.625rem`; confirm buttons stay on `rounded-md` (no edit needed).
6. **Font migration**: add `next/font/google` (Playfair Display + Inter) in `layout.tsx` with CSS-var
   output; set `--font-body`/Tailwind `fontFamily.body` to Inter; **delete** the CDN `@import`.
7. **Fix `next-themes`**: `enableSystem={false}` (true dark default); drop `disableTransitionOnChange`
   if the cross-fade is wanted.
8. **Build the theme toggle** (navbar sun/moon, keyboard-operable, `aria-label` = target mode) and a
   **theme-aware logo** (reversed on dark/all footers, standard on light header).
9. **Copy logo assets** into `acce-nextjs/public/` (`acce-logo-reversed.png` + `acce-logo-transparent.png`).
10. **Verify contrast at build** for `muted-foreground` in both modes; leave `sidebar-*` as-is for Stage 1.
