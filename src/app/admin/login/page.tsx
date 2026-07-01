"use client";

import Image from "next/image";
import Link from "next/link";
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* soft light backdrop */}
      <div className="aurora absolute inset-0 -z-10 opacity-70" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-base" />

      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-line bg-surface/90 p-8 shadow-lift backdrop-blur-xl">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/logo.png"
              alt={SITE.name}
              width={1254}
              height={1254}
              priority
              className="h-14 w-auto"
            />
            <p className="eyebrow mt-5">{SITE.name} · Admin</p>
            <h1 className="display mt-2 text-3xl">Sign in</h1>
            <p className="mt-2 text-sm text-muted">Manage your catalog and orders.</p>
          </div>

          <form onSubmit={submit} className="mt-7 space-y-3">
            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-line bg-base px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="h-12 w-full rounded-full bg-accent font-mono text-xs uppercase tracking-widest text-accent-ink transition-colors hover:bg-fg active:scale-[0.99] disabled:opacity-50"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-6 border-t border-line pt-4">
            <p className="text-center text-[11px] leading-relaxed text-muted">
              Protected area. Configure <code className="text-fg">ADMIN_PASSWORD</code> in{" "}
              <code className="text-fg">.env.local</code>.
            </p>
          </div>
        </div>

        <div className="mt-5 text-center">
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-widest text-muted hover:text-fg"
          >
            ← Back to store
          </Link>
        </div>
      </div>
    </div>
  );
}
