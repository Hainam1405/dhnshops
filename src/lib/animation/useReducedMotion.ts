"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe `prefers-reduced-motion` hook. Defaults to `false` on the server so
 * the immersive layer renders by default, then disables after mount if the user
 * has requested reduced motion.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
