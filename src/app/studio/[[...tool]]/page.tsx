import Link from "next/link";
import { NextStudio } from "next-sanity/studio";
import { projectId } from "@/sanity/env";
import config from "../../../../sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

function StudioNotConfigured() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">Sanity Studio</p>
      <h1 className="display mt-4 text-4xl">Connect your catalog</h1>
      <p className="mt-4 text-muted">
        The storefront is running on sample data. To manage products yourself, connect a free Sanity
        project:
      </p>
      <ol className="mt-8 space-y-4 text-sm text-fg">
        <li>
          <span className="font-mono text-accent">1.</span> Create a project at{" "}
          <a href="https://www.sanity.io/manage" className="underline">
            sanity.io/manage
          </a>{" "}
          and copy its Project ID.
        </li>
        <li>
          <span className="font-mono text-accent">2.</span> Copy{" "}
          <code className="rounded bg-surface px-1.5 py-0.5">.env.example</code> to{" "}
          <code className="rounded bg-surface px-1.5 py-0.5">.env.local</code> and set{" "}
          <code className="rounded bg-surface px-1.5 py-0.5">NEXT_PUBLIC_SANITY_PROJECT_ID</code>.
        </li>
        <li>
          <span className="font-mono text-accent">3.</span> Restart the dev server, then reload{" "}
          <code className="rounded bg-surface px-1.5 py-0.5">/studio</code> to start adding products.
        </li>
      </ol>
      <Link href="/" className="mt-10 font-mono text-xs uppercase tracking-widest text-muted hover:text-fg">
        ← Back to store
      </Link>
    </div>
  );
}

export default function StudioPage() {
  if (!projectId) return <StudioNotConfigured />;
  return <NextStudio config={config} />;
}
