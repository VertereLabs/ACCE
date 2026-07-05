import { readFileSync, writeFileSync } from 'node:fs';

const tpl = readFileSync(new URL('./_homepage-template.html', import.meta.url), 'utf8');

const GF = 'https://fonts.googleapis.com/css2';
const link = (fams) =>
  `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` +
  `<link href="${GF}?${fams}&display=swap" rel="stylesheet">`;

const dirs = [
  {
    letter: 'A', name: 'Light Authority', fontnote: 'Playfair Display + Inter',
    logoHead: 'logo-standard.png', logoFoot: 'logo-reversed.png',
    fonts: link('family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700'),
    theme: `
  --background: 210 40% 98%;
  --foreground: 223 40% 16%;
  --card: 0 0% 100%;
  --card-foreground: 223 40% 16%;
  --primary: 223 47% 26%;
  --primary-foreground: 210 40% 98%;
  --primary-ink: 223 47% 26%;
  --accent: 41 62% 50%;
  --accent-foreground: 223 47% 14%;
  --accent-ink: 41 74% 33%;
  --muted: 214 32% 95%;
  --muted-foreground: 223 14% 42%;
  --border: 214 24% 90%;
  --radius: 0.875rem;
  --display-weight: 700;
  --font-display: 'Playfair Display', Georgia, 'Times New Roman', serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --shadow: 0 18px 44px -22px hsl(223 47% 26% / .30);
  --footer-bg: 223 47% 13%;
  --footer-fg: 210 40% 96%;`
  },
  {
    letter: 'B', name: 'Deep Authority', fontnote: 'Playfair Display + Inter · reversed logo',
    logoHead: 'logo-reversed.png', logoFoot: 'logo-reversed.png',
    fonts: link('family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700'),
    theme: `
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
  --radius: 0.5rem;
  --display-weight: 700;
  --font-display: 'Playfair Display', Georgia, 'Times New Roman', serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --shadow: 0 24px 54px -22px hsl(0 0% 0% / .62);
  --footer-bg: 223 48% 8%;
  --footer-fg: 40 30% 92%;`
  },
  {
    letter: 'C', name: 'Warm Scholar', fontnote: 'Fraunces + DM Sans',
    logoHead: 'logo-standard.png', logoFoot: 'logo-reversed.png',
    fonts: link('family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=DM+Sans:wght@400;500;600;700'),
    theme: `
  --background: 40 38% 96%;
  --foreground: 223 38% 18%;
  --card: 40 44% 99%;
  --card-foreground: 223 38% 18%;
  --primary: 223 47% 26%;
  --primary-foreground: 40 38% 97%;
  --primary-ink: 223 47% 26%;
  --accent: 38 68% 48%;
  --accent-foreground: 40 44% 99%;
  --accent-ink: 36 76% 33%;
  --muted: 40 34% 92%;
  --muted-foreground: 223 12% 44%;
  --border: 40 26% 88%;
  --radius: 1rem;
  --display-weight: 600;
  --font-display: 'Fraunces', Georgia, 'Times New Roman', serif;
  --font-body: 'DM Sans', system-ui, -apple-system, sans-serif;
  --shadow: 0 18px 44px -24px hsl(38 60% 28% / .30);
  --footer-bg: 223 44% 14%;
  --footer-fg: 40 38% 95%;`
  }
];

const slug = { A: 'A-light-authority', B: 'B-deep-authority', C: 'C-warm-scholar' };

for (const d of dirs) {
  let out = tpl
    .replace(/__DIRNAME__/g, d.name)
    .replace(/__DIRLETTER__/g, d.letter)
    .replace(/__FONTNOTE__/g, d.fontnote)
    .replace('<!--FONTS-->', d.fonts)
    .replace('/*THEME*/', d.theme)
    .replace(/LOGOSRC_FOOT/g, d.logoFoot)   // must precede LOGOSRC (substring)
    .replace(/LOGOSRC/g, d.logoHead);
  const file = new URL(`./mock-${slug[d.letter]}.html`, import.meta.url);
  writeFileSync(file, out);
  console.log('wrote', `mock-${slug[d.letter]}.html`);
}
