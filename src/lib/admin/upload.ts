/**
 * Shared limits for admin image uploads. Imported by both the browser uploader
 * and the route handler so the two can never disagree about what fits.
 *
 * Three ceilings sit above this route, and the lowest one wins:
 *
 *  1. Vercel caps a function's request body at ~4.5MB. Exceed it and the upload
 *     never reaches our code.
 *  2. `src/proxy.ts` matches /api/admin/:path*, so Next buffers the body to let
 *     both the proxy and the route read it. Past `proxyClientMaxBodySize`
 *     (10MB by default) it keeps only the first 10MB and does NOT fail the
 *     request — the multipart boundary is lost and formData() throws.
 *  3. Blob itself accepts far more than either, so it is never the constraint.
 *
 * MAX_UPLOAD_BYTES sits under all of them. The browser shrinks every image well
 * below it before sending, so this is a backstop, not the working limit.
 */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

/** Rejected before we even try to decode it — a guard against a 200MB drop. */
export const MAX_SOURCE_BYTES = 40 * 1024 * 1024;

/**
 * Longest edge kept when re-encoding. `next.config.ts` sets images.unoptimized,
 * so the file staff upload is byte-for-byte the file every shopper downloads —
 * an unshrunk photo is a page-weight bug, not just a storage one. 1600px covers
 * the largest slot in the PDP gallery on a 2x display.
 */
export const MAX_IMAGE_EDGE = 1600;

/** WebP at this quality is visually lossless for garment photography. */
export const IMAGE_QUALITY = 0.85;

export const MAX_UPLOAD_MB = Math.round(MAX_UPLOAD_BYTES / 1024 / 1024);
