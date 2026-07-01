import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-6", className)}>
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display mt-3 text-4xl md:text-6xl">{title}</h2>
      </Reveal>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
