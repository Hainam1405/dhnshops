import { cache } from "react";
import { isSanityConfigured } from "@/sanity/env";
import * as sanity from "@/lib/sanity/queries";
import { listCategories, listProducts } from "@/lib/admin/store";
import type { Category, Product } from "@/lib/types";

/**
 * Single data-access layer for the storefront.
 *
 * - No Sanity project configured  -> serves the local seed catalog.
 * - Sanity project configured      -> reads live data from Sanity.
 *
 * Every page/component uses only the exported helpers below, so switching data
 * sources requires no changes anywhere else.
 */

const allProducts = cache(async (): Promise<Product[]> => {
  if (isSanityConfigured) {
    try {
      const data = await sanity.getAllProducts();
      if (data.length) return data;
    } catch {
      // Fall through to the local catalog if Sanity is unreachable.
    }
  }
  return listProducts();
});

const allCategories = cache(async (): Promise<Category[]> => {
  if (isSanityConfigured) {
    try {
      const data = await sanity.getCategories();
      if (data.length) return data;
    } catch {
      // Fall through to the local catalog.
    }
  }
  return listCategories();
});

export async function getAllProducts(): Promise<Product[]> {
  return allProducts();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return (await allProducts()).find((p) => p.slug === slug) ?? null;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  return (await allProducts()).filter((p) => p.category === slug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return (await allProducts()).filter((p) => p.featured);
}

export async function getBestsellers(limit = 8): Promise<Product[]> {
  const ranked = [...(await allProducts())].sort(
    (a, b) =>
      Number(b.badges.includes("Bestseller")) - Number(a.badges.includes("Bestseller")) ||
      b.rating - a.rating,
  );
  return ranked.slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  return allCategories();
}

export async function getCategory(slug: string): Promise<Category | null> {
  return (await allCategories()).find((c) => c.slug === slug) ?? null;
}

export async function getRelatedProducts(
  slug: string,
  category: string,
  limit = 4,
): Promise<Product[]> {
  const all = await allProducts();
  const sameCategory = all.filter((p) => p.slug !== slug && p.category === category);
  const rest = all.filter((p) => p.slug !== slug && p.category !== category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export async function getAllProductSlugs(): Promise<string[]> {
  return (await allProducts()).map((p) => p.slug);
}
