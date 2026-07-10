import type { MetadataRoute } from "next";
import { getAllProductSlugs, getCategories } from "@/lib/products";
import { LEGAL_DOCS } from "@/lib/legal";

const BASE = "https://dhnshops.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, categories] = await Promise.all([getAllProductSlugs(), getCategories()]);

  return [
    { url: BASE, priority: 1 },
    { url: `${BASE}/shop`, priority: 0.9 },
    ...categories.map((c) => ({ url: `${BASE}/collections/${c.slug}`, priority: 0.8 })),
    ...slugs.map((s) => ({ url: `${BASE}/products/${s}`, priority: 0.7 })),
    ...LEGAL_DOCS.map((d) => ({ url: `${BASE}/legal/${d.slug}`, priority: 0.3 })),
  ];
}
