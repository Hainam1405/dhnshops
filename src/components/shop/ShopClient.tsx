"use client";

import { useMemo, useState } from "react";
import type { Category, Product } from "@/lib/types";
import { ProductGrid } from "./ProductGrid";
import { cn } from "@/lib/utils";

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "rating", label: "Top rated" },
];

export function ShopClient({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [colors, setColors] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<Sort>("featured");
  const [query, setQuery] = useState("");

  const allColors = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => p.colors.forEach((c) => map.set(c.name, c.hex)));
    return [...map.entries()].map(([name, hex]) => ({ name, hex }));
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      const catOk = !category || p.category === category;
      const colorOk = colors.size === 0 || p.colors.some((c) => colors.has(c.name));
      const queryOk =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return catOk && colorOk && queryOk;
    });
    list = [...list];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => Number(b.featured) - Number(a.featured));
    return list;
  }, [products, category, colors, sort, query]);

  function toggleColor(name: string) {
    setColors((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <div>
      {/* filter bar */}
      <div className="sticky top-16 z-30 -mx-5 mb-10 border-y border-line bg-base/80 px-5 py-3 backdrop-blur-xl md:mx-0 md:rounded-full md:border md:px-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            aria-label="Search products"
            className="w-full rounded-full border border-line bg-surface px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-fg outline-none placeholder:text-muted focus:border-accent md:w-44"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCategory(null)}
              className={cn(
                "rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest",
                category === null ? "bg-accent text-accent-ink" : "text-muted hover:text-fg",
              )}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setCategory(c.slug)}
                className={cn(
                  "rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest",
                  category === c.slug ? "bg-accent text-accent-ink" : "text-muted hover:text-fg",
                )}
              >
                {c.title}
              </button>
            ))}
          </div>

          <div className="hidden h-4 w-px bg-line md:block" />

          <div className="flex items-center gap-2">
            {allColors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => toggleColor(c.name)}
                title={c.name}
                className={cn(
                  "h-6 w-6 rounded-full border-2 p-0.5",
                  colors.has(c.name) ? "border-accent" : "border-transparent",
                )}
              >
                <span
                  className="block h-full w-full rounded-full border border-line"
                  style={{ backgroundColor: c.hex }}
                />
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
              {filtered.length} items
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-full border border-line bg-base px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-fg outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <ProductGrid products={filtered} priorityCount={4} />
      ) : (
        <p className="py-20 text-center text-muted">No products match those filters.</p>
      )}
    </div>
  );
}
