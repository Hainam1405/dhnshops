import type { Product } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

export function ProductGrid({
  products,
  className,
  priorityCount = 0,
}: {
  products: Product[];
  className?: string;
  priorityCount?: number;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {products.map((p, i) => (
        <Reveal key={p._id} delay={(i % 4) * 0.06}>
          <ProductCard product={p} priority={i < priorityCount} />
        </Reveal>
      ))}
    </div>
  );
}
