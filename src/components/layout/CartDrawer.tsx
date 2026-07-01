"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { SITE } from "@/lib/config";
import type { Product } from "@/lib/types";
import { selectSubtotal, useCart } from "@/lib/store/cart";
import { cn, formatPrice } from "@/lib/utils";
import { BagIcon, CloseIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";

export function CartDrawer({ suggestions = [] }: { suggestions?: Product[] }) {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const add = useCart((s) => s.add);
  const subtotal = useCart(selectSubtotal);

  const remaining = Math.max(0, SITE.freeShippingThreshold - subtotal);
  const progress = Math.min(1, subtotal / SITE.freeShippingThreshold || 0);
  const suggestion = suggestions.find((p) => !items.some((i) => i.productId === p._id));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[70] bg-fg/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-[71] flex h-full w-full max-w-[440px] flex-col border-l border-line bg-base/95 shadow-lift backdrop-blur-xl"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-mono text-xs uppercase tracking-widest">
                Your bag ({items.reduce((n, i) => n + i.quantity, 0)})
              </h2>
              <button type="button" onClick={close} aria-label="Close cart">
                <CloseIcon width={22} height={22} />
              </button>
            </div>

            {/* free shipping progress */}
            {items.length > 0 && (
              <div className="border-b border-line px-6 py-4">
                <p className="text-xs text-muted">
                  {remaining > 0 ? (
                    <>
                      You&rsquo;re <span className="text-fg">{formatPrice(remaining)}</span> away from
                      free shipping
                    </>
                  ) : (
                    <span className="text-accent">You&rsquo;ve unlocked free shipping ✦</span>
                  )}
                </p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2">
                  <motion.div
                    className="h-full bg-accent"
                    initial={false}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* items */}
            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <BagIcon width={40} height={40} className="text-muted" />
                  <p className="text-sm text-muted">Your bag is empty.</p>
                  <Link
                    href="/shop"
                    onClick={close}
                    className="font-mono text-xs uppercase tracking-widest text-accent"
                  >
                    Start shopping →
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  {items.map((item) => (
                    <li key={item.key} className="flex gap-4 py-5">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-surface">
                        <Image src={item.image} alt={item.title} fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex justify-between gap-2">
                          <div>
                            <Link
                              href={`/products/${item.slug}`}
                              onClick={close}
                              className="text-sm font-medium hover:text-accent"
                            >
                              {item.title}
                            </Link>
                            <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-muted">
                              {item.color} · {item.size}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(item.key)}
                            aria-label="Remove item"
                            className="text-muted hover:text-danger"
                          >
                            <CloseIcon width={16} height={16} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 rounded-full border border-line px-2 py-1">
                            <button
                              type="button"
                              onClick={() => setQty(item.key, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <MinusIcon width={14} height={14} />
                            </button>
                            <span className="w-4 text-center font-mono text-xs">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => setQty(item.key, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <PlusIcon width={14} height={14} />
                            </button>
                          </div>
                          <span className="text-sm">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* upsell */}
              {items.length > 0 && suggestion && (
                <div className="my-5 rounded-xl border border-line p-3">
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted">
                    Complete the fit
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-surface">
                      <Image
                        src={suggestion.images[0]}
                        alt={suggestion.title}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{suggestion.title}</p>
                      <p className="text-xs text-muted">{formatPrice(suggestion.price)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        add({
                          productId: suggestion._id,
                          slug: suggestion.slug,
                          title: suggestion.title,
                          price: suggestion.price,
                          image: suggestion.colors[0]?.images[0] ?? suggestion.images[0],
                          color: suggestion.colors[0]?.name ?? "Default",
                          size: suggestion.sizes.find((s) => s.inStock)?.label ?? "M",
                        })
                      }
                      className="rounded-full border border-line-strong px-4 py-2 font-mono text-[10px] uppercase tracking-widest hover:border-accent hover:text-accent"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* footer / checkout */}
            {items.length > 0 && (
              <div className="border-t border-line px-6 py-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="text-base font-medium">{formatPrice(subtotal)}</span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Taxes & shipping calculated at checkout.
                </p>
                <Link
                  href="/cart"
                  onClick={close}
                  className="mt-4 flex h-13 w-full items-center justify-center rounded-full bg-accent py-4 font-mono text-xs uppercase tracking-widest text-accent-ink transition-colors hover:bg-fg"
                >
                  Checkout
                </Link>
                <button
                  type="button"
                  onClick={close}
                  className="mt-2 w-full text-center font-mono text-[11px] uppercase tracking-widest text-muted hover:text-fg"
                >
                  Continue shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
