export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

/**
 * When true, the storefront reads products from Sanity and /studio is live.
 * When false, everything falls back to the local seed catalog.
 */
export const isSanityConfigured = projectId.length > 0;
