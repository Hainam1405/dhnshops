"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/animation/useReducedMotion";

/** Custom trailing cursor with a ring that expands over interactive elements. */
export function Cursor() {
  const reduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 32, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 350, damping: 32, mass: 0.6 });
  const dotX = useSpring(x, { stiffness: 900, damping: 40, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 900, damping: 40, mass: 0.2 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.body.dataset.customCursor = "on";

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      setHovering(Boolean(target?.closest("a, button, [data-cursor]")));
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      delete document.body.dataset.customCursor;
    };
  }, [reduced, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
      >
        <motion.div
          animate={{ scale: hovering ? 1.8 : 1, opacity: hovering ? 0.6 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-accent"
          style={{ width: 34, height: 34 }}
        />
      </motion.div>
      <motion.div
        style={{ x: dotX, y: dotY }}
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
          style={{ width: 6, height: 6 }}
        />
      </motion.div>
    </>
  );
}
