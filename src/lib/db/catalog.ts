import type { Category, Product } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { assemble, type ProductInput } from "@/lib/admin/product-shape";
import { ensureReady, getSql } from "./client";

/**
 * Database-backed catalog store (Postgres/Neon). Mirrors the exported surface of
 * the file store in `@/lib/admin/store` so consumers don't change. Products and
 * categories are stored as JSONB documents; ordering is preserved via sort_key
 * (seed rows keep their curated order; new products sort to the front).
 */

export async function listProducts(): Promise<Product[]> {
  await ensureReady();
  const sql = getSql();
  const rows = (await sql`SELECT data FROM products ORDER BY sort_key ASC`) as {
    data: Product;
  }[];
  return rows.map((r) => r.data);
}

export async function listCategories(): Promise<Category[]> {
  await ensureReady();
  const sql = getSql();
  const rows = (await sql`SELECT data FROM categories ORDER BY sort_key ASC`) as {
    data: Category;
  }[];
  return rows.map((r) => r.data);
}

export async function createProduct(input: ProductInput): Promise<Product> {
  await ensureReady();
  const sql = getSql();

  const base = slugify(input.title) || "product";
  const product = assemble(input);

  // Try slug, slug-2, slug-3, ... with an atomic conflict-safe insert so two
  // concurrent same-title creates (or a double-click) can't throw a PK
  // violation. New products sort ahead of everything (mirrors the file store's
  // unshift). Slug numbering matches the file store (base, base-2, base-3...).
  for (let n = 1; n < 200; n++) {
    const slug = n === 1 ? base : `${base}-${n}`;
    product._id = slug;
    product.slug = slug;

    const rows = (await sql`
      INSERT INTO products (id, data, sort_key)
      VALUES (${slug}, ${JSON.stringify(product)}::jsonb,
              (SELECT COALESCE(MIN(sort_key), 0) - 1 FROM products))
      ON CONFLICT (id) DO NOTHING
      RETURNING id`) as { id: string }[];

    if (rows.length > 0) return product;
  }

  throw new Error("Could not allocate a unique product slug");
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<Product | null> {
  await ensureReady();
  const sql = getSql();

  const rows = (await sql`SELECT data FROM products WHERE id = ${id}`) as {
    data: Product;
  }[];
  if (rows.length === 0) return null;

  const updated = assemble(input, rows[0].data);
  await sql`
    UPDATE products
    SET data = ${JSON.stringify(updated)}::jsonb, updated_at = now()
    WHERE id = ${id}`;

  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  await ensureReady();
  const sql = getSql();
  const rows = (await sql`DELETE FROM products WHERE id = ${id} RETURNING id`) as {
    id: string;
  }[];
  return rows.length > 0;
}
