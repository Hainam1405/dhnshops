import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteProduct, updateProduct } from "@/lib/admin/store";

export const runtime = "nodejs";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const product = await updateProduct(id, body);
  if (!product) return NextResponse.json({ error: "not found" }, { status: 404 });
  revalidatePath("/", "layout");
  return NextResponse.json({ product });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = await deleteProduct(id);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
