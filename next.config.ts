import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // On-brand placeholder mockups used for the seed catalog.
      // Replace with real Gelato mockups uploaded through Sanity.
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      // Sanity image CDN (used once a Sanity project is connected).
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Vercel Blob — admin image uploads in production.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
