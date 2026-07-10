"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Product, ProductColor } from "@/lib/types";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import { SITE } from "@/lib/config";
import { useCart } from "@/lib/store/cart";
import { StarRating } from "@/components/ui/StarRating";
import { CheckIcon } from "@/components/ui/icons";
import { SizeGuide } from "./SizeGuide";

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium">{title}</span>
        <span className="text-muted">{open ? "–" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm leading-relaxed text-muted">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function BuyBox({
  product,
  colorIndex,
  setColorIndex,
  activeColor,
}: {
  product: Product;
  colorIndex: number;
  setColorIndex: (i: number) => void;
  activeColor: ProductColor;
}) {
  const [size, setSize] = useState<string | null>(null);
  const [needSize, setNeedSize] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  const add = useCart((s) => s.add);
  const anchorRef = useRef<HTMLDivElement>(null);
  const discount = discountPercent(product.price, product.compareAtPrice);
  const inStockCount = product.sizes.filter((s) => s.inStock).length;

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function handleAdd() {
    if (!size) {
      setNeedSize(true);
      return;
    }
    add({
      productId: product._id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: activeColor.images[0],
      color: activeColor.name,
      size,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="lg:py-4">
      {/* badges */}
      {product.badges.length > 0 && (
        <div className="mb-4 flex gap-2">
          {product.badges.map((b) => (
            <span
              key={b}
              className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted"
            >
              {b}
            </span>
          ))}
        </div>
      )}

      <h1 className="display text-4xl md:text-5xl">{product.title}</h1>

      <a href="#reviews" className="mt-3 inline-flex">
        <StarRating rating={product.rating} count={product.reviewCount} />
      </a>

      {/* price */}
      <div className="mt-5 flex items-center gap-3">
        <span className="text-2xl font-medium">{formatPrice(product.price)}</span>
        {product.compareAtPrice && (
          <>
            <span className="text-lg text-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
            <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest text-accent-ink">
              Save {discount}%
            </span>
          </>
        )}
      </div>

      <p className="mt-5 max-w-md text-muted">{product.shortDescription}</p>

      {/* color */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
            Color — <span className="text-fg">{activeColor.name}</span>
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {product.colors.map((c, i) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColorIndex(i)}
              aria-label={c.name}
              className={cn(
                "h-9 w-9 rounded-full border-2 p-0.5 transition-colors",
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
      </div>

      {/* size */}
      <div className="mt-7">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
            Size {needSize && <span className="text-danger">— select one</span>}
          </span>
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="font-mono text-[11px] uppercase tracking-widest text-muted underline hover:text-fg"
          >
            Size guide
          </button>
        </div>
        <div className="mt-3 grid grid-cols-6 gap-2">
          {product.sizes.map((s) => (
            <button
              key={s.label}
              type="button"
              disabled={!s.inStock}
              onClick={() => {
                setSize(s.label);
                setNeedSize(false);
              }}
              className={cn(
                "h-11 rounded-lg border text-sm transition-colors",
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
            Low stock — only a few sizes left
          </p>
        )}
      </div>

      {/* add to cart */}
      <div ref={anchorRef} className="mt-8">
        <button
          type="button"
          onClick={handleAdd}
          className={cn(
            "flex h-14 w-full items-center justify-center gap-2 rounded-full font-mono text-xs uppercase tracking-widest transition-colors",
            added
              ? "bg-accent text-accent-ink"
              : "bg-fg text-accent-ink hover:bg-accent",
          )}
        >
          {added ? (
            <>
              <CheckIcon width={16} height={16} /> Added to bag
            </>
          ) : (
            <>Add to bag — {formatPrice(product.price)}</>
          )}
        </button>
        <p className="mt-3 text-center text-xs text-muted">
          Free shipping over {formatPrice(SITE.freeShippingThreshold)} · 30-day returns
        </p>
      </div>

      {/* details */}
      <div className="mt-8">
        <Accordion title="Details">{product.description}</Accordion>
        <Accordion title="Materials & print">
          Printed using water-based DTG on premium cotton. Print locations:{" "}
          {product.printLocations.join(", ")}.
        </Accordion>
        <Accordion title="Shipping & returns">
          Produced on demand at the hub nearest you and shipped in 2–5 business days. Not the right
          fit? Return within 30 days for a full refund.
        </Accordion>
      </div>

      <SizeGuide open={guideOpen} onClose={() => setGuideOpen(false)} />

      {/* sticky add-to-cart bar */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.35 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-base/90 backdrop-blur-xl"
          >
            <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-3 md:px-8">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{product.title}</p>
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                  {activeColor.name} {size ? `· ${size}` : ""} · {formatPrice(product.price)}
                </p>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                className="h-11 shrink-0 rounded-full bg-accent px-6 font-mono text-xs uppercase tracking-widest text-accent-ink hover:bg-fg"
              >
                {added ? "Added ✓" : "Add to bag"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
