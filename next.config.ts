import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Serve images as-is instead of routing them through /_next/image.
     *
     * Vercel's Hobby plan caps Image Optimization transformations; once the cap
     * is hit every /_next/image request answers 402 and each <Image> renders as
     * a blank box. The product mockups in /public/products are already sized and
     * compressed for the grid, so optimization buys little here — serving them
     * straight from the CDN is free, unmetered, and cannot break.
     *
     * Re-enable (delete this line) only alongside a paid plan.
     */
    unoptimized: true,
    remotePatterns: [
      // Sanity image CDN (used once a Sanity project is connected).
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Vercel Blob — admin image uploads in production.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
