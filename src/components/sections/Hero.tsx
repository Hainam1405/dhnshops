"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { StarRating } from "@/components/ui/StarRating";
import { CheckIcon } from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/lib/animation/useReducedMotion";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

export function Hero() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      {/* WebGL / ambient background */}
      <div className="absolute inset-0 -z-10">
        {/* soft light aurora wash */}
        <div
          className="aurora absolute inset-0"
          style={{ animation: reduced ? undefined : "aurora-drift 20s ease-in-out infinite" }}
        />
        {!reduced && <HeroScene />}
        <div
          className="absolute left-1/2 top-1/3 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full blur-[130px]"
          style={{ background: "color-mix(in srgb, var(--color-accent-2) 18%, transparent)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-base/20 to-base" />
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="eyebrow mb-6"
        >
          Print-on-demand · Shipped worldwide
        </motion.p>

        <h1 className="display text-[13vw] leading-[0.82] md:text-[8.5vw]">
          <SplitReveal text="Wear the" as="span" className="block" />
          <SplitReveal text="near future" as="span" className="block text-accent" delay={0.12} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-md text-balance text-base text-muted"
        >
          Heavyweight apparel, printed on demand at the hub nearest you and shipped carbon-neutral.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <Magnetic>
            <Button href="/shop" size="lg">
              Shop the drop
            </Button>
          </Magnetic>
          <Magnetic>
            <Button href="/collections/limited" size="lg" variant="outline">
              Limited editions
            </Button>
          </Magnetic>
        </motion.div>

        {/* social proof */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.74, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
        >
          <div className="flex items-center gap-2">
            <StarRating rating={4.9} showValue={false} />
            <span className="text-sm text-muted">
              Loved by <span className="font-medium text-fg">12,000+</span> makers
            </span>
          </div>
          <span className="hidden h-4 w-px bg-line sm:block" />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-muted">
            {["Carbon-neutral shipping", "30-day returns", "Printed on demand"].map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5">
                <CheckIcon width={13} height={13} className="text-accent" />
                {b}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted"
        >
          Scroll
        </motion.div>
      </div>
    </section>
  );
}
