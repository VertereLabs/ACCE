# ACCE Tutors — Candidate Brand Directions

_Updated 2026-07-05 · Visual refresh (name "ACCE Tutors" stays). Now anchored to the new logo._

## The logo anchors the palette

New logo (`docs/Pictures/logo low quality.png`): a **navy "A" resting on an open book,
with a graduation mortarboard on top, and a gold swoosh arcing through the middle.**
Palette = **deep navy + gold**, on white.

That fixes the colour story. The three directions below are all **navy + gold** — they vary
the *base* (light / dark / warm) and the *type*, not the brand colours. (The earlier
teal/coral and indigo/emerald options are dropped — they fought the logo.)

**Exact logo colours** (sampled from the hi-res artwork, `docs/Pictures/high quality logo.png`):
- Navy: `#002251` = `hsl(215 100% 16%)` → `--primary` (deep, saturated)
- Gold: `#cb8a00` = `hsl(41 100% 40%)` → `--accent` (rich amber)

These are the true brand anchors — deeper/more saturated than the earlier guesses. Use them
as `--primary` / `--accent`; the direction tables below vary the *base* around them. For very
large dark backgrounds you may lift navy slightly (Direction B) — the pure logo navy is best
for text, buttons, and the mark itself.

**Assets ready** (`design-artifacts/logo/`): the real 1024px logo processed to
`acce-logo-transparent.png` (white knocked out), `acce-logo-reversed.png` (cream + gold, for
dark backgrounds), plus sizes 512/256/180/64/32/16. Still nice-to-have: a true **vector (SVG)**
from the original design file for print/large scale.

---

## Direction A — "Light Authority"  ☀️ light base · navy + gold

The logo sits as-is (navy line-work on white). Clean, credible, and bright — premium but
approachable. Likely the easiest to make feel modern and trustworthy.

| Token | HSL | |
|---|---|---|
| `--background` | `210 40% 98%` | cool near-white |
| `--foreground` | `223 40% 16%` | deep navy ink |
| `--card` | `0 0% 100%` | white |
| `--primary` | `223 47% 26%` | brand navy |
| `--accent` | `41 62% 50%` | brand gold |
| `--muted-foreground` | `223 14% 42%` | |
| `--border` | `214 24% 90%` | |
| radius | `0.875rem` | |

- **Type:** Playfair Display (headings) + Inter (body) — or Fraunces for a softer serif
- **Voice:** _"Your path to CA(SA) success — done right."_ Credible, calm, confident.

---

## Direction B — "Deep Authority" (Exam Authority)  🎓 dark base · navy + gold

The premium, editorial evolution of today's dark look — now on the real brand colours.
Needs the **white/reversed logo variant**. Gold on ink = distinction / top marks.

| Token | HSL | |
|---|---|---|
| `--background` | `223 45% 11%` | ink navy |
| `--foreground` | `40 30% 96%` | warm off-white |
| `--card` | `223 40% 15%` | |
| `--primary` | `40 30% 96%` | light (light-on-dark buttons) |
| `--accent` | `41 70% 55%` | distinction gold |
| `--muted-foreground` | `40 14% 70%` | |
| `--border` | `223 30% 22%` | |
| radius | `0.5rem` | sharper |

- **Type:** Playfair Display (tightened) + Inter
- **Voice:** _"Master it. Pass with distinction."_ Confident, precise, results-first.

---

## Direction C — "Warm Scholar"  📖 warm light base · navy + gold

Keeps the mentorship warmth (Priyanka's personal story) while staying on navy + gold. Cream
base + navy + gold reads scholarly and human — like a well-made study companion.

| Token | HSL | |
|---|---|---|
| `--background` | `40 38% 96%` | warm ivory |
| `--foreground` | `223 38% 18%` | navy ink |
| `--card` | `40 44% 99%` | warm white |
| `--primary` | `223 47% 26%` | brand navy |
| `--accent` | `38 68% 48%` | warm gold (slightly amber) |
| `--muted-foreground` | `223 12% 44%` | |
| `--border` | `40 26% 88%` | |
| radius | `1rem` | soft |

- **Type:** Fraunces (soft serif) + DM Sans
- **Voice:** _"You're not alone — let's get you there."_ Warm, encouraging, first-person.

---

## At a glance

| | A · Light Authority | B · Deep Authority | C · Warm Scholar |
|---|---|---|---|
| **Base** | Cool near-white | Ink navy (dark) | Warm ivory |
| **Colours** | Navy + gold | Navy + gold (gold-forward) | Navy + gold (warmer gold) |
| **Type** | Playfair/Fraunces + Inter | Playfair + Inter | Fraunces + DM Sans |
| **Logo variant** | Standard (navy on light) | Reversed (white on dark) | Standard (navy on light) |
| **Feel** | Clean, credible | Premium, serious | Human, scholarly |

All three keep shadcn token names, so the winner ports as a values-swap. Next: pick a base
lean (or explore all three in Claude Design), then I port it into the app.
