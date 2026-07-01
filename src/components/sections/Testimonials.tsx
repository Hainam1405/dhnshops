import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { StarRating } from "@/components/ui/StarRating";

const QUOTES = [
  {
    text: "The print quality genuinely surprised me — this is not your usual print-on-demand feel. Heavyweight and razor sharp.",
    author: "Maya R.",
    location: "Berlin",
  },
  {
    text: "Ordered on a Monday, it arrived Thursday from a hub 40 minutes away. Carbon-neutral shipping is the cherry on top.",
    author: "Dorian K.",
    location: "Austin",
  },
  {
    text: "The 3D preview matched the real thing exactly. I've already bought the whole limited drop.",
    author: "Priya S.",
    location: "London",
  },
  {
    text: "Fit is spot on and the colours are exactly as pictured. The little details make it feel premium.",
    author: "Noah B.",
    location: "Toronto",
  },
  {
    text: "Reordered three times now. Consistent quality and the returns process is genuinely painless.",
    author: "Amara O.",
    location: "Lagos",
  },
];

// Fade the cards in and out at the edges of the moving row.
const fadeMask = {
  WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
  maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
};

export function Testimonials() {
  return (
    <section className="py-24">
      <Reveal>
        <p className="eyebrow text-center">What people say</p>
      </Reveal>
      <div className="mt-14" style={fadeMask}>
        <Marquee durationSeconds={44} pauseOnHover>
          {QUOTES.map((q) => (
            <figure
              key={q.author}
              className="mx-3 flex min-h-[240px] w-[360px] shrink-0 flex-col justify-between whitespace-normal rounded-2xl border border-line bg-surface p-8 shadow-soft md:w-[420px]"
            >
              <StarRating rating={5} showValue={false} />
              <blockquote className="mt-5 text-lg leading-relaxed text-fg">
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <figcaption className="mt-6 font-mono text-xs uppercase tracking-widest text-muted">
                {q.author} — {q.location}
              </figcaption>
            </figure>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
