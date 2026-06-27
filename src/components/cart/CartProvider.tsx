"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getItems, type MenuItem } from "@/lib/menu";

const STORAGE_KEY = "th.cart.v1";

export type CartLine = { item: MenuItem; qty: number };

type CartContextValue = {
  mounted: boolean;
  entries: Record<string, number>;
  count: number;
  lines: CartLine[];
  subtotal: number;
  inCart: (slug: string) => number;
  add: (slug: string) => void;
  increment: (slug: string) => void;
  decrement: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Record<string, number>>({});
  const [mounted, setMounted] = useState(false);

  // load persisted cart once on mount (client only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") setEntries(parsed);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setMounted(true);
  }, []);

  // persist on change (after mount, so we don't clobber storage with {} pre-load)
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      /* ignore */
    }
  }, [entries, mounted]);

  const setQty = useCallback((slug: string, qty: number) => {
    setEntries((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[slug];
      else next[slug] = qty;
      return next;
    });
  }, []);

  const add = useCallback((slug: string) => setEntries((p) => ({ ...p, [slug]: (p[slug] ?? 0) + 1 })), []);
  const increment = add;
  const decrement = useCallback(
    (slug: string) => setEntries((p) => {
      const q = (p[slug] ?? 0) - 1;
      const next = { ...p };
      if (q <= 0) delete next[slug];
      else next[slug] = q;
      return next;
    }),
    []
  );
  const remove = useCallback((slug: string) => setQty(slug, 0), [setQty]);
  const clear = useCallback(() => setEntries({}), []);

  const allItems = useMemo(() => getItems(), []);

  const lines = useMemo<CartLine[]>(() => {
    return Object.entries(entries)
      .map(([slug, qty]) => {
        const item = allItems.find((i) => i.slug === slug);
        return item ? { item, qty } : null;
      })
      .filter((l): l is CartLine => l !== null);
  }, [entries, allItems]);

  const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines]);
  const subtotal = useMemo(
    () => lines.reduce((n, l) => n + (l.item.price ?? 0) * l.qty, 0),
    [lines]
  );

  const value: CartContextValue = {
    mounted,
    entries,
    count,
    lines,
    subtotal,
    inCart: (slug) => entries[slug] ?? 0,
    add,
    increment,
    decrement,
    remove,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
