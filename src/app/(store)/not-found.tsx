import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-5 text-center">
      <p className="display text-8xl text-accent">404</p>
      <h1 className="display mt-4 text-3xl">Lost in the void</h1>
      <p className="mt-3 text-muted">The page or product you&rsquo;re looking for doesn&rsquo;t exist.</p>
      <Link
        href="/shop"
        className="mt-8 rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-accent-ink hover:bg-fg"
      >
        Back to the shop
      </Link>
    </div>
  );
}
