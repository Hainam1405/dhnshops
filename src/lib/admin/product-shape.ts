import type { Product, ProductColor, ProductSize } from "@/lib/types";

/**
 * Shared product-shape helpers used by BOTH the file store and the database
 * store, so an admin edit assembles the exact same document regardless of where
 * it is persisted.
 */

export type ProductInput = {
  title: string;
  shortDescription?: string;
  description?: string;
  price: number; // cents
  compareAtPrice?: number | null;
  category: string;
  badges?: string[];
  featured?: boolean;
  tags?: string[];
  printLocations?: string[];
  sizes?: ProductSize[];
  colors?: ProductColor[];
  images?: string[];
};

export function defaultSizes(): ProductSize[] {
  return ["XS", "S", "M", "L", "XL", "2XL"].map((label) => ({ label, inStock: true }));
}

/** Build a full Product document from admin input, preserving stable fields. */
export function assemble(input: ProductInput, existing?: Product): Product {
  const images =
    input.images && input.images.length
      ? input.images
      : (input.colors?.flatMap((c) => c.images) ?? []);

  return {
    _id: existing?._id ?? "",
    slug: existing?.slug ?? "",
    title: input.title,
    shortDescription: input.shortDescription ?? "",
    description: input.description ?? "",
    price: input.price,
    compareAtPrice: input.compareAtPrice ?? undefined,
    images,
    colors: input.colors ?? [],
    sizes: input.sizes?.length ? input.sizes : defaultSizes(),
    category: input.category,
    tags: input.tags ?? [],
    printLocations: input.printLocations?.length ? input.printLocations : ["Front", "Back"],
    badges: input.badges ?? [],
    featured: Boolean(input.featured),
    gelatoProductUid: existing?.gelatoProductUid ?? "",
    rating: existing?.rating ?? 0,
    reviewCount: existing?.reviewCount ?? 0,
    reviews: existing?.reviews ?? [],
  };
}
