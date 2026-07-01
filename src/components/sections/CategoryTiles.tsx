import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowIcon } from "@/components/ui/icons";

export function CategoryTiles({ categories }: { categories: Category[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {categories.map((c, i) => (
        <Reveal key={c.slug} delay={i * 0.08}>
          <Link
            href={`/collections/${c.slug}`}
            className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-surface"
          >
            <Image
              src={c.heroImage}
              alt={c.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover opacity-70 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-base via-base/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="display text-3xl">{c.title}</h3>
              <p className="mt-1 max-w-[26ch] text-sm text-muted">{c.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
                Explore
                <ArrowIcon
                  width={16}
                  height={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
