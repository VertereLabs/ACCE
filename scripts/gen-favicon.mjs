// Generates favicon assets from the real ACCE logo.
// Run: node scripts/gen-favicon.mjs
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const logo = join(root, "public", "acce-logo.png");

// Trim the logo's transparent margin, then pad to a square so it isn't cropped.
async function square(size, background) {
    const trimmed = await sharp(logo).trim().toBuffer();
    const inner = Math.round(size * 0.86); // small breathing room
    return sharp({
        create: {
            width: size,
            height: size,
            channels: 4,
            background,
        },
    })
        .composite([
            {
                input: await sharp(trimmed)
                    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
                    .toBuffer(),
                gravity: "centre",
            },
        ])
        .png();
}

// Wrap a PNG buffer in a single-image .ico container (PNG-compressed entry).
function pngToIco(pngBuffer, dim) {
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // reserved
    header.writeUInt16LE(1, 2); // type: icon
    header.writeUInt16LE(1, 4); // image count
    const entry = Buffer.alloc(16);
    entry.writeUInt8(dim >= 256 ? 0 : dim, 0); // width (0 => 256)
    entry.writeUInt8(dim >= 256 ? 0 : dim, 1); // height
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(pngBuffer.length, 8); // data size
    entry.writeUInt32LE(6 + 16, 12); // data offset
    return Buffer.concat([header, entry, pngBuffer]);
}

const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
const white = { r: 255, g: 255, b: 255, alpha: 1 };

// App-router tab icon (transparent, crisp).
await (await square(512, transparent)).toFile(join(root, "src", "app", "icon.png"));

// Apple touch icon — iOS shows black behind transparency, so use white.
await (await square(180, white)).toFile(join(root, "src", "app", "apple-icon.png"));

// Legacy favicon.ico from a 256px PNG.
const icoPng = await (await square(256, transparent)).toBuffer();
await writeFile(join(root, "src", "app", "favicon.ico"), pngToIco(icoPng, 256));

console.log("favicon assets generated: icon.png, apple-icon.png, favicon.ico");
