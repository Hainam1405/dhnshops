"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Category, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminShell } from "@/components/admin/AdminShell";

type Mode = { kind: "list" } | { kind: "new" } | { kind: "edit"; product: Product };

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>({ kind: "list" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", { cache: "no-store" });
      if (res.status === 401) {
        window.location.assign("/admin/login");
        return;
      }
      const json = await res.json();
      setProducts(json.products ?? []);
      setCategories(json.categories ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: string) {
    if (!window.confirm("Delete this product? This can't be undone.")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  }

  const backToList = () => {
    setMode({ kind: "list" });
    load();
  };

  return (
    <AdminShell>
      {mode.kind === "list" ? (
        <>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Catalog</p>
              <h1 className="display mt-2 text-3xl">
                Products{" "}
                {!loading && <span className="text-muted">({products.length})</span>}
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setMode({ kind: "new" })}
              className="h-11 rounded-full bg-accent px-6 font-mono text-xs uppercase tracking-widest text-accent-ink transition-colors hover:bg-fg active:scale-[0.99]"
            >
              + Add product
            </button>
          </div>

          <p className="mt-5 rounded-xl border border-line bg-surface px-4 py-3 text-xs text-muted">
            Products are saved to <code className="text-fg">data/catalog.json</code> and images to{" "}
            <code className="text-fg">public/uploads</code>. Great for local use — swap to a database
            before deploying to a serverless host.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
            {loading ? (
              <div className="divide-y divide-line">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4">
                    <div className="h-16 w-14 shrink-0 animate-pulse rounded-lg bg-surface-2" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-1/3 animate-pulse rounded bg-surface-2" />
                      <div className="h-3 w-1/4 animate-pulse rounded bg-surface-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-muted">No products yet.</p>
                <button
                  type="button"
                  onClick={() => setMode({ kind: "new" })}
                  className="mt-4 font-mono text-xs uppercase tracking-widest text-accent"
                >
                  + Add your first product
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {products.map((p) => (
                  <li
                    key={p._id}
                    className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-base/60"
                  >
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-base">
                      {p.images[0] && (
                        <Image src={p.images[0]} alt="" fill sizes="56px" className="object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium">{p.title}</p>
                        {p.badges.map((b) => (
                          <span
                            key={b}
                            className="rounded-full border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted">
                        {p.category} · {formatPrice(p.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/products/${p.slug}`}
                        className="font-mono text-[11px] uppercase tracking-widest text-muted hover:text-fg"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => setMode({ kind: "edit", product: p })}
                        className="rounded-full border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors hover:border-accent hover:text-accent"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(p._id)}
                        aria-label={`Delete ${p.title}`}
                        className="font-mono text-[11px] uppercase tracking-widest text-muted hover:text-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setMode({ kind: "list" })}
            className="font-mono text-[11px] uppercase tracking-widest text-muted hover:text-fg"
          >
            ← Products
          </button>
          <h1 className="display mt-3 text-3xl">
            {mode.kind === "edit" ? "Edit product" : "New product"}
          </h1>
          <div className="mt-8 rounded-2xl border border-line bg-surface p-6 shadow-soft md:p-8">
            <ProductForm
              categories={categories}
              initial={mode.kind === "edit" ? mode.product : null}
              onSaved={backToList}
              onCancel={() => setMode({ kind: "list" })}
            />
          </div>
        </>
      )}
    </AdminShell>
  );
}
