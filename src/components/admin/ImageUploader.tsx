"use client";

import Image from "next/image";
import { useState } from "react";
import { CloseIcon } from "@/components/ui/icons";

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

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (json.url) uploaded.push(json.url);
      } catch {
        // ignore individual upload failures
      }
    }
    onChange(multiple ? [...value, ...uploaded] : uploaded.slice(-1));
    setBusy(false);
  }

  return (
    <div className="flex flex-wrap gap-3">
      {value.map((url, i) => (
        <div key={`${url}-${i}`} className="relative h-20 w-16 overflow-hidden rounded-lg border border-line">
          <Image src={url} alt="" fill sizes="64px" className="object-cover" />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="absolute right-1 top-1 rounded-full bg-base/80 p-0.5"
            aria-label="Remove image"
          >
            <CloseIcon width={12} height={12} />
          </button>
        </div>
      ))}
      <label className="flex h-20 w-16 cursor-pointer items-center justify-center rounded-lg border border-dashed border-line-strong text-lg text-muted hover:border-accent hover:text-accent">
        {busy ? "…" : "+"}
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
    </div>
  );
}
