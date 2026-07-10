import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/config";
import { EmailCapture } from "./EmailCapture";
import { Marquee } from "@/components/motion/Marquee";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/shop" },
      ...NAV_LINKS.map((l) => ({ label: l.label, href: l.href })),
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/legal/contact" },
      { label: "Shipping", href: "/legal/shipping" },
      { label: "Returns & refunds", href: "/legal/returns" },
      { label: "Email us", href: `mailto:${SITE.email}` },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Manage catalog", href: "/admin" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <h2 className="display text-2xl">{SITE.name}</h2>
            <p className="mt-4 max-w-xs text-sm text-muted">{SITE.tagline}</p>
            <p className="mt-8 font-mono text-xs uppercase tracking-widest text-muted">
              Get 15% off your first drop
            </p>
            <EmailCapture className="mt-3 max-w-sm" />
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-xs uppercase tracking-widest text-muted">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="link-underline text-sm text-fg hover:text-accent">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-y border-line py-4">
        <Marquee durationSeconds={30}>
          <span className="display mx-6 text-5xl text-surface-2 [-webkit-text-stroke:1px_var(--color-line-strong)]">
            {`${SITE.name} — PRINT ON DEMAND — WORLDWIDE — `.repeat(4)}
          </span>
        </Marquee>
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-5 py-8 md:flex-row md:px-8">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
          © {SITE.name} — Built with Next.js + Gelato-ready
        </p>
        <div className="flex gap-5 font-mono text-[11px] uppercase tracking-widest text-muted">
          <a href={SITE.social.instagram} className="hover:text-fg">Instagram</a>
          <a href={SITE.social.tiktok} className="hover:text-fg">TikTok</a>
          <a href={SITE.social.twitter} className="hover:text-fg">X</a>
        </div>
      </div>
    </footer>
  );
}
