"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animation/gsap";
import { usePrefersReducedMotion } from "@/lib/animation/useReducedMotion";

/**
 * Kinetic typography: splits text into words that rise from behind a mask on
 * mount. Falls back to plain text when reduced motion is requested.
 */
export function SplitReveal({
  text,
  as = "span",
  className,
  delay = 0,
}: {
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (reduced || !el) return;
    const inners = el.querySelectorAll("[data-word-inner]");
    const ctx = gsap.context(() => {
      gsap.set(inners, { yPercent: 120 });
      gsap.to(inners, {
        yPercent: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.055,
        delay,
      });
    }, el);
    return () => ctx.revert();
  }, [reduced, delay, text]);

  const words = text.split(" ");
  // Dynamic tag; ref/className are passed through untyped intentionally.
  const Tag = as as "span";

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span data-word-inner className="inline-block will-change-transform">
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
