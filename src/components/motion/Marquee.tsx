import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Seamless infinite ticker. Content is rendered twice and translated -50%
 * (see the `marquee` keyframe in globals.css).
 */
export function Marquee({
  children,
  className,
  durationSeconds = 30,
  reverse = false,
  pauseOnHover = false,
}: {
  children: ReactNode;
  className?: string;
  durationSeconds?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
}) {
  return (
    <div className={cn("overflow-hidden whitespace-nowrap", pauseOnHover && "group", className)}>
      <div
        className={cn(
          "marquee-track inline-flex w-max",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={
          {
            "--marquee-duration": `${durationSeconds}s`,
            animationName: "marquee",
            animationDuration: "var(--marquee-duration)",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDirection: reverse ? "reverse" : "normal",
          } as CSSProperties
        }
      >
        <span className="inline-flex items-center">{children}</span>
        <span className="inline-flex items-center" aria-hidden>
          {children}
        </span>
      </div>
    </div>
  );
}
