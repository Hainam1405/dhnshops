import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

// Only accept real image types (prevents e.g. .html/.svg stored-XSS uploads).
const ALLOWED = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no file" }, { status: 400 });
  }

  const ext = (path.extname(file.name) || ".png").toLowerCase();
  if (!ALLOWED.has(ext) || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
  }

  const name = `${Date.now()}-${Math.round(Math.random() * 1e9).toString(36)}${ext}`;

  // Production (serverless): store in Vercel Blob so uploads persist.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`uploads/${name}`, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url });
  }

  // On Vercel the filesystem is read-only, so the local-dev path below cannot
  // work. Say so plainly — whoever is listing products needs to know which knob
  // to turn, not read a stack trace.
  if (process.env.VERCEL) {
    return NextResponse.json(
      {
        error:
          "Image uploads aren't configured. In Vercel, open Storage → Blob, connect a store to this project, then redeploy.",
      },
      { status: 503 },
    );
  }

  // Local dev: write to public/uploads.
  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), bytes);
    return NextResponse.json({ url: `/uploads/${name}` });
  } catch {
    return NextResponse.json({ error: "Could not save the image." }, { status: 500 });
  }
}
