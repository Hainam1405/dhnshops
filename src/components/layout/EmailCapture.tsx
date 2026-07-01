"use client";

import { useState } from "react";
import { ArrowIcon, CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * Email capture. On submit it just confirms locally — this is the hook point
 * for a welcome-series automation (Klaviyo/Omnisend) once you wire it up.
 */
export function EmailCapture({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO(automation): POST to /api/subscribe -> Klaviyo/Omnisend welcome flow.
    setDone(true);
  }

  if (done) {
    return (
      <p className={cn("flex items-center gap-2 text-sm text-accent", className)}>
        <CheckIcon width={18} height={18} />
        You&rsquo;re in — check your inbox for 15% off.
      </p>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        "flex items-center gap-2 border-b border-line-strong pb-2 focus-within:border-accent",
        className,
      )}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
      />
      <button
        type="submit"
        className="flex items-center gap-1.5 whitespace-nowrap font-mono text-xs uppercase tracking-widest text-fg hover:text-accent"
      >
        Join
        <ArrowIcon width={16} height={16} />
      </button>
    </form>
  );
}
