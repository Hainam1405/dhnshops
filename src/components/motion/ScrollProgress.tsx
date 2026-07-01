"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * Thin reading-progress bar pinned to the very top of the viewport.
 * Tracks whole-page scroll and eases with a spring. Purely decorative, so it
 * is hidden from assistive tech; reduced-motion users still get a correct (if
 * unspringy) fill because the underlying scroll value is exact.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-accent"
    />
  );
}
