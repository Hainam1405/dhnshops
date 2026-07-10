"use client";

import { useState } from "react";
import { ArrowIcon, CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * Email capture. Posts to /api/subscribe, which persists the address.
 *
 * It used to discard the email and reply "check your inbox for 15% off" — no
 * list, no email, no discount code. Never promise the visitor something the
 * system cannot deliver.
 */
export function EmailCapture({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "sending") return;

    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Could not sign you up. Try again.");
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Could not sign you up. Try again.");
    }
  }

  if (status === "done") {
    return (
      <p className={cn("flex items-center gap-2 text-sm text-accent", className)}>
        <CheckIcon width={18} height={18} />
        You&rsquo;re on the list.
      </p>
    );
  }

  return (
    <div className={className}>
      <form
        onSubmit={submit}
        className="flex items-center gap-2 border-b border-line-strong pb-2 focus-within:border-accent"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          disabled={status === "sending"}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="flex items-center gap-1.5 whitespace-nowrap font-mono text-xs uppercase tracking-widest text-fg hover:text-accent disabled:opacity-60"
        >
          {status === "sending" ? "Joining…" : "Join"}
          <ArrowIcon width={16} height={16} />
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
