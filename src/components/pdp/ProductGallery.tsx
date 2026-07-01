"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { usePrefersReducedMotion } from "@/lib/animation/useReducedMotion";
import { cn } from "@/lib/utils";

const ProductStage = dynamic(() => import("@/components/three/ProductStage"), {
  ssr: false,
});

export function ProductGallery({
  images,
  tint,
  title,
}: {
  images: string[];
  tint: string;
  title: string;
}) {
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<"3d" | "flat">("3d");
  const reduced = usePrefersReducedMotion();
  const use3D = mode === "3d" && !reduced;
  const src = images[Math.min(active, images.length - 1)];

  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface">
        {use3D ? (
          <ProductStage key={src} src={src} tint={tint} />
        ) : (
          <Image
            src={src}
            alt={title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        )}

        {!reduced && (
          <>
            <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-base/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted backdrop-blur">
              {use3D ? "Move to rotate" : "Flat view"}
            </span>
            <button
              type="button"
              onClick={() => setMode((m) => (m === "3d" ? "flat" : "3d"))}
              className="absolute right-4 top-4 rounded-full border border-line-strong bg-base/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-fg backdrop-blur hover:border-accent hover:text-accent"
            >
              {mode === "3d" ? "View flat" : "View 3D"}
            </button>
          </>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            className={cn(
              "relative h-20 w-16 overflow-hidden rounded-lg border transition-colors",
              active === i ? "border-accent" : "border-line hover:border-line-strong",
            )}
          >
            <Image src={img} alt="" fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
