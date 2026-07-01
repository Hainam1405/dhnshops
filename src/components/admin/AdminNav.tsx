"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

export function AdminNav() {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/admin/login");
  }

  return (
    <nav className="flex items-center gap-2">
      {TABS.map((t) => {
        const active = t.href === "/admin" ? pathname === "/admin" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors",
              active ? "bg-accent text-accent-ink" : "text-muted hover:text-fg",
            )}
          >
            {t.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={logout}
        className="rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-muted hover:text-danger"
      >
        Log out
      </button>
    </nav>
  );
}
