import { NextResponse } from "next/server";
import { createOrder } from "@/lib/admin/orders";
import { sendOrderEmails } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = body as {
    customer?: Record<string, unknown>;
    items?: Array<Record<string, unknown>>;
  };
  const c = data.customer ?? {};
  const items = Array.isArray(data.items) ? data.items : [];

  if (!c.email || items.length === 0) {
    return NextResponse.json({ error: "email and at least one item are required" }, { status: 400 });
  }

  try {
    const order = await createOrder({
      customer: {
        email: String(c.email),
        firstName: String(c.firstName ?? ""),
        lastName: String(c.lastName ?? ""),
        address: String(c.address ?? ""),
        city: String(c.city ?? ""),
        country: String(c.country ?? ""),
        zip: String(c.zip ?? ""),
      },
      items: items.map((i) => ({
        productId: String(i.productId ?? ""),
        slug: String(i.slug ?? ""),
        title: String(i.title ?? ""),
        price: Number(i.price ?? 0),
        color: String(i.color ?? ""),
        size: String(i.size ?? ""),
        quantity: Number(i.quantity ?? 1),
        image: String(i.image ?? ""),
      })),
    });

    // The order is already persisted. sendOrderEmails swallows its own errors,
    // so a mail outage can never turn a placed order into a checkout failure.
    await sendOrderEmails(order);

    return NextResponse.json({ id: order.id, total: order.total });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 400 },
    );
  }
}
