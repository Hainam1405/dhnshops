import { cn } from "@/lib/utils";

const STAR_PATH =
  "M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.9 6.1 21.5l1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z";

function Row({ className }: { className?: string }) {
  return (
    <span className={cn("flex shrink-0", className)} style={{ width: 75 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d={STAR_PATH} />
        </svg>
      ))}
    </span>
  );
}

/**
 * Deterministic (SSR-safe) star rating using a clipped accent overlay.
 *
 * Renders nothing when `count` is 0: a product nobody has reviewed must not
 * advertise "0.0 (0)" — that reads as a bug, and an empty star row reads as a
 * bad rating. Callers can therefore pass a product's rating unconditionally.
 */
export function StarRating({
  rating,
  count,
  className,
  showValue = true,
}: {
  rating: number;
  count?: number;
  className?: string;
  showValue?: boolean;
}) {
  if (count === 0) return null;

  const pct = (Math.max(0, Math.min(5, rating)) / 5) * 100;
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className="relative inline-flex"
        style={{ width: 75, height: 15 }}
        role="img"
        aria-label={`Rated ${rating} out of 5`}
      >
        <Row className="absolute inset-0 text-fg/15" />
        <span className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
          <Row className="text-accent" />
        </span>
      </span>
      {showValue && (
        <span className="font-mono text-xs text-muted">
          {rating.toFixed(1)}
          {count != null ? ` (${count})` : ""}
        </span>
      )}
    </span>
  );
}
