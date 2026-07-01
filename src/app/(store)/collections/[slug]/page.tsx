import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getAllProducts,
  getCategories,
  getCategory,
  getProductsByCategory,
} from "@/lib/products";
import { ProductGrid } from "@/components/shop/ProductGrid";

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  return { title: category?.title ?? "Collection", description: category?.description };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const products =
    slug === "limited"
      ? (await getAllProducts()).filter((p) => p.badges.includes("Limited"))
      : await getProductsByCategory(slug);

  return (
    <div>
      <header className="relative flex min-h-[42vh] items-end overflow-hidden">
        <Image
          src={category.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base via-base/40 to-transparent" />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-12 md:px-8">
          <p className="eyebrow">Collection</p>
          <h1 className="display mt-3 text-6xl md:text-8xl">{category.title}</h1>
          <p className="mt-3 max-w-md text-muted">{category.description}</p>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8">
        {products.length > 0 ? (
          <ProductGrid products={products} priorityCount={4} />
        ) : (
          <p className="py-20 text-center text-muted">No products in this collection yet.</p>
        )}
      </div>
    </div>
  );
}
