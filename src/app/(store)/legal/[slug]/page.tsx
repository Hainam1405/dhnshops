import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LEGAL_DOCS, LEGAL_UPDATED, getLegalDoc } from "@/lib/legal";

export function generateStaticParams() {
  return LEGAL_DOCS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) return { title: "Not found" };
  return { title: doc.title, description: doc.summary };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Legal</p>
        <h1 className="display mt-3 text-4xl md:text-6xl">{doc.title}</h1>
        <p className="mt-4 text-muted">{doc.summary}</p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-muted">
          Last updated {LEGAL_UPDATED}
        </p>

        <div className="mt-14 space-y-12">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-medium tracking-tight md:text-2xl">
                {section.heading}
              </h2>

              {section.body?.map((paragraph) => (
                <p key={paragraph} className="mt-4 leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}

              {section.bullets && (
                <ul className="mt-4 space-y-2.5">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 leading-relaxed text-muted">
                      <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <nav className="mt-20 border-t border-line pt-8">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            Other policies
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_DOCS.filter((d) => d.slug !== doc.slug).map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/legal/${d.slug}`}
                  className="link-underline text-sm text-fg hover:text-accent"
                >
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
