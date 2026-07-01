"use client";

import { useCallback, useEffect, useState } from "react";
import type { Order } from "@/lib/admin/orders";
import { formatPrice } from "@/lib/utils";
import { AdminShell } from "@/components/admin/AdminShell";

type Stats = { orderCount: number; unitCount: number; revenue: number; newCount: number };

function StatCard({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-soft">
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted">{label}</p>
      <p className={accent ? "display mt-2 text-3xl text-accent" : "display mt-2 text-3xl"}>{value}</p>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({ orderCount: 0, unitCount: 0, revenue: 0, newCount: 0 });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      if (res.status === 401) {
        window.location.assign("/admin/login");
        return;
      }
      const json = await res.json();
      setOrders(json.orders ?? []);
      setStats(json.stats ?? { orderCount: 0, unitCount: 0, revenue: 0, newCount: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function toggle(id: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function setStatus(id: string, status: Order["status"]) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <AdminShell>
      <div>
        <p className="eyebrow">Fulfilment</p>
        <h1 className="display mt-2 text-3xl">Orders</h1>
      </div>

      {/* stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Orders" value={String(stats.orderCount)} />
        <StatCard label="Units sold" value={String(stats.unitCount)} />
        <StatCard label="Revenue" value={formatPrice(stats.revenue)} />
        <StatCard label="New / unfulfilled" value={String(stats.newCount)} accent={stats.newCount > 0} />
      </div>

      {/* list */}
      <div className="mt-10">
        {loading ? (
          <div className="rounded-2xl border border-line bg-surface p-10 text-center shadow-soft">
            <p className="text-muted">Loading orders…</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface p-12 text-center shadow-soft">
            <p className="font-medium">No orders yet</p>
            <p className="mt-2 text-sm text-muted">
              Place a test order from the store checkout to see it appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
            <ul className="divide-y divide-line">
              {orders.map((o) => {
                const isOpen = open.has(o.id);
                return (
                  <li key={o.id} className="px-5 py-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <button
                        type="button"
                        onClick={() => toggle(o.id)}
                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                      >
                        <span className="text-muted">{isOpen ? "–" : "+"}</span>
                        <span className="font-mono text-sm text-accent">{o.id}</span>
                        <span className="min-w-0 truncate text-sm">
                          {o.customer.firstName} {o.customer.lastName}
                          <span className="text-muted"> · {o.customer.email}</span>
                        </span>
                      </button>
                      <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                        {new Date(o.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                        {o.itemCount} {o.itemCount === 1 ? "unit" : "units"}
                      </span>
                      <span className="w-20 text-right text-sm font-medium">{formatPrice(o.total)}</span>
                      <button
                        type="button"
                        onClick={() => setStatus(o.id, o.status === "new" ? "fulfilled" : "new")}
                        className={
                          o.status === "fulfilled"
                            ? "rounded-full bg-accent px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-accent-ink"
                            : "rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-accent"
                        }
                      >
                        {o.status === "fulfilled" ? "Fulfilled ✓" : "Mark fulfilled"}
                      </button>
                    </div>

                    {isOpen && (
                      <div className="mt-4 grid gap-6 pl-7 md:grid-cols-[1fr_260px]">
                        <div>
                          <ul className="divide-y divide-line/60">
                            {o.items.map((it, idx) => (
                              <li
                                key={idx}
                                className="flex items-center justify-between gap-3 py-2 text-sm"
                              >
                                <span className="min-w-0">
                                  <span className="text-fg">{it.title}</span>
                                  <span className="text-muted">
                                    {" "}
                                    — {it.color} / {it.size} × {it.quantity}
                                  </span>
                                </span>
                                <span className="shrink-0">{formatPrice(it.price * it.quantity)}</span>
                              </li>
                            ))}
                          </ul>
                          <dl className="mt-3 space-y-1 text-sm">
                            <div className="flex justify-between text-muted">
                              <dt>Subtotal</dt>
                              <dd>{formatPrice(o.subtotal)}</dd>
                            </div>
                            <div className="flex justify-between text-muted">
                              <dt>Shipping</dt>
                              <dd>{o.shipping === 0 ? "Free" : formatPrice(o.shipping)}</dd>
                            </div>
                            <div className="flex justify-between font-medium">
                              <dt>Total</dt>
                              <dd>{formatPrice(o.total)}</dd>
                            </div>
                          </dl>
                        </div>
                        <div className="rounded-xl border border-line bg-base p-4 text-sm text-muted">
                          <p className="font-mono text-[11px] uppercase tracking-widest">Ship to</p>
                          <p className="mt-2 text-fg">
                            {o.customer.firstName} {o.customer.lastName}
                          </p>
                          <p>{o.customer.address}</p>
                          <p>
                            {o.customer.city} {o.customer.zip}
                          </p>
                          <p>{o.customer.country}</p>
                          <p className="mt-2">{o.customer.email}</p>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
