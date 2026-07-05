import { readFileSync, writeFileSync } from 'node:fs';
const tpl = readFileSync(new URL('./_homepage-template.html', import.meta.url), 'utf8');

const fonts =
  `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` +
  `<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`;

// Unified across BOTH modes:
const SHARED = `
  --radius: 0.625rem;
  --display-weight: 700;
  --font-display: 'Playfair Display', Georgia, 'Times New Roman', serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;`;

const dirs = [
  {
    letter: 'DARK', name: 'Deep Authority — DEFAULT (dark)', fontnote: 'Playfair Display + Inter · reversed logo',
    logoHead: 'logo-reversed.png', logoFoot: 'logo-reversed.png',
    theme: SHARED + `
  --background: 223 45% 11%;
  --foreground: 40 30% 96%;
  --card: 223 40% 15%;
  --card-foreground: 40 30% 96%;
  --primary: 40 30% 96%;
  --primary-foreground: 223 45% 12%;
  --primary-ink: 40 30% 92%;
  --accent: 41 70% 55%;
  --accent-foreground: 223 45% 12%;
  --accent-ink: 41 78% 63%;
  --muted: 223 40% 14%;
  --muted-foreground: 40 14% 70%;
  --border: 223 30% 23%;
  --shadow: 0 24px 54px -22px hsl(0 0% 0% / .62);
  --footer-bg: 223 48% 8%;
  --footer-fg: 40 30% 92%;`
  },
  {
    letter: 'LIGHT', name: 'Warm Scholar — LIGHT MODE', fontnote: 'Playfair Display + Inter · standard logo',
    logoHead: 'logo-standard.png', logoFoot: 'logo-reversed.png',
    theme: SHARED + `
  --background: 40 38% 96%;
  --foreground: 223 38% 18%;
  --card: 40 44% 99%;
  --card-foreground: 223 38% 18%;
  --primary: 223 47% 26%;
  --primary-foreground: 40 38% 97%;
  --primary-ink: 223 47% 26%;
  --accent: 38 68% 48%;
  --accent-foreground: 223 45% 12%;
  --accent-ink: 36 76% 33%;
  --muted: 40 34% 92%;
  --muted-foreground: 223 12% 44%;
  --border: 40 26% 88%;
  --shadow: 0 18px 44px -24px hsl(38 60% 28% / .30);
  --footer-bg: 223 44% 14%;
  --footer-fg: 40 38% 95%;`
  }
];

const slug = { DARK: 'final-dark-default', LIGHT: 'final-light-mode' };
for (const d of dirs) {
  let out = tpl
    .replace(/__DIRNAME__/g, d.name).replace(/__DIRLETTER__/g, d.letter).replace(/__FONTNOTE__/g, d.fontnote)
    .replace('<!--FONTS-->', fonts).replace('/*THEME*/', d.theme)
    .replace(/LOGOSRC_FOOT/g, d.logoFoot).replace(/LOGOSRC/g, d.logoHead);
  writeFileSync(new URL(`./mock-${slug[d.letter]}.html`, import.meta.url), out);
  console.log('wrote', `mock-${slug[d.letter]}.html`);
}
