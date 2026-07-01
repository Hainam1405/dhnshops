"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

type AddInput = Omit<CartItem, "quantity" | "key"> & { quantity?: number };

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  add: (item: AddInput) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const keyOf = (productId: string, color: string, size: string) =>
  `${productId}::${color}::${size}`;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (input) =>
        set((s) => {
          const key = keyOf(input.productId, input.color, input.size);
          const qty = input.quantity ?? 1;
          const existing = s.items.find((i) => i.key === key);
          const items = existing
            ? s.items.map((i) => (i.key === key ? { ...i, quantity: i.quantity + qty } : i))
            : [...s.items, { ...input, key, quantity: qty }];
          return { items, isOpen: true };
        }),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      setQty: (key, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.key !== key)
              : s.items.map((i) => (i.key === key ? { ...i, quantity: qty } : i)),
        })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    {
      name: "aether-cart",
      // Only persist the items — drawer open state is ephemeral.
      partialize: (s) => ({ items: s.items }),
    },
  ),
);

export const selectCount = (s: CartState) => s.items.reduce((n, i) => n + i.quantity, 0);
export const selectSubtotal = (s: CartState) =>
  s.items.reduce((n, i) => n + i.price * i.quantity, 0);
