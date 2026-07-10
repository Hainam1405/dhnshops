"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { selectSubtotal, useCart } from "@/lib/store/cart";
import { useHasMounted } from "@/lib/hooks/useHasMounted";
import { formatPrice } from "@/lib/utils";
import { SITE } from "@/lib/config";
import { CheckIcon, CloseIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";

export default function CartPage() {
  const mounted = useHasMounted();
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const subtotal = useCart(selectSubtotal);

  const [confirmation, setConfirmation] = useState<{ id: string; email: string } | null>(null);
  const [email, setEmail] = useState("");
  const [placing, setPlacing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Mirrors the server-side calculation in @/lib/admin/orders — both read SITE.
  const shipping = subtotal === 0 || subtotal >= SITE.freeShippingThreshold ? 0 : SITE.flatShipping;
  const total = subtotal + shipping;

  async function placeOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCheckoutError(null);
    // Read fields synchronously before any await (currentTarget is nulled afterwards).
    const fd = new FormData(e.currentTarget);
    const customer = {
      email: String(fd.get("email") ?? ""),
      firstName: String(fd.get("firstName") ?? ""),
      lastName: String(fd.get("lastName") ?? ""),
      address: String(fd.get("address") ?? ""),
      city: String(fd.get("city") ?? ""),
      country: String(fd.get("country") ?? ""),
      zip: String(fd.get("zip") ?? ""),
    };
    const payloadItems = items.map((i) => ({
      productId: i.productId,
      slug: i.slug,
      title: i.title,
      price: i.price,
      color: i.color,
      size: i.size,
      quantity: i.quantity,
      image: i.image,
    }));
    // Payment (Stripe) + Gelato fulfillment are added later; this records the order.
    setPlacing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, items: payloadItems }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Checkout failed");
      setConfirmation({ id: json.id, email: customer.email });
      clear();
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setPlacing(false);
    }
  }

  if (!mounted) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-32 md:px-8">
        <p className="text-muted">Loading your bag…</p>
      </div>
    );
  }

  if (confirmation) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-32 text-center md:px-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-ink">
          <CheckIcon width={28} height={28} />
        </div>
        <h1 className="display mt-8 text-4xl">Order confirmed</h1>
        <p className="mt-4 text-muted">
          Thanks — a confirmation is on its way to{" "}
          <span className="text-fg">{confirmation.email || "your inbox"}</span>. Your order number is{" "}
          <span className="font-mono text-accent">{confirmation.id}</span>.
        </p>
        <p className="mt-4 max-w-sm text-xs text-muted">
          This is a demo checkout. Real payments (Stripe) and print fulfillment (Gelato) are added in
          the next phase.
        </p>
        <Link
          href="/shop"
          className="mt-8 rounded-full bg-fg px-6 py-3 font-mono text-xs uppercase tracking-widest text-accent-ink hover:bg-accent"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-32 text-center md:px-8">
        <h1 className="display text-4xl">Your bag is empty</h1>
        <p className="mt-4 text-muted">Find something worth printing.</p>
        <Link
          href="/shop"
          className="mt-8 rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-accent-ink hover:bg-fg"
        >
          Browse the catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
      <h1 className="display text-5xl md:text-6xl">Your bag</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        {/* line items */}
        <ul className="divide-y divide-line border-y border-line">
          {items.map((item) => (
            <li key={item.key} className="flex gap-5 py-6">
              <div className="relative h-32 w-26 shrink-0 overflow-hidden rounded-xl bg-surface">
                <Image src={item.image} alt={item.title} fill sizes="104px" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link href={`/products/${item.slug}`} className="font-medium hover:text-accent">
                      {item.title}
                    </Link>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted">
                      {item.color} · {item.size}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.key)}
                    aria-label="Remove"
                    className="text-muted hover:text-danger"
                  >
                    <CloseIcon width={18} height={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 rounded-full border border-line px-3 py-1.5">
                    <button type="button" onClick={() => setQty(item.key, item.quantity - 1)} aria-label="Decrease">
                      <MinusIcon width={14} height={14} />
                    </button>
                    <span className="w-5 text-center font-mono text-xs">{item.quantity}</span>
                    <button type="button" onClick={() => setQty(item.key, item.quantity + 1)} aria-label="Increase">
                      <PlusIcon width={14} height={14} />
                    </button>
                  </div>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* summary + checkout */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted">Order summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-medium">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>

            <form onSubmit={placeOrder} className="mt-6 space-y-3">
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-lg border border-line bg-base px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent"
              />
              <div className="grid grid-cols-2 gap-3">
                <input name="firstName" required placeholder="First name" className="rounded-lg border border-line bg-base px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent" />
                <input name="lastName" required placeholder="Last name" className="rounded-lg border border-line bg-base px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent" />
              </div>
              <input name="address" required placeholder="Address" className="w-full rounded-lg border border-line bg-base px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent" />
              <div className="grid grid-cols-3 gap-3">
                <input name="city" required placeholder="City" className="rounded-lg border border-line bg-base px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent" />
                <input name="country" required placeholder="Country" className="rounded-lg border border-line bg-base px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent" />
                <input name="zip" required placeholder="ZIP" className="rounded-lg border border-line bg-base px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent" />
              </div>
              {checkoutError && <p className="text-sm text-danger">{checkoutError}</p>}
              <button
                type="submit"
                disabled={placing}
                className="mt-2 h-13 w-full rounded-full bg-accent py-4 font-mono text-xs uppercase tracking-widest text-accent-ink hover:bg-fg disabled:opacity-50"
              >
                {placing ? "Placing order…" : `Pay ${formatPrice(total)}`}
              </button>
            </form>
            <p className="mt-4 text-center text-xs text-muted">
              Demo checkout — order is recorded; Stripe payment & Gelato fulfillment are added later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
