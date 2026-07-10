import { getCategories, getFeaturedProducts, getShowcaseProducts } from "@/lib/products";
import { SITE } from "@/lib/config";
import { Hero } from "@/components/sections/Hero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { CategoryTiles } from "@/components/sections/CategoryTiles";
import { FeaturedScroll } from "@/components/sections/FeaturedScroll";
import { BenefitStory } from "@/components/sections/BenefitStory";
import { FAQ } from "@/components/sections/FAQ";
import { TrustBar } from "@/components/sections/TrustBar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/Button";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { EmailCapture } from "@/components/layout/EmailCapture";

export default async function Home() {
  const [categories, showcase, featured] = await Promise.all([
    getCategories(),
    getShowcaseProducts(8),
    getFeaturedProducts(),
  ]);

  // Source the story visuals from the live catalog so they stay on-brand.
  const imgPool = [...showcase, ...featured]
    .map((p) => p.images?.[0])
    .filter((src): src is string => Boolean(src));
  const storyImg = (i: number) => imgPool[i] ?? imgPool[0];
  const storySteps =
    imgPool.length > 0
      ? [
          {
            tag: "01 — Design",
            title: "Art worth wearing",
            body: "Every drop starts as a considered piece of design — bold graphics and heavyweight blanks chosen to look as good in ten years as they do today.",
            image: storyImg(0),
          },
          {
            tag: "02 — Print",
            title: "Printed the moment you order",
            body: "Nothing sits in a warehouse. Your piece is printed on demand with water-based DTG at the production hub nearest you — zero deadstock, far less waste.",
            image: storyImg(1),
          },
          {
            tag: "03 — Deliver",
            title: "At your door in days",
            body: "Dispatched in about 48 hours and shipped from the production hub nearest you, so most orders travel domestically rather than across the world.",
            image: storyImg(2),
          },
        ]
      : [];

  return (
    <>
      <Hero />

      {/* running headline */}
      <section className="border-y border-line py-5">
        <Marquee durationSeconds={28}>
          <span className="display mx-8 text-4xl text-fg md:text-6xl">
            NEW SEASON ✦ LIMITED DROPS ✦ PRINTED ON DEMAND ✦ WORLDWIDE SHIPPING ✦{" "}
          </span>
        </Marquee>
      </section>

      {/* categories */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-8">
        <SectionHeading eyebrow="Shop by category" title="Choose your canvas" />
        <div className="mt-12">
          <CategoryTiles categories={categories} />
        </div>
      </section>

      {/* featured horizontal scroll */}
      <FeaturedScroll products={featured} />

      {/* scroll storytelling — design → print → deliver */}
      {storySteps.length > 0 && (
        <BenefitStory
          eyebrow="How it works"
          heading="From screen to doorstep"
          steps={storySteps}
        />
      )}

      {/* the catalogue — no sales yet, so nothing here claims to be a bestseller */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-8">
        <SectionHeading
          eyebrow="New in"
          title="Latest designs"
          action={
            <Button href="/shop" variant="outline" size="sm">
              View all
            </Button>
          }
        />
        <ProductGrid className="mt-12" products={showcase} />
      </section>

      {/* FAQ accordion */}
      <FAQ />

      <TrustBar />

      {/* closing CTA */}
      <section className="mx-auto max-w-[1400px] px-5 py-28 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface px-8 py-20 text-center md:py-28">
            <div
              className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full blur-[110px]"
              style={{ background: "color-mix(in srgb, var(--color-accent) 30%, transparent)" }}
            />
            <p className="eyebrow">Join the list</p>
            <h2 className="display mx-auto mt-4 max-w-2xl text-4xl md:text-6xl">
              Be first to see the next {SITE.name} drop
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted">
              One email when new designs land. No spam, unsubscribe any time.
            </p>
            <EmailCapture className="mx-auto mt-8 max-w-sm" />
          </div>
        </Reveal>
      </section>
    </>
  );
}
