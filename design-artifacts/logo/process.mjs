import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
const require = createRequire("D:/Projects/ACCE - Copy/acce-nextjs/node_modules/");
const { chromium } = require("playwright");

const b64 = readFileSync("D:/Projects/ACCE - Copy/docs/Pictures/high quality logo.png").toString("base64");
const src = `data:image/png;base64,${b64}`;

const browser = await chromium.launch();
const page = await browser.newPage();

const out = await page.evaluate(async (src) => {
  const img = new Image();
  img.src = src;
  await img.decode();
  const W = img.width, H = img.height;

  // 1) draw source
  const base = document.createElement("canvas");
  base.width = W; base.height = H;
  const bctx = base.getContext("2d");
  bctx.drawImage(img, 0, 0);
  const id = bctx.getImageData(0, 0, W, H);
  const d = id.data;

  // 2) knock out white bg → alpha, un-premultiplying over white to kill halos.
  //    Both brand colours have a near-zero channel, so min(r,g,b) is a clean alpha proxy.
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i+1], b = d[i+2];
    const mn = Math.min(r, g, b);
    let a = 1 - mn / 255;
    if (a <= 0.004) { d[i+3] = 0; continue; }
    if (a > 1) a = 1;
    // F = (O - 255*(1-a)) / a
    d[i]   = Math.max(0, Math.min(255, (r - 255*(1-a)) / a));
    d[i+1] = Math.max(0, Math.min(255, (g - 255*(1-a)) / a));
    d[i+2] = Math.max(0, Math.min(255, (b - 255*(1-a)) / a));
    d[i+3] = Math.round(a * 255);
  }

  // exact brand colours: most-frequent fully-opaque navy vs gold
  const navyMap = new Map(), goldMap = new Map();
  const key = (r,g,b) => (r<<16)|(g<<8)|b;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i+3] < 250) continue;
    const r = d[i], g = d[i+1], b = d[i+2];
    if (r > g && r > b && r - b > 40) { const k=key(r,g,b); goldMap.set(k,(goldMap.get(k)||0)+1); }
    else if (b >= r) { const k=key(r,g,b); navyMap.set(k,(navyMap.get(k)||0)+1); }
  }
  const top = m => { let best=0,bk=0; for (const [k,n] of m) if (n>best){best=n;bk=k;} return "#"+bk.toString(16).padStart(6,"0"); };
  const navyHex = top(navyMap), goldHex = top(goldMap);

  const transparent = document.createElement("canvas");
  transparent.width = W; transparent.height = H;
  transparent.getContext("2d").putImageData(id, 0, 0);

  // 3) reversed: navy family → cream, gold kept
  const rev = new ImageData(new Uint8ClampedArray(d), W, H);
  const rd = rev.data;
  const cream = [244, 239, 225];
  for (let i = 0; i < rd.length; i += 4) {
    if (rd[i+3] === 0) continue;
    const r = rd[i], g = rd[i+1], b = rd[i+2];
    const warm = r > g && r > b && r - b > 40;
    if (!warm) { rd[i] = cream[0]; rd[i+1] = cream[1]; rd[i+2] = cream[2]; }
  }
  const reversed = document.createElement("canvas");
  reversed.width = W; reversed.height = H;
  reversed.getContext("2d").putImageData(rev, 0, 0);

  // helper: scaled export
  const scaled = (srcCanvas, size) => {
    const c = document.createElement("canvas");
    c.width = size; c.height = size;
    const x = c.getContext("2d");
    x.imageSmoothingEnabled = true; x.imageSmoothingQuality = "high";
    x.drawImage(srcCanvas, 0, 0, size, size);
    return c.toDataURL("image/png");
  };

  const files = {};
  files["acce-logo-transparent.png"] = transparent.toDataURL("image/png");
  files["acce-logo-reversed.png"] = reversed.toDataURL("image/png");
  for (const s of [512, 256, 180, 64, 32, 16]) files[`acce-logo-${s}.png`] = scaled(transparent, s);

  // preview composites (for visual QA)
  const composite = (srcCanvas, bg) => {
    const c = document.createElement("canvas");
    c.width = 512; c.height = 512;
    const x = c.getContext("2d");
    x.fillStyle = bg; x.fillRect(0,0,512,512);
    x.imageSmoothingQuality = "high";
    x.drawImage(srcCanvas, 16, 16, 480, 480);
    return c.toDataURL("image/png");
  };
  files["_preview-transparent-on-gray.png"] = composite(transparent, "#dfe3ea");
  files["_preview-transparent-on-navy.png"] = composite(transparent, "#12244a");
  files["_preview-reversed-on-navy.png"] = composite(reversed, "#12244a");

  return { navyHex, goldHex, files };
}, src);

await browser.close();

for (const [name, dataUrl] of Object.entries(out.files)) {
  const b = Buffer.from(dataUrl.split(",")[1], "base64");
  writeFileSync(name, b);
}
console.log("exact navy:", out.navyHex, "| exact gold:", out.goldHex);
console.log("wrote", Object.keys(out.files).length, "files");
