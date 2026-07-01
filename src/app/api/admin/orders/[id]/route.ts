import { NextResponse } from "next/server";
import { setOrderStatus } from "@/lib/admin/orders";

export const runtime = "nodejs";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { status?: string };
  const status = body.status === "fulfilled" ? "fulfilled" : "new";
  const order = await setOrderStatus(id, status);
  if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ order });
}
