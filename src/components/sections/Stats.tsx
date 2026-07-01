"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/animation/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";

type Stat = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

const STATS: Stat[] = [
  { value: 32, label: "Print hubs worldwide" },
  { value: 200, suffix: "+", label: "Countries we ship to" },
  { value: 48, suffix: "h", label: "Avg. order dispatch" },
  { value: 4.9, decimals: 1, suffix: "★", label: "From 12,000+ reviews" },
];

const PRESS = ["HYPEBEAST", "DAZED", "WGSN", "IT'S NICE THAT", "COOL HUNTING", "DESIGNBOOM"];

function format(value: number, decimals: number) {
  const fixed = value.toFixed(decimals);
  const [int, frac] = fixed.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return frac ? `${grouped}.${frac}` : grouped;
}

function Counter({ stat, active }: { stat: Stat; active: boolean }) {
  const reduced = usePrefersReducedMotion();
  const decimals = stat.decimals ?? 0;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setDisplay(stat.value);
      return;
    }
    let raf = 0;
    let startTs: number | null = null;
    const duration = 1600;
    const tick = (ts: number) => {
      if (startTs === null) startTs = ts;
      const p = Math.min(1, (ts - startTs) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(stat.value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisplay(stat.value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced, stat.value]);

  return (
    <div className="text-center">
      <div className="display text-5xl tabular-nums md:text-7xl">
        {stat.prefix}
        {format(display, decimals)}
        {stat.suffix}
      </div>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-muted">
        {stat.label}
      </p>
    </div>
  );
}

export function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="border-y border-line bg-surface">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
        <Reveal className="text-center">
          <p className="eyebrow">By the numbers</p>
          <h2 className="display mx-auto mt-3 max-w-2xl text-3xl md:text-5xl">
            A global print engine behind every drop
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-y-12 md:grid-cols-4 md:gap-8">
          {STATS.map((s) => (
            <Counter key={s.label} stat={s} active={active} />
          ))}
        </div>

        <div className="mt-20 border-t border-line pt-10">
          <p className="text-center font-mono text-[11px] uppercase tracking-widest text-muted">
            As featured in
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {PRESS.map((name) => (
              <span
                key={name}
                className="font-mono text-sm tracking-[0.2em] text-fg/40 transition-colors hover:text-fg"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
