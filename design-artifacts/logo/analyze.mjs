import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const require = createRequire("D:/Projects/ACCE - Copy/acce-nextjs/node_modules/");
const { chromium } = require("playwright");

const b64 = readFileSync("D:/Projects/ACCE - Copy/docs/Pictures/high quality logo.png").toString("base64");
const src = `data:image/png;base64,${b64}`;

const browser = await chromium.launch();
const page = await browser.newPage();
const result = await page.evaluate(async (src) => {
  const img = new Image();
  img.src = src;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = img.width; c.height = img.height;
  const ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, c.width, c.height);
  const px = (x, y) => { const i = (y * c.width + x) * 4; return [data[i], data[i+1], data[i+2], data[i+3]]; };
  const hex = ([r,g,b]) => "#" + [r,g,b].map(v => v.toString(16).padStart(2,"0")).join("");
  // corners = background
  const corners = { tl: px(2,2), tr: px(c.width-3,2), bl: px(2,c.height-3), br: px(c.width-3,c.height-3) };
  // color histogram (quantize to 24 levels), ignore near-white
  const map = new Map();
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2];
    if (r > 235 && g > 235 && b > 235) continue; // skip bg-ish
    const q = v => Math.round(v/24)*24;
    const key = `${q(r)},${q(g)},${q(b)}`;
    map.set(key, (map.get(key)||0)+1);
  }
  const top = [...map.entries()].sort((a,b)=>b[1]-a[1]).slice(0,6)
    .map(([k,n]) => { const [r,g,b]=k.split(",").map(Number); return { hex: hex([r,g,b]), rgb:[r,g,b], count:n }; });
  return { size:[c.width,c.height], corners: Object.fromEntries(Object.entries(corners).map(([k,v])=>[k,hex(v)])), top };
}, src);

await browser.close();
console.log(JSON.stringify(result, null, 2));
