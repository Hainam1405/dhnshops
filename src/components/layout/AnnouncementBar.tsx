import { Marquee } from "@/components/motion/Marquee";

const MESSAGES = [
  "Free carbon-neutral shipping over $75",
  "Printed on demand at the hub nearest you",
  "Numbered limited drops",
  "30-day easy returns",
];

export function AnnouncementBar() {
  const items = [...MESSAGES, ...MESSAGES, ...MESSAGES];
  return (
    <div className="border-b border-line bg-base">
      <Marquee durationSeconds={45} className="py-2.5">
        {items.map((t, i) => (
          <span
            key={i}
            className="mx-6 inline-flex items-center gap-6 font-mono text-[11px] uppercase tracking-widest text-muted"
          >
            {t}
            <span className="text-accent">✦</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
