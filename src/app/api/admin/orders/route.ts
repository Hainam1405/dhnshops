import { NextResponse } from "next/server";
import { getStats, listOrders } from "@/lib/admin/orders";

export const runtime = "nodejs";

export async function GET() {
  const [orders, stats] = await Promise.all([listOrders(), getStats()]);
  return NextResponse.json({ orders, stats });
}
