import { IMAGE_QUALITY, MAX_IMAGE_EDGE } from "./upload";

/**
 * Re-encode an image to a web-sized WebP before it leaves the browser.
 *
 * Two reasons, both load-bearing:
 *  - the upload route cannot receive a full-size photo (see ./upload);
 *  - images.unoptimized is on, so this exact file is what every shopper
 *    downloads. A 6MB original would be served to them as a 6MB original.
 *
 * Returns the original file untouched whenever re-encoding would not help, so an
 * already-small PNG is never needlessly transcoded. Requires a DOM: only call it
 * from the browser.
 */
export async function shrinkImage(file: File): Promise<File> {
  // Canvas keeps only the first frame of an animated GIF, which would quietly
  // destroy it. Leave GIFs alone and let the caller's size check judge them.
  if (file.type === "image/gif") return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file; // undecodable here; the server rejects it with a message
  }

  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // WebP rather than JPEG: it keeps the alpha channel, so a cut-out garment on a
  // transparent background does not gain a black box.
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", IMAGE_QUALITY),
  );
  if (!blob || blob.size >= file.size) return file;

  return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" });
}
