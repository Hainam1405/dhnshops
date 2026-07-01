"use client";

import { AnimatePresence, motion } from "motion/react";
import { CloseIcon } from "@/components/ui/icons";

const ROWS = [
  { size: "XS", chest: "46", length: "68", sleeve: "20" },
  { size: "S", chest: "50", length: "70", sleeve: "21" },
  { size: "M", chest: "54", length: "72", sleeve: "22" },
  { size: "L", chest: "58", length: "74", sleeve: "23" },
  { size: "XL", chest: "62", length: "76", sleeve: "24" },
  { size: "2XL", chest: "66", length: "78", sleeve: "25" },
];

export function SizeGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-fg/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.35 }}
            className="fixed left-1/2 top-1/2 z-[81] w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-surface p-6 shadow-lift"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-widest">Size guide</h3>
              <button type="button" onClick={onClose} aria-label="Close size guide">
                <CloseIcon width={20} height={20} />
              </button>
            </div>
            <p className="mt-2 text-xs text-muted">Measurements in centimetres, garment laid flat.</p>
            <table className="mt-5 w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left font-mono text-[11px] uppercase tracking-widest text-muted">
                  <th className="py-2">Size</th>
                  <th className="py-2">Chest</th>
                  <th className="py-2">Length</th>
                  <th className="py-2">Sleeve</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.size} className="border-b border-line/60">
                    <td className="py-2.5 font-medium">{r.size}</td>
                    <td className="py-2.5 text-muted">{r.chest}</td>
                    <td className="py-2.5 text-muted">{r.length}</td>
                    <td className="py-2.5 text-muted">{r.sleeve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
