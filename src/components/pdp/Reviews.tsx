"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Review } from "@/lib/types";
import { StarRating } from "@/components/ui/StarRating";
import { cn } from "@/lib/utils";

export function Reviews({
  reviews,
  rating,
  count,
}: {
  reviews: Review[];
  rating: number;
  count: number;
}) {
  const [sort, setSort] = useState<"recent" | "top">("recent");
  const [filter, setFilter] = useState<number | null>(null);

  const list = useMemo(() => {
    let l = [...reviews];
    if (filter) l = l.filter((r) => Math.round(r.rating) === filter);
    l.sort((a, b) =>
      sort === "top" ? b.rating - a.rating : Date.parse(b.date) - Date.parse(a.date),
    );
    return l;
  }, [reviews, sort, filter]);

  // Nothing sold yet, nothing to average. Showing "0.0 / 5" beside a summary,
  // star filters and a sort control would imply reviews exist and are all bad.
  if (count === 0) {
    return (
      <section id="reviews" className="border-t border-line py-16">
        <p className="eyebrow">Reviews</p>
        <h2 className="mt-4 text-2xl font-medium tracking-tight">No reviews yet</h2>
        <p className="mt-3 max-w-md text-muted">
          This design hasn&rsquo;t been reviewed yet. Order one and you could be the first —
          we&rsquo;ll email you after it arrives.
        </p>
      </section>
    );
  }

  return (
    <section id="reviews" className="border-t border-line py-16">
      <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
        {/* summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow">Reviews</p>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="display text-6xl">{rating.toFixed(1)}</span>
            <span className="text-sm text-muted">/ 5</span>
          </div>
          <StarRating rating={rating} showValue={false} className="mt-3" />
          <p className="mt-2 text-sm text-muted">Based on {count} verified reviews</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter(null)}
              className={cn(
                "rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest",
                filter === null ? "border-accent text-accent" : "border-line text-muted",
              )}
            >
              All
            </button>
            {[5, 4, 3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setFilter(n)}
                className={cn(
                  "rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest",
                  filter === n ? "border-accent text-accent" : "border-line text-muted",
                )}
              >
                {n} ★
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            {(["recent", "top"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSort(s)}
                className={cn(
                  "font-mono text-[11px] uppercase tracking-widest",
                  sort === s ? "text-fg" : "text-muted",
                )}
              >
                {s === "recent" ? "Most recent" : "Top rated"}
              </button>
            ))}
          </div>
        </div>

        {/* list */}
        <div className="divide-y divide-line">
          {list.length === 0 && (
            <p className="py-8 text-sm text-muted">No reviews match that filter.</p>
          )}
          {list.map((r) => (
            <article key={r.id} className="py-6">
              <div className="flex items-center justify-between">
                <StarRating rating={r.rating} showValue={false} />
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                  {new Date(r.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </div>
              <p className="mt-3 text-fg">{r.text}</p>
              {r.photo && (
                <div className="mt-4 flex gap-3">
                  <div className="relative h-20 w-16 overflow-hidden rounded-lg bg-surface">
                    <Image src={r.photo} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                </div>
              )}
              <p className="mt-3 flex items-center gap-2 text-sm text-muted">
                <span className="font-medium text-fg">{r.author}</span>
                {r.verified && (
                  <span className="rounded-full bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent">
                    Verified
                  </span>
                )}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
