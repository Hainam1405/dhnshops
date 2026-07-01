import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createProduct, listCategories, listProducts } from "@/lib/admin/store";

export const runtime = "nodejs";

export async function GET() {
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);
  return NextResponse.json({ products, categories });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body?.title || typeof body.price !== "number" || !body.category) {
    return NextResponse.json({ error: "title, price and category are required" }, { status: 400 });
  }
  const product = await createProduct(body);
  revalidatePath("/", "layout");
  return NextResponse.json({ product });
}
