import type { Order } from "@/lib/admin/orders";
import { SITE } from "@/lib/config";
import { formatPrice } from "@/lib/utils";

/**
 * Transactional email for orders, via the Resend HTTP API.
 *
 * Env-gated like the rest of the app: with RESEND_API_KEY unset (local dev,
 * previews) every send is a silent no-op, so checkout keeps working offline.
 *
 * Sending must NEVER break an order that has already been persisted and — once
 * payments are wired — charged. Every function here swallows its errors and
 * reports success as a boolean instead of throwing.
 *
 * Required env:
 *   RESEND_API_KEY    – from https://resend.com/api-keys
 *   ORDER_EMAIL_FROM  – e.g. "DHN Shop <orders@dhnshops.com>" (domain must be
 *                       verified in Resend, otherwise sends are rejected)
 *   ORDER_NOTIFY_TO   – where the owner's copy lands (defaults to SITE.email)
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dhnshops.com";

export function emailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.ORDER_EMAIL_FROM);
}

/** Escape untrusted values before they land in an HTML email body. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Product images are stored as site-relative paths; email clients need absolute. */
function absolute(url: string): string {
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

async function send(to: string, subject: string, html: string): Promise<boolean> {
  if (!emailEnabled()) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: process.env.ORDER_EMAIL_FROM, to, subject, html }),
    });
    if (!res.ok) {
      console.error(`[email] Resend rejected the send: ${res.status} ${await res.text()}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] send failed:", err);
    return false;
  }
}

function itemRows(order: Order): string {
  return order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #e6e5df;">
          <img src="${esc(absolute(i.image))}" width="56" height="70"
               alt="" style="border-radius:6px;object-fit:cover;vertical-align:middle;" />
        </td>
        <td style="padding:12px;border-bottom:1px solid #e6e5df;">
          <div style="font-weight:600;color:#17181d;">${esc(i.title)}</div>
          <div style="font-size:13px;color:#5b5d68;">${esc(i.color)} &middot; ${esc(i.size)} &middot; Qty ${i.quantity}</div>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #e6e5df;text-align:right;white-space:nowrap;color:#17181d;">
          ${formatPrice(i.price * i.quantity)}
        </td>
      </tr>`,
    )
    .join("");
}

function totalsBlock(order: Order): string {
  const row = (label: string, value: string, bold = false) => `
    <tr>
      <td style="padding:4px 0;color:${bold ? "#17181d" : "#5b5d68"};font-weight:${bold ? 700 : 400};">${label}</td>
      <td style="padding:4px 0;text-align:right;color:#17181d;font-weight:${bold ? 700 : 400};">${value}</td>
    </tr>`;
  return `
    <table style="width:100%;margin-top:16px;font-size:14px;">
      ${row("Subtotal", formatPrice(order.subtotal))}
      ${row("Shipping", order.shipping === 0 ? "Free" : formatPrice(order.shipping))}
      ${row("Total", formatPrice(order.total), true)}
    </table>`;
}

function shell(heading: string, intro: string, order: Order): string {
  const c = order.customer;
  return `
  <div style="background:#f6f5f0;padding:32px 0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e6e5df;border-radius:16px;padding:32px;">
      <div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#5b5d68;">${esc(SITE.name)}</div>
      <h1 style="margin:12px 0 0;font-size:26px;color:#17181d;">${esc(heading)}</h1>
      <p style="margin:12px 0 0;color:#5b5d68;line-height:1.6;">${intro}</p>

      <p style="margin:24px 0 0;font-size:13px;color:#5b5d68;">Order number</p>
      <p style="margin:2px 0 0;font-size:18px;font-weight:700;color:#17181d;">${esc(order.id)}</p>

      <table style="width:100%;margin-top:24px;border-collapse:collapse;font-size:14px;">
        ${itemRows(order)}
      </table>
      ${totalsBlock(order)}

      <p style="margin:28px 0 4px;font-size:13px;color:#5b5d68;">Shipping to</p>
      <p style="margin:0;color:#17181d;line-height:1.6;">
        ${esc(`${c.firstName} ${c.lastName}`.trim())}<br/>
        ${esc(c.address)}<br/>
        ${esc(c.city)} ${esc(c.zip)}<br/>
        ${esc(c.country)}
      </p>

      <p style="margin:28px 0 0;font-size:13px;color:#5b5d68;line-height:1.6;">
        Questions? Just reply to this email, or read our
        <a href="${SITE_URL}/legal/shipping" style="color:#4d7c0f;">shipping</a> and
        <a href="${SITE_URL}/legal/returns" style="color:#4d7c0f;">returns</a> policies.
      </p>
    </div>
  </div>`;
}

/**
 * Email the customer their confirmation and the owner a heads-up.
 *
 * Returns which sends succeeded. Never throws — a dead mail provider must not
 * turn a paid order into an error page.
 */
export async function sendOrderEmails(order: Order): Promise<{
  customer: boolean;
  owner: boolean;
}> {
  if (!emailEnabled()) return { customer: false, owner: false };

  const customerHtml = shell(
    "Thanks — we're on it.",
    `Your order is confirmed. Each piece is printed on demand, so it leaves our hub in about 48 hours. We'll email tracking the moment it ships.`,
    order,
  );

  const ownerHtml = shell(
    "New order",
    `${esc(order.customer.email)} just placed an order for ${order.itemCount} item${order.itemCount === 1 ? "" : "s"}.`,
    order,
  );

  const notifyTo = process.env.ORDER_NOTIFY_TO || SITE.email;

  const [customer, owner] = await Promise.all([
    send(order.customer.email, `${SITE.name} order ${order.id}`, customerHtml),
    send(notifyTo, `New order ${order.id} — ${formatPrice(order.total)}`, ownerHtml),
  ]);

  return { customer, owner };
}
