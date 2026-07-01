import type { Metadata } from "next";
import { getAllProducts, getCategories } from "@/lib/products";
import { ShopClient } from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the full print-on-demand apparel catalog.",
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()]);

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-14 md:px-8">
      <header className="mb-8">
        <p className="eyebrow">All products</p>
        <h1 className="display mt-3 text-5xl md:text-7xl">The catalog</h1>
      </header>
      <ShopClient products={products} categories={categories} />
    </div>
  );
}
