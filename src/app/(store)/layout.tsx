import { getShowcaseProducts } from "@/lib/products";
import { Providers } from "@/components/providers/Providers";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { CartRecovery } from "@/components/layout/CartRecovery";
import { Cursor } from "@/components/motion/Cursor";
import { PageTransition } from "@/components/motion/PageTransition";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const suggestions = await getShowcaseProducts(6);

  return (
    <Providers>
      <div className="grain">
        <Cursor />
        <ScrollProgress />
        <AnnouncementBar />
        <Nav />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <CartDrawer suggestions={suggestions} />
        <CartRecovery />
      </div>
    </Providers>
  );
}
