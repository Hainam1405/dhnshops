import { Marquee } from "@/components/motion/Marquee";

const ITEMS = [
  { k: "01", title: "Printed on demand", body: "Nothing is made until you order it — zero deadstock, zero waste." },
  { k: "02", title: "Made near you", body: "A global network prints in 32 countries, so most orders ship domestically." },
  { k: "03", title: "Carbon-neutral", body: "Every order's shipping footprint is measured and offset by default." },
  { k: "04", title: "30-day returns", body: "Not in love with the fit? Send it back within 30 days, no questions." },
];

// Fade the row in and out at the edges.
const fadeMask = {
  WebkitMaskImage: "linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent)",
  maskImage: "linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent)",
};

export function TrustBar() {
  return (
    <section className="border-y border-line" style={fadeMask}>
      <Marquee durationSeconds={32} pauseOnHover>
        {ITEMS.map((it) => (
          <div
            key={it.k}
            className="flex w-[300px] shrink-0 flex-col whitespace-normal border-r border-line px-8 py-10"
          >
            <p className="font-mono text-xs text-accent">{it.k}</p>
            <h3 className="mt-4 text-lg font-medium tracking-tight">{it.title}</h3>
            <p className="mt-2 text-sm text-muted">{it.body}</p>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
