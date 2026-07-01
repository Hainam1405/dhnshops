"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NAV_LINKS, SITE } from "@/lib/config";
import { selectCount, useCart } from "@/lib/store/cart";
import { useHasMounted } from "@/lib/hooks/useHasMounted";
import { BagIcon, CloseIcon, MenuIcon } from "@/components/ui/icons";

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const count = useCart(selectCount);
  const openCart = useCart((s) => s.open);
  const mounted = useHasMounted();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-base/75 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-3 items-center px-5 md:px-8">
        {/* left */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" aria-label={SITE.name} className="inline-flex items-center">
            <Image
              src="/logo.png"
              alt={SITE.name}
              width={1254}
              height={1254}
              priority
              className="h-10 w-auto"
            />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="md:hidden"
          >
            <MenuIcon width={22} height={22} />
          </button>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="link-underline font-mono text-xs uppercase tracking-widest text-muted hover:text-fg"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* center — shop name wordmark (hidden on mobile to avoid crowding) */}
        <div className="hidden justify-center md:flex">
          <Link href="/" className="display text-xl leading-none">
            {SITE.name}
          </Link>
        </div>

        {/* right */}
        <div className="flex items-center justify-end gap-5">
          <Link
            href="/shop"
            className="hidden font-mono text-xs uppercase tracking-widest text-muted hover:text-fg md:inline"
          >
            All
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative flex items-center"
            aria-label="Open cart"
          >
            <BagIcon width={22} height={22} />
            {mounted && count > 0 && (
              <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-mono text-[10px] text-accent-ink">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col bg-base p-6 md:hidden"
          >
            <div className="flex items-center justify-between">
              <Image src="/logo.png" alt={SITE.name} width={1254} height={1254} className="h-10 w-auto" />
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <CloseIcon width={24} height={24} />
              </button>
            </div>
            <nav className="mt-16 flex flex-col gap-2">
              {[{ label: "All products", href: "/shop" }, ...NAV_LINKS].map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="display block py-2 text-5xl"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
