import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Postgres (Neon) connection + one-time schema/seed bootstrap.
 *
 * The whole app is env-gated: when DATABASE_URL is set (e.g. on Vercel) the
 * catalog/orders live in Postgres; when it is unset (local dev) the code falls
 * back to the JSON file stores. This keeps `npm run dev` working with zero
 * external setup while making the app deploy-ready on serverless.
 *
 * Documents are stored as JSONB — the same shapes the file store used — so the
 * data model and all consumers stay identical.
 */

export const hasDb = Boolean(process.env.DATABASE_URL);

let client: NeonQueryFunction<false, false> | null = null;

export function getSql(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  if (!client) client = neon(url);
  return client;
}

let readyPromise: Promise<void> | null = null;

/** Create tables and seed once per process. Safe to call before every query. */
export function ensureReady(): Promise<void> {
  if (!readyPromise) {
    readyPromise = bootstrap().catch((err) => {
      readyPromise = null; // allow a later retry if the first attempt failed
      throw err;
    });
  }
  return readyPromise;
}

async function bootstrap(): Promise<void> {
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id text PRIMARY KEY,
      data jsonb NOT NULL,
      sort_key double precision NOT NULL DEFAULT 0,
      updated_at timestamptz NOT NULL DEFAULT now()
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id text PRIMARY KEY,
      data jsonb NOT NULL,
      sort_key double precision NOT NULL DEFAULT 0
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id text PRIMARY KEY,
      data jsonb NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;

  await seedIfEmpty(sql);
}

/** Seed from the sample catalog only when the products table is empty. */
async function seedIfEmpty(sql: NeonQueryFunction<false, false>): Promise<void> {
  const rows = (await sql`SELECT count(*)::int AS n FROM products`) as { n: number }[];
  if (rows[0]?.n > 0) return;

  const { products, categories } = await import("@/lib/data/seed");

  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    await sql`
      INSERT INTO categories (id, data, sort_key)
      VALUES (${c.slug}, ${JSON.stringify(c)}::jsonb, ${i})
      ON CONFLICT (id) DO NOTHING`;
  }

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const id = p._id || p.slug;
    await sql`
      INSERT INTO products (id, data, sort_key)
      VALUES (${id}, ${JSON.stringify(p)}::jsonb, ${i})
      ON CONFLICT (id) DO NOTHING`;
  }
}
