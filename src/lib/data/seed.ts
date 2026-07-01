import type { Category, Product, ProductColor, ProductSize, Review } from "@/lib/types";

/**
 * Seed catalog. Images are on-brand placeholders (placehold.co) so the
 * storefront renders immediately with zero external accounts. Replace these
 * with real Gelato mockups once you upload products through Sanity.
 */

const BG = "0d0f16";
const FG = "d8ff47";

function img(text: string, bg = BG, fg = FG) {
  return `https://placehold.co/1200x1500/${bg}/${fg}/png?text=${encodeURIComponent(
    text,
  )}&font=montserrat`;
}

type Pal = { name: string; hex: string; bg: string; fg: string };
const P = {
  black: { name: "Void Black", hex: "#0d0f16", bg: "0d0f16", fg: "d8ff47" },
  bone: { name: "Bone", hex: "#e8e4d8", bg: "e8e4d8", fg: "10130a" },
  acid: { name: "Acid", hex: "#d8ff47", bg: "d8ff47", fg: "10130a" },
  cobalt: { name: "Cobalt", hex: "#2d4bff", bg: "2d4bff", fg: "f4f4f2" },
  rust: { name: "Rust", hex: "#b5532a", bg: "b5532a", fg: "f4f4f2" },
  slate: { name: "Slate", hex: "#4a4f5c", bg: "4a4f5c", fg: "f4f4f2" },
} satisfies Record<string, Pal>;

function colorway(p: Pal, title: string): ProductColor {
  return {
    name: p.name,
    hex: p.hex,
    images: [img(`${title}\n${p.name}`, p.bg, p.fg), img(`${title}\nback`, p.bg, p.fg)],
  };
}

function sizes(oos: string[] = []): ProductSize[] {
  return ["XS", "S", "M", "L", "XL", "2XL"].map((label) => ({
    label,
    inStock: !oos.includes(label),
  }));
}

const REVIEW_POOL: Omit<Review, "id">[] = [
  {
    author: "Maya R.",
    rating: 5,
    text: "Heavyweight cotton, the print is razor sharp. Fits true to size and the color is exactly as shown.",
    verified: true,
    date: "2026-05-18",
    photo: img("Customer\nphoto", "14171f", "8a8c99"),
  },
  {
    author: "Dorian K.",
    rating: 5,
    text: "Shipped from a hub near me in 4 days. Quality is way above what I expected for print-on-demand.",
    verified: true,
    date: "2026-05-02",
  },
  {
    author: "Priya S.",
    rating: 4,
    text: "Love the oversized fit. Took one star off only because I wanted more colorways.",
    verified: true,
    date: "2026-04-21",
  },
  {
    author: "Leo M.",
    rating: 5,
    text: "The 3D preview matched the real thing perfectly. Buying two more.",
    verified: true,
    date: "2026-06-09",
    photo: img("Customer\nphoto", "14171f", "8a8c99"),
  },
];

function reviews(seed: number, count: number): Review[] {
  return Array.from({ length: count }, (_, i) => {
    const base = REVIEW_POOL[(seed + i) % REVIEW_POOL.length];
    return { ...base, id: `rev-${seed}-${i}` };
  });
}

function rating(list: Review[]) {
  if (!list.length) return { rating: 0, reviewCount: 0 };
  const avg = list.reduce((s, r) => s + r.rating, 0) / list.length;
  return { rating: Math.round(avg * 10) / 10, reviewCount: list.length };
}

export const categories: Category[] = [
  {
    slug: "tees",
    title: "Tees",
    description: "Heavyweight cotton canvases for the everyday.",
    heroImage: img("TEES", "0d0f16", "d8ff47"),
  },
  {
    slug: "hoodies",
    title: "Hoodies & Crews",
    description: "Structured fleece, built for the long night.",
    heroImage: img("HOODIES", "14171f", "7b5cff"),
  },
  {
    slug: "limited",
    title: "Limited Drops",
    description: "Numbered runs. When they're gone, they're gone.",
    heroImage: img("LIMITED", "10130a", "d8ff47"),
  },
];

type Def = {
  slug: string;
  title: string;
  short: string;
  desc: string;
  price: number;
  compareAt?: number;
  category: string;
  colors: Pal[];
  oos?: string[];
  badges: string[];
  featured?: boolean;
  tags: string[];
  reviewSeed: number;
  reviewCount: number;
};

const DEFS: Def[] = [
  {
    slug: "null-vector-tee",
    title: "Null Vector Tee",
    short: "Front + back print on 240gsm organic cotton.",
    desc: "A study in negative space. The Null Vector runs an oversized boxy fit with a dropped shoulder, printed edge-to-edge using water-based DTG for a soft hand-feel that lasts wash after wash.",
    price: 3200,
    compareAt: 3900,
    category: "tees",
    colors: [P.black, P.bone, P.slate, P.acid],
    badges: ["Bestseller"],
    featured: true,
    tags: ["oversized", "unisex", "front-back"],
    reviewSeed: 0,
    reviewCount: 4,
  },
  {
    slug: "event-horizon-hoodie",
    title: "Event Horizon Hoodie",
    short: "400gsm brushed fleece, double-lined hood.",
    desc: "Built around a gravitational bloom graphic that wraps from chest to sleeve. Heavyweight fleece with a relaxed fit, ribbed cuffs and a kangaroo pocket.",
    price: 6400,
    compareAt: 7400,
    category: "hoodies",
    colors: [P.black, P.slate, P.cobalt],
    oos: ["XS"],
    badges: ["Bestseller"],
    featured: true,
    tags: ["heavyweight", "unisex"],
    reviewSeed: 1,
    reviewCount: 3,
  },
  {
    slug: "chromatic-drift-tee",
    title: "Chromatic Drift Tee",
    short: "All-over sublimation gradient.",
    desc: "A dye-sublimated spectrum that shifts as you move. Slim regular fit on a lightweight poly-blend engineered for all-over print.",
    price: 3400,
    category: "tees",
    colors: [P.cobalt, P.rust, P.acid],
    badges: ["New"],
    featured: true,
    tags: ["all-over", "gradient"],
    reviewSeed: 2,
    reviewCount: 2,
  },
  {
    slug: "liminal-space-longsleeve",
    title: "Liminal Space Longsleeve",
    short: "Sleeve-print long sleeve, 220gsm.",
    desc: "Corridor typography running down both sleeves. Mid-weight combed cotton with a classic fit and ribbed cuffs.",
    price: 3800,
    category: "tees",
    colors: [P.black, P.bone],
    oos: ["2XL"],
    badges: [],
    tags: ["longsleeve", "sleeve-print"],
    reviewSeed: 3,
    reviewCount: 2,
  },
  {
    slug: "signal-lost-hoodie",
    title: "Signal Lost Hoodie",
    short: "Numbered run of 300. Glitch embroidery.",
    desc: "A limited embroidered piece — no two stitch-outs are identical. Premium 450gsm fleece with a boxy cropped fit.",
    price: 8200,
    category: "hoodies",
    colors: [P.black, P.rust],
    badges: ["Limited"],
    featured: true,
    tags: ["limited", "embroidery"],
    reviewSeed: 1,
    reviewCount: 4,
  },
  {
    slug: "photon-wash-tee",
    title: "Photon Wash Tee",
    short: "Garment-dyed, vintage soft.",
    desc: "Pigment garment-dye gives every tee a one-off faded wash. Relaxed fit, 200gsm ring-spun cotton.",
    price: 3000,
    category: "tees",
    colors: [P.bone, P.slate, P.rust],
    badges: [],
    tags: ["garment-dye", "vintage"],
    reviewSeed: 2,
    reviewCount: 3,
  },
  {
    slug: "deep-field-crewneck",
    title: "Deep Field Crewneck",
    short: "Structured 380gsm crew sweatshirt.",
    desc: "A star-field back panel print on a clean crewneck. Heavyweight loopback cotton with set-in sleeves.",
    price: 5800,
    compareAt: 6600,
    category: "hoodies",
    colors: [P.black, P.bone, P.cobalt],
    badges: ["Bestseller"],
    tags: ["crewneck", "back-print"],
    reviewSeed: 0,
    reviewCount: 3,
  },
  {
    slug: "ghost-protocol-tee",
    title: "Ghost Protocol Tee",
    short: "Glow-reactive ink, numbered run of 500.",
    desc: "A photo-reactive print that shifts under UV. Numbered limited run on 240gsm heavyweight cotton, boxy fit.",
    price: 3600,
    category: "limited",
    colors: [P.black, P.acid],
    oos: ["S"],
    badges: ["Limited", "New"],
    featured: true,
    tags: ["limited", "reactive"],
    reviewSeed: 3,
    reviewCount: 4,
  },
];

export const products: Product[] = DEFS.map((d) => {
  const colors = d.colors.map((c) => colorway(c, d.title));
  const rv = reviews(d.reviewSeed, d.reviewCount);
  const galleryDetail = img(`${d.title}\ndetail`, "14171f", "8a8c99");
  return {
    _id: d.slug,
    slug: d.slug,
    title: d.title,
    shortDescription: d.short,
    description: d.desc,
    price: d.price,
    compareAtPrice: d.compareAt,
    images: [...colors[0].images, galleryDetail],
    colors,
    sizes: sizes(d.oos),
    category: d.category,
    tags: d.tags,
    printLocations: d.tags.includes("all-over")
      ? ["All-over"]
      : d.tags.includes("sleeve-print")
        ? ["Sleeves"]
        : ["Front", "Back"],
    badges: d.badges,
    featured: Boolean(d.featured),
    gelatoProductUid: "", // fill in when Gelato is connected
    reviews: rv,
    ...rating(rv),
  };
});
