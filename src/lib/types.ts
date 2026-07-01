/** Domain types shared by the seed data layer and (later) Sanity. */

export type ProductColor = {
  name: string;
  hex: string;
  /** Gallery images for this colorway. First is the primary. */
  images: string[];
};

export type ProductSize = {
  label: string;
  inStock: boolean;
};

export type Review = {
  id: string;
  author: string;
  rating: number; // 1-5
  text: string;
  photo?: string;
  verified: boolean;
  date: string; // ISO
};

export type Product = {
  _id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  /** Integer USD cents. */
  price: number;
  compareAtPrice?: number;
  images: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  category: string; // category slug
  tags: string[];
  printLocations: string[];
  badges: string[]; // "New" | "Bestseller" | "Limited"
  featured: boolean;
  /** Optional .glb for the PDP 3D configurator (from Sanity later). */
  model3d?: string;
  /** Gelato product UID — left empty until Gelato is wired up. */
  gelatoProductUid?: string;
  rating: number;
  reviewCount: number;
  reviews?: Review[];
};

export type Category = {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
};

/** A concrete line item the cart works with. */
export type CartItem = {
  key: string; // productId + color + size
  productId: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
};
