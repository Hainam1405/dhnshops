/**
 * Recompress the product mockups in public/products.
 *
 * We serve these straight from the CDN (next.config.ts sets images.unoptimized,
 * because Vercel's Hobby image optimizer is capped), so the source file IS what
 * every visitor downloads. Keeping them lean is now our job, not the platform's.
 *
 * Resizes the long edge to MAX_EDGE and re-encodes as progressive mozjpeg.
 * Writes to a temp dir first, and only replaces an original when the new file is
 * actually smaller — so re-running this is safe and never inflates an image.
 *
 *   node scripts/compress-product-images.mjs           # apply
 *   node scripts/compress-product-images.mjs --dry-run # report only
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const DIR = path.join(process.cwd(), "public", "products");
const TMP = path.join(process.cwd(), ".image-compress-tmp");
const MAX_EDGE = 1100; // grid renders ~500px; the PDP never needs more than this
const QUALITY = 80;

const dryRun = process.argv.includes("--dry-run");
const kb = (bytes) => Math.round(bytes / 1024);

const files = (await fs.readdir(DIR)).filter((f) => /\.jpe?g$/i.test(f)).sort();
if (files.length === 0) {
  console.error(`No JPEGs found in ${DIR}`);
  process.exit(1);
}

await fs.mkdir(TMP, { recursive: true });

let before = 0;
let after = 0;
let replaced = 0;

for (const file of files) {
  const src = path.join(DIR, file);
  const tmp = path.join(TMP, file);

  const originalSize = (await fs.stat(src)).size;
  const meta = await sharp(src).metadata();

  await sharp(src)
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
    .toFile(tmp);

  const newSize = (await fs.stat(tmp)).size;
  const smaller = newSize < originalSize;

  before += originalSize;
  after += smaller ? newSize : originalSize;

  const newMeta = await sharp(tmp).metadata();
  const verdict = smaller ? `-${Math.round((1 - newSize / originalSize) * 100)}%` : "kept original";

  console.log(
    `${file.padEnd(38)} ${String(meta.width).padStart(4)}x${String(meta.height).padEnd(4)} ` +
      `${String(kb(originalSize)).padStart(4)}KB -> ${String(kb(newSize)).padStart(4)}KB ` +
      `(${newMeta.width}x${newMeta.height})  ${verdict}`,
  );

  if (smaller && !dryRun) {
    await fs.rename(tmp, src);
    replaced += 1;
  }
}

await fs.rm(TMP, { recursive: true, force: true });

console.log(
  `\n${dryRun ? "[dry run] " : ""}total ${kb(before)}KB -> ${kb(after)}KB ` +
    `(-${Math.round((1 - after / before) * 100)}%), ${replaced} file(s) replaced`,
);
