import { promises as fs } from "fs";
import path from "path";
import { getAllProducts } from "@/lib/products";
import { SITE } from "@/lib/config";
import { hasDb } from "@/lib/db/client";
import * as db from "@/lib/db/orders";

/**
 * Order store for the self-contained admin.
 *
 * Backend is env-gated (see `@/lib/db/client`): Postgres when DATABASE_URL is
 * set, otherwise the data/orders.json file store for local dev. The price/total
 * computation in createOrder is backend-agnostic and lives only here.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "orders.json");

// Single source of truth lives in @/lib/config so the cart, the server-side
// total, and the published shipping policy can never quote different numbers.
export const FREE_SHIPPING_THRESHOLD = SITE.freeShippingThreshold; // cents
export const FLAT_SHIPPING = SITE.flatShipping; // cents

export type OrderItem = {
  productId: string;
  slug: string;
  title: string;
  price: number; // cents, unit price
  color: string;
  size: string;
  quantity: number;
  image: string;
};

export type Customer = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  zip: string;
};

export type Order = {
  id: string;
  createdAt: string; // ISO
  customer: Customer;
  items: OrderItem[];
  subtotal: number; // cents
  shipping: number; // cents
  total: number; // cents
  itemCount: number; // total units
  status: "new" | "fulfilled";
};

export type CheckoutInput = {
  customer: Customer;
  items: Array<Partial<OrderItem> & { productId: string; quantity: number }>;
};

// --- tiny in-process write lock so concurrent checkouts don't clobber the file ---
let lockChain: Promise<unknown> = Promise.resolve();
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = lockChain.then(fn, fn);
  lockChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readOrders(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch {
    return [];
  }
}

/** Atomic write: write to a temp file then rename, so a reader never sees a truncated file. */
async function writeOrders(orders: Order[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(orders, null, 2), "utf8");
  await fs.rename(tmp, FILE);
}

/** Orders placed before the rename still carry the legacy `AE-` prefix. */
function genOrderId(existing: Order[]): string {
  let id = "";
  do {
    const t = Date.now().toString(36).toUpperCase().slice(-4);
    const r = Math.floor(Math.random() * 46656)
      .toString(36)
      .toUpperCase()
      .padStart(3, "0");
    id = `DHN-${t}${r}`;
  } while (existing.some((o) => o.id === id));
  return id;
}

export async function listOrders(): Promise<Order[]> {
  if (hasDb) return db.listOrders();
  return readOrders();
}

export async function getStats() {
  if (hasDb) return db.getStats();
  const orders = await readOrders();
  return {
    orderCount: orders.length,
    unitCount: orders.reduce((s, o) => s + o.itemCount, 0),
    revenue: orders.reduce((s, o) => s + o.total, 0),
    newCount: orders.filter((o) => o.status === "new").length,
  };
}

export async function createOrder(input: CheckoutInput): Promise<Order> {
  // Authoritative prices come from the SAME data layer the storefront serves
  // products from (file store, Postgres OR Sanity), keyed by the same _id the
  // cart submitted. Prices are NEVER taken from the client payload.
  const products = await getAllProducts();
  const priceById = new Map(products.map((p) => [p._id, p.price]));

  const items: OrderItem[] = input.items
    .map((i): OrderItem | null => {
      const productId = String(i.productId);
      const catalogPrice = priceById.get(productId);
      if (catalogPrice == null) return null; // unknown product -> reject, don't trust client price
      return {
        productId,
        slug: String(i.slug ?? ""),
        title: String(i.title ?? ""),
        price: catalogPrice,
        color: String(i.color ?? ""),
        size: String(i.size ?? ""),
        quantity: Math.max(1, Math.floor(Number(i.quantity) || 1)),
        image: String(i.image ?? ""),
      };
    })
    .filter((i): i is OrderItem => i !== null && i.quantity > 0);

  if (items.length === 0) throw new Error("No valid items in order");

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  const build = (id: string): Order => ({
    id,
    createdAt: new Date().toISOString(),
    customer: input.customer,
    items,
    subtotal,
    shipping,
    total,
    itemCount,
    status: "new",
  });

  if (hasDb) {
    // The DB PK guarantees uniqueness; retry on the rare id collision.
    for (let attempt = 0; attempt < 6; attempt++) {
      const order = build(genOrderId([]));
      if (await db.insertOrder(order)) return order;
    }
    throw new Error("Could not allocate a unique order id");
  }

  return withLock(async () => {
    const orders = await readOrders();
    const order = build(genOrderId(orders));
    orders.unshift(order);
    await writeOrders(orders);
    return order;
  });
}

export async function setOrderStatus(
  id: string,
  status: Order["status"],
): Promise<Order | null> {
  if (hasDb) return db.setOrderStatus(id, status);
  return withLock(async () => {
    const orders = await readOrders();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    orders[idx] = { ...orders[idx], status };
    await writeOrders(orders);
    return orders[idx];
  });
}
