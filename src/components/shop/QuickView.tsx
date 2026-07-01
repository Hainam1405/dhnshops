"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/store/cart";
import { StarRating } from "@/components/ui/StarRating";
import { CheckIcon, CloseIcon } from "@/components/ui/icons";

/**
 * Compact quick-view modal — pick a colorway + size and add to bag without
 * leaving the grid. Links through to the full PDP for details.
 */
export function QuickView({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const [colorIndex, setColorIndex] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);

  const activeColor = product.colors[colorIndex] ?? product.colors[0];
  const image = activeColor?.images[0] ?? product.images[0];
  const inStockCount = product.sizes.filter((s) => s.inStock).length;

  function handleAdd() {
    const chosen = size ?? product.sizes.find((s) => s.inStock)?.label;
    if (!chosen) return;
    add({
      productId: product._id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      image,
      color: activeColor?.name ?? "Default",
      size: chosen,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[85] bg-fg/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.35 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view — ${product.title}`}
            className="fixed left-1/2 top-1/2 z-[86] w-[94vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-line bg-surface shadow-lift"
          >
            <div className="grid sm:grid-cols-2">
              <div className="relative aspect-[4/5] bg-base">
                <Image
                  src={image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 94vw, 24rem"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="display text-2xl leading-none">{product.title}</h2>
                  <button type="button" onClick={onClose} aria-label="Close quick view">
                    <CloseIcon width={22} height={22} />
                  </button>
                </div>

                <div className="mt-3">
                  <StarRating rating={product.rating} count={product.reviewCount} />
                </div>

                <p className="mt-3 text-lg font-medium">{formatPrice(product.price)}</p>
                <p className="mt-3 text-sm text-muted">{product.shortDescription}</p>

                {/* colorways */}
                {product.colors.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {product.colors.map((c, i) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setColorIndex(i)}
                        aria-label={c.name}
                        className={cn(
                          "h-8 w-8 rounded-full border-2 p-0.5 transition-colors",
                          i === colorIndex ? "border-accent" : "border-line hover:border-line-strong",
                        )}
                      >
                        <span
                          className="block h-full w-full rounded-full border border-line"
                          style={{ backgroundColor: c.hex }}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* sizes */}
                <div className="mt-4 grid grid-cols-6 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      disabled={!s.inStock}
                      onClick={() => setSize(s.label)}
                      className={cn(
                        "h-10 rounded-lg border text-sm transition-colors",
                        !s.inStock && "cursor-not-allowed text-muted line-through opacity-40",
                        size === s.label
                          ? "border-accent bg-accent text-accent-ink"
                          : "border-line hover:border-line-strong",
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {inStockCount > 0 && inStockCount <= 2 && (
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-danger">
                    Low stock — selling fast
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleAdd}
                  className={cn(
                    "mt-5 flex h-12 items-center justify-center gap-2 rounded-full font-mono text-xs uppercase tracking-widest transition-colors active:scale-[0.98]",
                    added ? "bg-accent text-accent-ink" : "bg-fg text-accent-ink hover:bg-accent",
                  )}
                >
                  {added ? (
                    <>
                      <CheckIcon width={16} height={16} /> Added to bag
                    </>
                  ) : (
                    "Add to bag"
                  )}
                </button>

                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="mt-3 text-center font-mono text-[11px] uppercase tracking-widest text-muted hover:text-fg"
                >
                  View full details →
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
