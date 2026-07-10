"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EmailCapture } from "@/components/layout/EmailCapture";

type QA = { q: string; a: string };

const FAQS: QA[] = [
  {
    q: "How does print-on-demand work?",
    a: "Nothing is made until you order it. Each piece is printed at the production hub nearest you, then shipped directly — so there's zero deadstock and a lighter footprint.",
  },
  {
    q: "When will my order arrive?",
    a: "Orders are printed and dispatched within ~48 hours. Most reach you in 2–5 business days once your local hub produces them, with tracking sent by email.",
  },
  {
    q: "What are the garments made of?",
    a: "Heavyweight premium cotton with water-based DTG printing — soft to the touch, breathable, and made to survive the wash without cracking or fading.",
  },
  {
    q: "Do you ship worldwide?",
    a: "Yes. Your order is routed to the production hub nearest you, so most parcels ship domestically. Free shipping applies automatically once your cart passes $75 — below that it's a flat $7, shown at checkout before you pay.",
  },
  {
    q: "What's your returns policy?",
    a: "Not the right fit? Return any unworn item within 30 days for a full refund — no questions asked. Reach us any time at hello@dhnshops.com.",
  },
];

function Item({ qa, open, onToggle }: { qa: QA; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
        aria-expanded={open}
      >
        <span className="text-lg font-medium tracking-tight md:text-xl">{qa.q}</span>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-muted">
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="block text-xl leading-none"
          >
            +
          </motion.span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-xl pb-6 text-muted">{qa.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-8">
      <div className="grid gap-12 md:grid-cols-[0.9fr_1.4fr] md:gap-16">
        <div className="md:sticky md:top-24 md:self-start">
          <p className="eyebrow">Good to know</p>
          <h2 className="display mt-3 text-4xl md:text-5xl">
            Questions,
            <br />
            answered
          </h2>
          <p className="mt-5 max-w-xs text-muted">
            Still unsure? Join the list — we email when new designs land, and nothing else.
          </p>
          <EmailCapture className="mt-6 max-w-xs" />
        </div>

        <div>
          {FAQS.map((qa, i) => (
            <Item
              key={qa.q}
              qa={qa}
              open={open === i}
              onToggle={() => setOpen((cur) => (cur === i ? null : i))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
