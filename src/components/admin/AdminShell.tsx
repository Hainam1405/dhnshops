"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/config";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

/** Shared chrome for authenticated admin pages: sticky top bar + content well. */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/admin/login");
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-line bg-base/80 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
          <div className="flex items-center gap-3 md:gap-5">
            <Link
              href="/admin"
              aria-label={`${SITE.name} admin`}
              className="inline-flex items-center gap-2.5"
            >
              <Image src="/logo.png" alt={SITE.name} width={1254} height={1254} className="h-8 w-auto" />
              <span className="hidden font-mono text-[11px] uppercase tracking-widest text-muted sm:inline">
                Admin
              </span>
            </Link>
            <nav className="flex items-center gap-1">
              {TABS.map((t) => {
                const active =
                  t.href === "/admin" ? pathname === "/admin" : pathname.startsWith(t.href);
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors",
                      active ? "bg-accent text-accent-ink" : "text-muted hover:text-fg",
                    )}
                  >
                    {t.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/"
              className="hidden font-mono text-[11px] uppercase tracking-widest text-muted hover:text-fg sm:inline"
            >
              View store ↗
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-muted transition-colors hover:border-danger hover:text-danger"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 md:px-8">{children}</main>
    </div>
  );
}
