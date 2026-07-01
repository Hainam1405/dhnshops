"use client";

import { useState } from "react";
import type { Category, Product, ProductColor } from "@/lib/types";
import { ImageUploader } from "./ImageUploader";
import { CloseIcon } from "@/components/ui/icons";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "2XL"];
const ALL_BADGES = ["New", "Bestseller", "Limited"];

const inputCls =
  "w-full rounded-lg border border-line bg-base px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent";
const labelCls = "block font-mono text-[11px] uppercase tracking-widest text-muted";

export function ProductForm({
  categories,
  initial,
  onSaved,
  onCancel,
}: {
  categories: Category[];
  initial: Product | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [price, setPrice] = useState(initial ? (initial.price / 100).toString() : "");
  const [compareAt, setCompareAt] = useState(
    initial?.compareAtPrice ? (initial.compareAtPrice / 100).toString() : "",
  );
  const [category, setCategory] = useState(initial?.category ?? categories[0]?.slug ?? "");
  const [shortDescription, setShort] = useState(initial?.shortDescription ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [badges, setBadges] = useState<string[]>(initial?.badges ?? []);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [sizes, setSizes] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    ALL_SIZES.forEach((s) => {
      map[s] = initial ? (initial.sizes.find((x) => x.label === s)?.inStock ?? false) : true;
    });
    return map;
  });
  const [colors, setColors] = useState<ProductColor[]>(initial?.colors ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleBadge(b: string) {
    setBadges((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));
  }
  function updateColor(i: number, patch: Partial<ProductColor>) {
    setColors((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const priceNum = Math.round(parseFloat(price) * 100);
    if (!title.trim() || !priceNum || priceNum <= 0 || !category) {
      setError("Title, a valid price and a collection are required.");
      return;
    }
    if (images.length === 0) {
      setError("Add at least one gallery image.");
      return;
    }

    const payload = {
      title: title.trim(),
      shortDescription,
      description,
      price: priceNum,
      compareAtPrice: compareAt ? Math.round(parseFloat(compareAt) * 100) : null,
      category,
      badges,
      featured,
      sizes: ALL_SIZES.map((s) => ({ label: s, inStock: Boolean(sizes[s]) })),
      colors: colors
        .filter((c) => c.name.trim())
        .map((c) => ({ name: c.name.trim(), hex: c.hex, images: c.images })),
      images,
    };

    setSaving(true);
    try {
      const res = await fetch(
        initial ? `/api/admin/products/${initial._id}` : "/api/admin/products",
        {
          method: initial ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Save failed");
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className={labelCls}>Title *</label>
          <input className={`${inputCls} mt-2`} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Null Vector Tee" />
        </div>
        <div>
          <label className={labelCls}>Price (USD) *</label>
          <input className={`${inputCls} mt-2`} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="32" inputMode="decimal" />
        </div>
        <div>
          <label className={labelCls}>Compare-at price (USD)</label>
          <input className={`${inputCls} mt-2`} value={compareAt} onChange={(e) => setCompareAt(e.target.value)} placeholder="39" inputMode="decimal" />
        </div>
        <div>
          <label className={labelCls}>Collection *</label>
          <select className={`${inputCls} mt-2`} value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Featured
          </label>
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Short description</label>
          <input className={`${inputCls} mt-2`} value={shortDescription} onChange={(e) => setShort(e.target.value)} placeholder="Front + back print on 240gsm cotton." />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Description</label>
          <textarea className={`${inputCls} mt-2`} rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </div>

      {/* badges */}
      <div>
        <label className={labelCls}>Badges</label>
        <div className="mt-3 flex gap-2">
          {ALL_BADGES.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => toggleBadge(b)}
              className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest ${
                badges.includes(b) ? "border-accent text-accent" : "border-line text-muted"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* sizes */}
      <div>
        <label className={labelCls}>Sizes in stock</label>
        <div className="mt-3 flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSizes((prev) => ({ ...prev, [s]: !prev[s] }))}
              className={`h-10 w-14 rounded-lg border text-sm ${
                sizes[s] ? "border-accent bg-accent text-accent-ink" : "border-line text-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* gallery */}
      <div>
        <label className={labelCls}>Gallery images * (first is the cover)</label>
        <div className="mt-3">
          <ImageUploader value={images} onChange={setImages} />
        </div>
      </div>

      {/* colors */}
      <div>
        <div className="flex items-center justify-between">
          <label className={labelCls}>Colorways (optional)</label>
          <button
            type="button"
            onClick={() => setColors((prev) => [...prev, { name: "", hex: "#0d0f16", images: [] }])}
            className="font-mono text-[11px] uppercase tracking-widest text-accent"
          >
            + Add color
          </button>
        </div>
        <div className="mt-3 space-y-4">
          {colors.map((c, i) => (
            <div key={i} className="rounded-xl border border-line p-4">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={c.hex}
                  onChange={(e) => updateColor(i, { hex: e.target.value })}
                  className="h-9 w-9 rounded"
                  aria-label="Color"
                />
                <input
                  className={inputCls}
                  value={c.name}
                  onChange={(e) => updateColor(i, { name: e.target.value })}
                  placeholder="Color name (e.g. Void Black)"
                />
                <button
                  type="button"
                  onClick={() => setColors((prev) => prev.filter((_, idx) => idx !== i))}
                  aria-label="Remove color"
                  className="text-muted hover:text-danger"
                >
                  <CloseIcon width={18} height={18} />
                </button>
              </div>
              <div className="mt-3">
                <ImageUploader value={c.images} onChange={(urls) => updateColor(i, { images: urls })} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="h-11 rounded-full bg-accent px-6 font-mono text-xs uppercase tracking-widest text-accent-ink hover:bg-fg disabled:opacity-50"
        >
          {saving ? "Saving…" : initial ? "Save changes" : "Create product"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="font-mono text-xs uppercase tracking-widest text-muted hover:text-fg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
