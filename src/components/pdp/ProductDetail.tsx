"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductGallery } from "./ProductGallery";
import { BuyBox } from "./BuyBox";
import { Reviews } from "./Reviews";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { SectionHeading } from "@/components/sections/SectionHeading";

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const [colorIndex, setColorIndex] = useState(0);
  const activeColor = product.colors[colorIndex] ?? product.colors[0];
  const detail = product.images[product.images.length - 1];

  const galleryImages = useMemo(() => {
    const imgs = [...(activeColor?.images ?? [])];
    if (detail && !imgs.includes(detail)) imgs.push(detail);
    return imgs.length ? imgs : product.images;
  }, [activeColor, detail, product.images]);

  return (
    <div className="mx-auto max-w-[1400px] px-5 pt-10 md:px-8">
      <nav className="font-mono text-[11px] uppercase tracking-widest text-muted">
        <Link href="/shop" className="hover:text-fg">
          Shop
        </Link>{" "}
        / <span className="text-fg">{product.title}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={galleryImages} tint={activeColor?.hex ?? "#0d0f16"} title={product.title} />
        <BuyBox
          product={product}
          colorIndex={colorIndex}
          setColorIndex={setColorIndex}
          activeColor={activeColor}
        />
      </div>

      <Reviews reviews={product.reviews ?? []} rating={product.rating} count={product.reviewCount} />

      {related.length > 0 && (
        <section className="py-16">
          <SectionHeading eyebrow="You might also like" title="Complete the drop" />
          <ProductGrid className="mt-10" products={related} />
        </section>
      )}
    </div>
  );
}
