"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/lib/animation/useReducedMotion";
import { SectionHeading } from "./SectionHeading";
import { ArrowIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export type StoryStep = {
  tag: string;
  title: string;
  body: string;
  image: string;
};

/**
 * Scroll-storytelling section in the NextSense feature-showcase style:
 * a sticky visual column that crossfades between step images while the copy
 * scrolls past it. Inactive step headings dim so the active one leads the eye.
 *
 * The sticky/crossfade layer is desktop-only; on mobile (and when reduced
 * motion is requested) each step renders its own image inline in a plain stack.
 */
export function BenefitStory({
  eyebrow,
  heading,
  steps,
  ctaHref = "/shop",
  ctaLabel = "Shop the range",
}: {
  eyebrow: string;
  heading: string;
  steps: StoryStep[];
  ctaHref?: string;
  ctaLabel?: string;
}) {
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.idx));
          }
        }
      },
      // Fire when a step crosses the middle band of the viewport.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    const els = stepRefs.current.filter(Boolean) as HTMLDivElement[];
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-8">
      <SectionHeading eyebrow={eyebrow} title={heading} />

      <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-16">
        {/* sticky, crossfading visual — desktop only */}
        <div className="hidden md:block">
          <div className="sticky top-24">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
              {steps.map((s, i) => (
                <Image
                  key={s.image}
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className={cn(
                    "object-cover transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    i === active ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
              <span className="absolute left-5 top-5 rounded-full border border-white/25 bg-black/30 px-3 py-1 font-mono text-[11px] tracking-widest text-white backdrop-blur-md">
                {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
              </span>
              {/* progress ticks */}
              <div className="absolute bottom-5 left-5 flex gap-1.5">
                {steps.map((s, i) => (
                  <span
                    key={s.tag}
                    className={cn(
                      "h-1 rounded-full transition-all duration-500",
                      i === active ? "w-8 bg-accent" : "w-3 bg-white/40",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* scrolling steps */}
        <div className="flex flex-col">
          {steps.map((s, i) => (
            <div
              key={s.tag}
              data-idx={i}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className="flex min-h-[62vh] flex-col justify-center md:min-h-[80vh]"
            >
              {/* inline image on mobile / reduced motion */}
              <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-surface md:hidden">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-accent">{s.tag}</p>
              <h3
                className={cn(
                  "display mt-3 text-3xl leading-tight transition-colors duration-500 md:text-5xl",
                  !reduced && i !== active && "md:text-fg/30",
                )}
              >
                {s.title}
              </h3>
              <p className="mt-5 max-w-md text-muted">{s.body}</p>
              {i === steps.length - 1 && (
                <Link
                  href={ctaHref}
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-fg px-6 py-3 font-mono text-xs uppercase tracking-widest text-accent-ink transition-colors hover:bg-accent"
                >
                  {ctaLabel} <ArrowIcon width={16} height={16} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
