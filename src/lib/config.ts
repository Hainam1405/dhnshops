/**
 * Central brand + storefront configuration.
 * Change the brand name, currency and thresholds here — everything reads from this.
 */
export const SITE = {
  name: "DHN Shop",
  tagline: "Wearable objects from the near future.",
  description:
    "DHN Shop is a print-on-demand apparel studio. Immersive designs, printed on demand and shipped from the hub nearest you.",
  currency: "USD",
  /** Free shipping threshold, in USD cents. */
  freeShippingThreshold: 7500,
  email: "hello@aether.studio",
  social: {
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
    twitter: "https://x.com",
  },
} as const;

/** Primary navigation links. */
export const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Tees", href: "/collections/tees" },
  { label: "Hoodies", href: "/collections/hoodies" },
  { label: "Drops", href: "/collections/limited" },
] as const;
