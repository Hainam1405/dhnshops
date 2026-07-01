"use client";

import { useState } from "react";
import { SITE } from "@/lib/config";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Login failed");
      }
      const from = new URLSearchParams(window.location.search).get("from");
      const target = from && from.startsWith("/admin") ? from : "/admin";
      window.location.assign(target); // hard nav so middleware sees the new cookie
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">{SITE.name} admin</p>
      <h1 className="display mt-3 text-4xl">Sign in</h1>
      <form onSubmit={submit} className="mt-8 space-y-3">
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="h-12 w-full rounded-full bg-accent font-mono text-xs uppercase tracking-widest text-accent-ink hover:bg-fg disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-muted">
        Protected area. Set <code className="text-fg">ADMIN_PASSWORD</code> in{" "}
        <code className="text-fg">.env.local</code> (default is <code className="text-fg">admin</code>).
      </p>
    </div>
  );
}
