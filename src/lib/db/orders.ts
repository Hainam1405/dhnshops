import type { Order } from "@/lib/admin/orders";
import { ensureReady, getSql } from "./client";

/**
 * Database-backed order persistence (Postgres/Neon). Only the persistence
 * primitives live here; the authoritative price/total computation stays in
 * `@/lib/admin/orders` so it is single-sourced regardless of storage backend.
 */

export async function listOrders(): Promise<Order[]> {
  await ensureReady();
  const sql = getSql();
  const rows = (await sql`
    SELECT data FROM orders ORDER BY created_at DESC`) as { data: Order }[];
  return rows.map((r) => r.data);
}

export async function getStats(): Promise<{
  orderCount: number;
  unitCount: number;
  revenue: number;
  newCount: number;
}> {
  await ensureReady();
  const sql = getSql();
  const rows = (await sql`
    SELECT
      count(*)::int AS "orderCount",
      COALESCE(SUM((data->>'itemCount')::int), 0)::int AS "unitCount",
      COALESCE(SUM((data->>'total')::bigint), 0) AS revenue,
      (count(*) FILTER (WHERE data->>'status' = 'new'))::int AS "newCount"
    FROM orders`) as Array<{
    orderCount: number;
    unitCount: number;
    revenue: string | number;
    newCount: number;
  }>;
  const r = rows[0];
  return {
    orderCount: Number(r?.orderCount ?? 0),
    unitCount: Number(r?.unitCount ?? 0),
    revenue: Number(r?.revenue ?? 0),
    newCount: Number(r?.newCount ?? 0),
  };
}

/**
 * Insert a fully-computed order. Returns false if the id already exists (so the
 * caller can retry with a fresh id) — never overwrites an existing order.
 */
export async function insertOrder(order: Order): Promise<boolean> {
  await ensureReady();
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO orders (id, data, created_at)
    VALUES (${order.id}, ${JSON.stringify(order)}::jsonb, ${order.createdAt})
    ON CONFLICT (id) DO NOTHING
    RETURNING id`) as { id: string }[];
  return rows.length > 0;
}

export async function setOrderStatus(
  id: string,
  status: Order["status"],
): Promise<Order | null> {
  await ensureReady();
  const sql = getSql();
  const rows = (await sql`
    UPDATE orders
    SET data = jsonb_set(data, '{status}', to_jsonb(${status}::text))
    WHERE id = ${id}
    RETURNING data`) as { data: Order }[];
  return rows[0]?.data ?? null;
}
