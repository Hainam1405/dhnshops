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

/**
 * Bump when `@/lib/data/seed` changes in a way that must reach an already-seeded
 * database. The sync below runs once per version, then never again.
 *
 * What a bump does, precisely:
 *  - products created through /admin are never touched, at any version;
 *  - the seed products ARE overwritten with the seed's copy, so an /admin edit to
 *    one of them is lost. Avoid bumping once staff are editing the catalogue —
 *    change the product in /admin instead.
 */
const SEED_VERSION = "2026-07-no-fabricated-reviews";

/**
 * Ids from the original placeholder catalog (the placehold.co sample products).
 * They are removed by the sync. Listing them explicitly — rather than deleting
 * everything that is not in the seed — guarantees a future SEED_VERSION bump can
 * never delete a product an admin created.
 */
const LEGACY_PRODUCT_IDS = [
  "null-vector-tee",
  "event-horizon-hoodie",
  "chromatic-drift-tee",
  "liminal-space-longsleeve",
  "signal-lost-hoodie",
  "photon-wash-tee",
  "deep-field-crewneck",
  "ghost-protocol-tee",
];

/** Categories from the placeholder catalog that the real one no longer uses. */
const LEGACY_CATEGORY_IDS = ["hoodies", "limited"];

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
  await sql`
    CREATE TABLE IF NOT EXISTS app_meta (
      key text PRIMARY KEY,
      value text NOT NULL
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS subscribers (
      email text PRIMARY KEY,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;

  await syncSeed(sql);
}

/**
 * Bring the catalog up to SEED_VERSION, exactly once per version.
 *
 * Every statement is idempotent (upsert / delete-by-id), so two serverless
 * instances racing through this converge on the same rows. The version marker is
 * written last: a crash midway just means the next boot retries.
 */
async function syncSeed(sql: NeonQueryFunction<false, false>): Promise<void> {
  const marker = (await sql`
    SELECT value FROM app_meta WHERE key = 'seed_version'`) as { value: string }[];
  if (marker[0]?.value === SEED_VERSION) return;

  const { products, categories } = await import("@/lib/data/seed");

  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    await sql`
      INSERT INTO categories (id, data, sort_key)
      VALUES (${c.slug}, ${JSON.stringify(c)}::jsonb, ${i})
      ON CONFLICT (id) DO UPDATE
        SET data = EXCLUDED.data, sort_key = EXCLUDED.sort_key`;
  }

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const id = p._id || p.slug;
    await sql`
      INSERT INTO products (id, data, sort_key)
      VALUES (${id}, ${JSON.stringify(p)}::jsonb, ${i})
      ON CONFLICT (id) DO UPDATE
        SET data = EXCLUDED.data, sort_key = EXCLUDED.sort_key, updated_at = now()`;
  }

  // Retire the placeholder catalog. Named ids only — never "everything else".
  await sql`DELETE FROM products WHERE id = ANY(${LEGACY_PRODUCT_IDS}::text[])`;
  await sql`DELETE FROM categories WHERE id = ANY(${LEGACY_CATEGORY_IDS}::text[])`;

  await sql`
    INSERT INTO app_meta (key, value)
    VALUES ('seed_version', ${SEED_VERSION})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;
}
