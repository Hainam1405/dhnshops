"use client";

import { useEffect, useState } from "react";

/** True after the first client render — use to gate persisted/client-only UI. */
export function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
