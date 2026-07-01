"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import type { Product } from "@/lib/types";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/store/cart";
import { StarRating } from "@/components/ui/StarRating";
import { QuickView } from "@/components/shop/QuickView";
import { EyeIcon, PlusIcon } from "@/components/ui/icons";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [hover, setHover] = useState(false);
  const [added, setAdded] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const add = useCart((s) => s.add);

  const primary = product.images[0];
  const secondary = product.images[1] ?? primary;
  const discount = discountPercent(product.price, product.compareAtPrice);

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes.find((s) => s.inStock)?.label ?? product.sizes[0]?.label ?? "M";
    const color = product.colors[0];
    add({
      productId: product._id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: color?.images[0] ?? primary,
      color: color?.name ?? "Default",
      size,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <>
    <Link
      href={`/products/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:shadow-lift">
        {/* badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {product.badges.map((b) => (
            <span
              key={b}
              className="rounded-full bg-base/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-fg backdrop-blur"
            >
              {b}
            </span>
          ))}
          {discount > 0 && (
            <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent-ink">
              -{discount}%
            </span>
          )}
        </div>

        {/* quick view */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setQuickOpen(true);
          }}
          aria-label="Quick view"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-base/80 text-fg opacity-0 backdrop-blur transition-opacity duration-300 hover:bg-accent hover:text-accent-ink group-hover:opacity-100"
        >
          <EyeIcon width={16} height={16} />
        </button>

        {/* images */}
        <Image
          src={primary}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          priority={priority}
          className={cn(
            "object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            hover ? "scale-105 opacity-0" : "scale-100 opacity-100",
          )}
        />
        <Image
          src={secondary}
          alt=""
          aria-hidden
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={cn(
            "object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            hover ? "scale-100 opacity-100" : "scale-110 opacity-0",
          )}
        />

        {/* quick add */}
        <motion.button
          type="button"
          onClick={quickAdd}
          initial={false}
          animate={{ y: hover || added ? 0 : 12, opacity: hover || added ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "absolute inset-x-3 bottom-3 z-10 flex h-11 items-center justify-center gap-2 rounded-full font-mono text-[11px] uppercase tracking-widest backdrop-blur transition-colors active:scale-[0.98]",
            added
              ? "bg-accent text-accent-ink"
              : "bg-fg/95 text-accent-ink hover:bg-accent",
          )}
        >
          {added ? (
            "Added ✓"
          ) : (
            <>
              <PlusIcon width={15} height={15} />
              Quick add
            </>
          )}
        </motion.button>
      </div>

      {/* meta */}
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium tracking-tight">{product.title}</h3>
          <div className="mt-1">
            <StarRating rating={product.rating} count={product.reviewCount} />
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">{formatPrice(product.price)}</div>
          {product.compareAtPrice && (
            <div className="text-xs text-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </div>
          )}
        </div>
      </div>

      {/* colorways */}
      <div className="mt-2 flex items-center gap-1.5">
        {product.colors.map((c) => (
          <span
            key={c.name}
            title={c.name}
            className="h-3 w-3 rounded-full border border-line-strong"
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>
    </Link>
    <QuickView product={product} open={quickOpen} onClose={() => setQuickOpen(false)} />
    </>
  );
}
