"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Category, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminNav } from "@/components/admin/AdminNav";

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
    <div className="mx-auto max-w-4xl px-5 py-12 md:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Catalog admin</p>
          <h1 className="display mt-2 text-3xl">Manage products</h1>
        </div>
        <div className="flex items-center gap-4">
          <AdminNav />
          <Link href="/" className="font-mono text-xs uppercase tracking-widest text-muted hover:text-fg">
            ← View store
          </Link>
          {mode.kind === "list" && (
            <button
              type="button"
              onClick={() => setMode({ kind: "new" })}
              className="h-10 rounded-full bg-accent px-5 font-mono text-xs uppercase tracking-widest text-accent-ink hover:bg-fg"
            >
              + Add product
            </button>
          )}
        </div>
      </header>

      <p className="mt-4 rounded-lg border border-line bg-surface px-4 py-3 text-xs text-muted">
        Products are saved to <code className="text-fg">data/catalog.json</code> and images to{" "}
        <code className="text-fg">public/uploads</code>. Great for local use — swap to a database
        before deploying to a serverless host.
      </p>

      <div className="mt-8">
        {mode.kind === "list" ? (
          loading ? (
            <p className="text-muted">Loading…</p>
          ) : products.length === 0 ? (
            <p className="text-muted">No products yet. Add your first one.</p>
          ) : (
            <ul className="divide-y divide-line border-y border-line">
              {products.map((p) => (
                <li key={p._id} className="flex items-center gap-4 py-4">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                    {p.images[0] && (
                      <Image src={p.images[0]} alt="" fill sizes="56px" className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{p.title}</p>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                      {p.category} · {formatPrice(p.price)}
                      {p.badges.length ? ` · ${p.badges.join(", ")}` : ""}
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
                      className="font-mono text-[11px] uppercase tracking-widest text-accent"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(p._id)}
                      className="font-mono text-[11px] uppercase tracking-widest text-muted hover:text-danger"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )
        ) : (
          <ProductForm
            categories={categories}
            initial={mode.kind === "edit" ? mode.product : null}
            onSaved={backToList}
            onCancel={() => setMode({ kind: "list" })}
          />
        )}
      </div>
    </div>
  );
}
