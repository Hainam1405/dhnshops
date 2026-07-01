"use client";

import Image from "next/image";
import { useState } from "react";
import { CloseIcon } from "@/components/ui/icons";

const MAX_MB = 15;

export function ImageUploader({
  value,
  onChange,
  multiple = true,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    const uploaded: string[] = [];
    const errors: string[] = [];

    try {
      for (const file of Array.from(files)) {
        if (file.size > MAX_MB * 1024 * 1024) {
          errors.push(`${file.name} is over ${MAX_MB}MB`);
          continue;
        }
        const fd = new FormData();
        fd.append("file", file);
        try {
          const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
          const json = await res.json().catch(() => ({}));
          if (!res.ok || !json.url) {
            errors.push(json.error ?? `Upload failed (${res.status})`);
            continue;
          }
          uploaded.push(json.url);
        } catch {
          errors.push("Network error — is the dev server still running?");
        }
      }

      if (uploaded.length) {
        onChange(multiple ? [...value, ...uploaded] : uploaded.slice(-1));
      }
      if (errors.length) setError(errors[0]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="relative h-20 w-16 overflow-hidden rounded-lg border border-line bg-base"
          >
            <Image src={url} alt="" fill sizes="64px" className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="absolute right-1 top-1 rounded-full bg-base/80 p-0.5 backdrop-blur"
              aria-label="Remove image"
            >
              <CloseIcon width={12} height={12} />
            </button>
          </div>
        ))}

        <label
          className={`flex h-20 w-16 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line-strong text-muted transition-colors hover:border-accent hover:text-accent ${
            busy ? "cursor-wait opacity-70" : "cursor-pointer"
          }`}
        >
          {busy ? (
            <span className="text-[10px] uppercase tracking-widest">Uploading…</span>
          ) : (
            <>
              <span className="text-lg leading-none">+</span>
              <span className="text-[9px] uppercase tracking-widest">Add</span>
            </>
          )}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            multiple={multiple}
            disabled={busy}
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = ""; // allow re-selecting the same file
            }}
          />
        </label>
      </div>

      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
