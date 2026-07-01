"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { selectCount, useCart } from "@/lib/store/cart";
import { useHasMounted } from "@/lib/hooks/useHasMounted";
import { BagIcon, CloseIcon } from "@/components/ui/icons";

/**
 * On-site cart recovery. When a returning visitor still has items in their
 * persisted bag, a gentle nudge surfaces once per session. This is the local
 * counterpart to an email/SMS abandonment flow — wire /api/subscribe or a
 * Klaviyo event here to extend it off-site.
 */
export function CartRecovery() {
  const mounted = useHasMounted();
  const count = useCart(selectCount);
  const isOpen = useCart((s) => s.isOpen);
  const open = useCart((s) => s.open);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!mounted || dismissed || count === 0) return;
    try {
      if (sessionStorage.getItem("aether-cart-reminded")) return;
    } catch {
      /* ignore storage errors */
    }
    const t = window.setTimeout(() => setShow(true), 4000);
    return () => window.clearTimeout(t);
  }, [mounted, count, dismissed]);

  function dismiss() {
    setShow(false);
    setDismissed(true);
    try {
      sessionStorage.setItem("aether-cart-reminded", "1");
    } catch {
      /* ignore */
    }
  }

  const visible = show && !dismissed && !isOpen && count > 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
          className="fixed bottom-5 left-5 z-[65] w-[calc(100vw-2.5rem)] max-w-xs rounded-2xl border border-line bg-surface p-4 shadow-lift"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-accent">
              <BagIcon width={22} height={22} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">Still thinking it over?</p>
              <p className="mt-0.5 text-xs text-muted">
                You have {count} item{count > 1 ? "s" : ""} waiting in your bag.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    open();
                    dismiss();
                  }}
                  className="rounded-full bg-fg px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-accent-ink transition-colors hover:bg-accent"
                >
                  View bag
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  className="font-mono text-[10px] uppercase tracking-widest text-muted hover:text-fg"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss reminder"
              className="text-muted hover:text-fg"
            >
              <CloseIcon width={16} height={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
