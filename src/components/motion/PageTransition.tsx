"use client";

import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/animation/useReducedMotion";

/**
 * Lightweight route transition. Re-mounts on pathname change (via key) and
 * replays an enter animation — no AnimatePresence exit, so it stays in sync
 * with the app-router render lifecycle and the Lenis/ScrollTrigger setup.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
