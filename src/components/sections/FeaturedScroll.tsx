"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { gsap } from "@/lib/animation/gsap";
import { usePrefersReducedMotion } from "@/lib/animation/useReducedMotion";
import { formatPrice } from "@/lib/utils";
import { ArrowIcon } from "@/components/ui/icons";

/**
 * Pinned horizontal-scroll gallery on desktop; native horizontal swipe on
 * mobile or when reduced motion is requested.
 */
export function FeaturedScroll({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;
    if (reduced || window.innerWidth < 768) return;

    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - container.offsetWidth;
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden md:h-screen md:min-h-[700px]"
    >
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto px-5 py-16 md:h-full md:items-center md:overflow-visible md:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* intro panel */}
        <div className="flex w-[78vw] shrink-0 flex-col justify-center md:w-[36rem]">
          <p className="eyebrow">Featured drop</p>
          <h2 className="display mt-4 text-6xl leading-none md:text-8xl">
            The<br />collection
          </h2>
          <p className="mt-6 max-w-sm text-muted">
            A curated run of our most-loved pieces. Scroll sideways to browse the drop.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent"
          >
            Shop everything <ArrowIcon width={16} height={16} />
          </Link>
        </div>

        {/* product panels */}
        {products.map((p, i) => (
          <Link
            key={p._id}
            href={`/products/${p.slug}`}
            className="group relative w-[78vw] shrink-0 md:w-[30rem]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
              <Image
                src={p.images[0]}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 78vw, 30rem"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
              <span className="absolute right-4 top-4 font-mono text-xs text-fg/70">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium tracking-tight">{p.title}</h3>
                <p className="text-sm text-muted">{p.shortDescription}</p>
              </div>
              <span className="text-sm font-medium">{formatPrice(p.price)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
