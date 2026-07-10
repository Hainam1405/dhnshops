/**
 * Central brand + storefront configuration.
 * Change the brand name, currency and thresholds here — everything reads from this.
 */
export const SITE = {
  name: "DHN Shop",
  // Describe the catalogue that actually exists. Payment providers compare the
  // site's description against the goods before approving an account.
  tagline: "Graphic tees, printed to order.",
  description:
    "DHN Shop is a print-on-demand apparel studio. Graphic tees — wildlife, cats, comedy and seasonal drops — printed when you order and shipped from the hub nearest you.",
  currency: "USD",
  /** Free shipping threshold, in USD cents. */
  freeShippingThreshold: 7500,
  /** Flat shipping fee charged below the free-shipping threshold, in USD cents. */
  flatShipping: 700,
  email: "hello@dhnshops.com",
  social: {
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
    twitter: "https://x.com",
  },
} as const;

/**
 * Trading identity printed on the policy pages.
 *
 * Payment providers (Stripe, PayPal) review these pages before approving an
 * account: they require a real trading name and a verifiable postal address.
 * `address` renders only when non-empty — FILL IT IN BEFORE TAKING PAYMENTS.
 */
export const BUSINESS: {
  legalName: string;
  address: string;
  country: string;
  supportEmail: string;
  /** Advertised support response time, in hours. */
  responseHours: number;
} = {
  legalName: "DHN Shop",
  address: "", // e.g. "12 Nguyen Trai, Thanh Xuan, Hanoi, Vietnam"
  country: "Vietnam",
  supportEmail: SITE.email,
  responseHours: 48,
};

/** Primary navigation links. */
export const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Graphic Tees", href: "/collections/tees" },
  { label: "Halloween & Holiday", href: "/collections/seasonal" },
  { label: "Fan & Bootleg", href: "/collections/bootleg" },
] as const;
