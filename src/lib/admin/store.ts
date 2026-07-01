import { promises as fs } from "fs";
import path from "path";
import { products as seedProducts, categories as seedCategories } from "@/lib/data/seed";
import type { Category, Product } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { assemble, type ProductInput } from "./product-shape";
import { hasDb } from "@/lib/db/client";
import * as db from "@/lib/db/catalog";

/**
 * Catalog store for the self-contained /admin.
 *
 * Backend is env-gated (see `@/lib/db/client`):
 *  - DATABASE_URL set  -> Postgres (production / Vercel).
 *  - DATABASE_URL unset -> data/catalog.json file store (local dev), seeded
 *    from the sample catalog on first run.
 *
 * Exported signatures are identical across both backends so nothing else changes.
 */

export type { ProductInput };
export type Catalog = { products: Product[]; categories: Category[] };

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "catalog.json");

// --- serialize every read-modify-write so concurrent admin edits don't clobber the file ---
let lockChain: Promise<unknown> = Promise.resolve();
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = lockChain.then(fn, fn);
  lockChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readCatalog(): Promise<Catalog> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return JSON.parse(raw) as Catalog;
  } catch {
    const seeded: Catalog = { products: seedProducts, categories: seedCategories };
    await writeCatalog(seeded);
    return seeded;
  }
}

/** Atomic write: temp file then rename, so a reader never sees a truncated file. */
async function writeCatalog(catalog: Catalog): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(catalog, null, 2), "utf8");
  await fs.rename(tmp, FILE);
}

export async function listProducts(): Promise<Product[]> {
  if (hasDb) return db.listProducts();
  return (await readCatalog()).products;
}

export async function listCategories(): Promise<Category[]> {
  if (hasDb) return db.listCategories();
  return (await readCatalog()).categories;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  if (hasDb) return db.createProduct(input);
  return withLock(async () => {
    const catalog = await readCatalog();
    const base = slugify(input.title) || "product";
    let slug = base;
    let n = 1;
    while (catalog.products.some((p) => p.slug === slug)) slug = `${base}-${++n}`;

    const product = assemble(input);
    product._id = slug;
    product.slug = slug;

    catalog.products.unshift(product);
    await writeCatalog(catalog);
    return product;
  });
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product | null> {
  if (hasDb) return db.updateProduct(id, input);
  return withLock(async () => {
    const catalog = await readCatalog();
    const idx = catalog.products.findIndex((p) => p._id === id);
    if (idx === -1) return null;

    const updated = assemble(input, catalog.products[idx]);
    catalog.products[idx] = updated;
    await writeCatalog(catalog);
    return updated;
  });
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (hasDb) return db.deleteProduct(id);
  return withLock(async () => {
    const catalog = await readCatalog();
    const next = catalog.products.filter((p) => p._id !== id);
    if (next.length === catalog.products.length) return false;
    catalog.products = next;
    await writeCatalog(catalog);
    return true;
  });
}
