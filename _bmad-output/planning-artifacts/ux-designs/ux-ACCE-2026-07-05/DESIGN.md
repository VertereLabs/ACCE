---
name: ACCE Tutors
description: Visual identity for the ACCE Tutors website (Stage 1 "fresh look" redesign). shadcn/ui on Next.js 16 + Tailwind 3; this DESIGN.md is the brand-layer DELTA only — unlisted tokens inherit shadcn defaults. Two-mode system on the navy+gold logo anchors — DARK is default (Deep Authority), LIGHT is the alternate (Warm Scholar). Name "ACCE Tutors" is unchanged.
status: final
updated: 2026-07-05
# All colors are shadcn HSL channel triples (space-separated), consumed as hsl(var(--token)).
# DARK is the default mode — the app renders <html class="dark"> by default.
colors:
  light: # :root — Warm Scholar (warm ivory base, navy + warm gold)
    background: '40 38% 96%'
    foreground: '223 38% 18%'
    card: '40 44% 99%'
    card-foreground: '223 38% 18%'
    popover: '40 44% 99%'
    popover-foreground: '223 38% 18%'
    primary: '223 47% 26%'          # brand navy
    primary-foreground: '40 38% 97%'
    secondary: '40 34% 92%'
    secondary-foreground: '223 38% 18%'
    muted: '40 34% 92%'
    muted-foreground: '223 12% 44%'
    accent: '38 68% 48%'            # warm brand gold
    accent-foreground: '223 45% 12%'
    border: '40 26% 88%'
    input: '40 26% 88%'
    ring: '38 68% 48%'
    destructive: '0 72% 45%'
    destructive-foreground: '40 38% 97%'
    accent-ink: '36 76% 33%'         # readable gold for TEXT/ICONS on base (accent fails as small text)
    primary-ink: '223 47% 26%'       # navy text tint (tags); ≈ --primary in light
    footer-bg: '223 44% 14%'         # footer is dark navy in BOTH modes (does not invert)
    footer-fg: '40 38% 95%'
  dark: # .dark (DEFAULT) — Deep Authority (ink-navy base, gold-forward)
    background: '223 45% 11%'
    foreground: '40 30% 96%'
    card: '223 40% 15%'
    card-foreground: '40 30% 96%'
    popover: '223 40% 15%'
    popover-foreground: '40 30% 96%'
    primary: '40 30% 96%'           # light — for light-on-dark buttons
    primary-foreground: '223 45% 12%'
    secondary: '223 40% 18%'
    secondary-foreground: '40 30% 96%'
    muted: '223 40% 14%'
    muted-foreground: '40 14% 70%'
    accent: '41 70% 55%'            # distinction gold
    accent-foreground: '223 45% 12%'
    border: '223 30% 23%'
    input: '223 30% 23%'
    ring: '41 70% 55%'
    destructive: '0 62% 50%'
    destructive-foreground: '40 30% 96%'
    accent-ink: '41 78% 63%'         # readable gold for TEXT/ICONS on dark base
    primary-ink: '40 30% 92%'        # off-white text tint (tags); ≈ --primary in dark
    footer-bg: '223 48% 8%'          # footer stays dark navy in both modes
    footer-fg: '40 30% 92%'
  # NOTE: accent-ink / primary-ink / footer-bg / footer-fg are NON-NATIVE shadcn tokens.
  # The implementation story must declare them in BOTH :root and .dark (footer-* do not invert).
typography:
  # Both modes share ONE type system (decision: unify type across modes).
  display:
    fontFamily: 'Playfair Display'
    weights: '600 700 800'
    tracking: '-0.02em (h1) / -0.01em (h2)'
    lineHeight: '1.12'
  body:
    fontFamily: 'Inter'
    weights: '400 500 600 700'
    lineHeight: '1.6'
rounded:
  # Unified across both modes. shadcn --radius = 0.625rem (was 0.5 dark / 1.0 light; reconciled).
  base: 0.625rem
  # Tailwind derives: sm = base-4px, md = base-2px, lg = base. Pills use 999px.
spacing:
  # Inherit shadcn / Tailwind spacing scale. Section vertical rhythm ~88px desktop.
components:
  button-primary:
    background: '{colors.primary}'
    foreground: '{colors.primary-foreground}'
    radius: 'calc(var(--radius) * .8)'
  button-accent:            # primary CTA emphasis (gold)
    background: '{colors.accent}'
    foreground: '{colors.accent-foreground}'
    radius: 'calc(var(--radius) * .8)'
  button-ghost:
    background: 'transparent'
    foreground: '{colors.foreground}'
    border: '{colors.border}'
  card:
    background: '{colors.card}'
    border: '{colors.border}'
    radius: '{rounded.base}'
  badge-eyebrow:            # gold pill section labels
    background: '{colors.accent} / .12'
    foreground: '{colors.accent-ink}'
    border: '{colors.accent} / .28'
    radius: '999px'
  icon-badge:               # rounded square behind section/card icons
    background: '{colors.accent} / .14'
    foreground: '{colors.accent-ink}'
    radius: 'calc(var(--radius) * .7)'
  tag:                      # expertise tags, blog categories (navy in light, off-white in dark)
    background: '{colors.primary} / .10'
    foreground: '{colors.primary-ink}'
    border: '{colors.primary} / .18'
    radius: '999px'
  theme-toggle:             # navbar sun/moon — ghost icon-button
    background: 'transparent'
    foreground: '{colors.muted-foreground}'
    hover-foreground: '{colors.accent-ink}'
    radius: 'calc(var(--radius) * .8)'
  ghost-on-primary:         # secondary CTA button on the inverted --primary CTA panel
    background: 'transparent'
    foreground: '{colors.primary-foreground}'
    border: '{colors.primary-foreground} / .3'
---

# ACCE Tutors — Visual Identity

> Stage 1 "fresh look" for accetutors.co.za. shadcn/ui brand-layer delta. This spine wins on
> conflict with any mock. Visual reference (full homepage, real copy):
> [`mockups/mock-final-dark-default.html`](./mockups/mock-final-dark-default.html) (default) and
> [`mockups/mock-final-light-mode.html`](./mockups/mock-final-light-mode.html) (light) — with
> `shot-final-*.png` renders. The superseded A/B/C exploration lives in `mockups/_archive/`.
> Companion: [EXPERIENCE.md](./EXPERIENCE.md).

## Brand & Style

ACCE Tutors is a one-woman CA(SA)/CTA tutoring brand built on **Priyanka Govender's personal
journey** — she failed Financial Accounting at 38%, went back to basics, and improved 25%. The
brand must read as **credible exam authority** *and* **human mentorship** at once. The look
resolves that tension with a **two-mode system on a single navy + gold palette**, anchored to
the new logo (navy "A" on an open book, mortarboard, gold swoosh):

- **Dark is the default — "Deep Authority."** Ink-navy + distinction gold. Premium, serious,
  results-first. This is the primary identity and the smaller change from today's dark site.
- **Light is the alternate — "Warm Scholar."** Warm ivory + navy + warm gold. Human, scholarly,
  approachable — the mentorship voice, for readers who prefer light.

Both are the *same brand*: identical type and corner radius, same logo, same gold. Only the base
palette flips. Aesthetic posture: confident, precise, calm. Never loud, playful, or clip-arty.

## Colors

Brand anchors are sampled from the hi-res logo. **These hex values are provenance/reference only**
— they name where the palette came from. The **authoritative** color values are the per-mode token
triples in the frontmatter `colors.light` / `colors.dark`, which are *tuned derivatives* of the
anchors (hue/saturation adjusted for surface legibility). Do not "correct" a token back toward the
raw anchor.

| Anchor (provenance) | Hex | HSL | Informs |
|---|---|---|---|
| Navy | `#002251` | `215 100% 16%` | the brand mark + the navy family (`--primary` in light is the tuned `223 47% 26%`) |
| Gold | `#cb8a00` | `41 100% 40%` | the gold family (`--accent`, `accent-ink`) |

Notes on the token system:

- **Dark mode inverts `--primary`:** buttons are *light on dark*, so `--primary` is the off-white
  and `--accent` (gold) carries emphasis. Light mode uses navy `--primary` in the classic way.
- **`accent-ink`** (now a real per-mode token) is a readable gold for gold *text/icons on the base*
  (gold at full chroma fails contrast as small text). Buttons/fills use `--accent`; text/icon gold
  uses `accent-ink`.
- **Footer is dark navy in both modes** (`footer-bg`/`footer-fg` — real tokens that *do not* invert;
  anchors the page, showcases the reversed logo).
- Contrast floor: body text ≥ 4.5:1, large display ≥ 3:1 — **to be verified at build** for both modes
  (see EXPERIENCE.md Accessibility Floor). Gold-on-base as *body text* is prohibited; use `accent-ink`.

## Typography

One system, both modes (unification decision — a mode toggle must never restyle type):

- **Display — Playfair Display** (600/700/800). Headings, hero, stats, prices. High-contrast
  serif = authority + editorial polish. Tracking tightened on large sizes (h1 `-0.02em`).
- **Body — Inter** (400–700). All prose, UI, labels, nav. Neutral, legible, screen-first.
- **Eyebrow labels & stat captions:** Inter, uppercase, `letter-spacing: .12–.14em`, in `accent-ink`.
- Scale: h1 `clamp(2.6rem, 5vw, 4rem)` · h2 `clamp(2rem, 3.4vw, 2.8rem)` · h3 `1.25rem` · body `1rem/1.6`.
- Load via `next/font` (self-hosted) at implementation — the mocks use Google Fonts CDN.
- **Supersedes** the current app fonts (Playfair Display **+ DM Sans**). Body font changes DM Sans → Inter.

## Layout & Spacing

- Content max-width `1160px`, gutters `24px`. Section vertical rhythm `~88px` desktop.
- Alternating section backgrounds: `--background` ↔ `--muted` to separate the 11 homepage bands.
- Grids: Services 2×2 · Why-Choose 3×2 · How-It-Works 4-up · Pricing 3-up (middle scaled `1.04`).
- **Responsive reflow:** all multi-column grids collapse to a single column under `md` (≤860px);
  the navbar links collapse to the mobile menu; the "Most Popular" `scale` is dropped on mobile.
- Inherit Tailwind's spacing scale otherwise. Layout constants (`1160px` / `24px` / `88px`) are
  raw values, not tokens — intentional; they map to Tailwind's `max-w`/`px`/`py` utilities.

## Elevation & Depth

- Soft, low, brand-tinted shadows — not neutral gray. Light: `0 18px 44px -24px hsl(38 60% 28% / .30)`.
  Dark: `0 24px 54px -22px hsl(0 0% 0% / .62)`.
- Elevation is reserved: profile card, the "Most Popular" pricing card, the floating hero badge.
- Hero uses two large blurred color orbs (accent + primary, `blur(90px)`, low opacity) for depth.

## Shapes

- **Radius `0.625rem`** everywhere (cards, inputs, buttons ≈ `0.5rem` via `*.8`). Pills (`999px`)
  for badges/tags. Reconciled from Deep Authority's `0.5` and Warm Scholar's `1.0` to one value.
- Icons: **lucide**, ~1.9 stroke, in `accent-ink`, inside a soft rounded-square `icon-badge`.

## Components

Brand-layer overrides on shadcn primitives; token specifics in frontmatter `components`.

| Component | Spec |
|---|---|
| **Button — primary** | `--primary` bg / `--primary-foreground`. Default action. |
| **Button — accent** | Gold bg / dark text. The *conversion* CTA (Get Started, WhatsApp, Most-Popular). One accent button per view group. |
| **Button — ghost** | Transparent, `--border`, hover `--muted`. Secondary. |
| **Button — ghost on CTA** | Variant of ghost bound to `primary-foreground` (border + text), used for the secondary button on the full-bleed CTA panel where `--primary` is the background. Keeps "Send Email" legible when the panel flips navy (light) ⇄ off-white (dark). |
| **Card** | `--card` on `--border`, radius `0.625rem`, padding `28px`. The workhorse (services, steps, values, pricing, resources, blog). |
| **Eyebrow badge** | Gold pill (`accent/.12` bg, `accent/.28` border, `accent-ink` text) + lucide icon. Opens every section. |
| **Icon badge** | Soft gold rounded-square holding a lucide icon; tops each feature card. |
| **Tag** | Primary-tinted pill (`primary/.10` bg, `primary-ink` text) — **navy in light, off-white in dark** (since `--primary` inverts; correct and readable in both). Expertise tags, blog categories. |
| **Theme toggle** | Ghost icon-button in the navbar (sun/moon lucide, `muted-foreground`, hover `accent-ink`), radius `≈0.5rem`. The control for the dark⇄light capability; keyboard-operable (behavior in EXPERIENCE.md). |
| **Pricing "Most Popular"** | Gold border + shadow + `scale(1.04)` + gold flag; uses the accent button. |
| **Logo** | **Reversed** (cream+gold) on dark surfaces (dark-mode header, all footers). **Standard** (navy) on light surfaces (light-mode header). A theme-aware component swaps the variant. Assets in `design-artifacts/logo/` (on-disk names `acce-logo-reversed.png` / `acce-logo-transparent.png`; the mock filenames `logo-reversed.png` / `logo-standard.png` are copies). |

## Do's and Don'ts

- **Do** default to dark; ship light as a real toggle (`next-themes`, `defaultTheme="dark"`).
- **Do** keep gold for emphasis/accents only — it is a spice, not a base. One gold CTA per group.
- **Do** use `accent-ink` for any gold *text or icon*; use `--accent` only for fills/buttons/borders.
- **Do** swap the logo variant to match surface (reversed on dark/footer, standard on light).
- **Don't** change fonts or radius between modes — only the palette flips.
- **Don't** reintroduce the old burnt-orange monogram or dark-navy #1a…; the anchors are `#002251` / `#cb8a00`.
- **Don't** put gold text on the gold accent, or navy text on the dark base — respect the pairings.
- **Don't** add a third accent hue; the brand is navy + gold, full stop.
