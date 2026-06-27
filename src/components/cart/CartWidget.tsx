"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCart } from "./CartProvider";
import { formatINR } from "@/lib/format";

function QtyStepper({ slug }: { slug: string }) {
  const { inCart, increment, decrement } = useCart();
  const qty = inCart(slug);
  return (
    <div className="flex items-center gap-1 rounded-full border border-line bg-paper p-1">
      <button
        type="button"
        data-testid="qty-decrease"
        onClick={() => decrement(slug)}
        aria-label="Decrease quantity"
        className="flex h-7 w-7 items-center justify-center rounded-full text-lg text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink"
      >
        −
      </button>
      <span className="min-w-5 text-center text-sm font-bold tabular-nums text-ink" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        data-testid="qty-increase"
        onClick={() => increment(slug)}
        aria-label="Increase quantity"
        className="flex h-7 w-7 items-center justify-center rounded-full text-lg text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink"
      >
        +
      </button>
    </div>
  );
}

export default function CartWidget() {
  const { mounted, count, lines, subtotal, remove } = useCart();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion() ?? false;

  return (
    <>
      <button
        type="button"
        data-testid="cart-button"
        onClick={() => setOpen(true)}
        aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-white shadow-[0_10px_30px_rgba(188,83,40,0.45)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6 7h13l-1.2 8.4a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.7L6 7Zm0 0L5.2 4H3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9.5" cy="20" r="1.2" fill="currentColor" />
          <circle cx="16.5" cy="20" r="1.2" fill="currentColor" />
        </svg>
        {mounted && count > 0 && (
          <span
            data-testid="cart-count"
            className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-paper bg-ink px-1 text-xs font-bold tabular-nums text-white"
          >
            {count}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
          >
            <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
            <motion.aside
              data-testid="cart-drawer"
              role="dialog"
              aria-label="Your cart"
              initial={reduce ? { opacity: 0 } : { x: "100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 36 }}
              className="relative flex h-full w-full max-w-md flex-col bg-paper shadow-2xl"
            >
              <header className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="font-serif text-2xl text-ink">Your cart</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close cart"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink"
                >
                  ×
                </button>
              </header>

              {lines.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                  <p className="text-lg text-ink-soft">Your cart is empty.</p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_16px_rgba(188,83,40,0.35)]"
                  >
                    Browse the menu
                  </button>
                </div>
              ) : (
                <>
                  <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
                    {lines.map(({ item, qty }) => (
                      <li key={item.slug} data-testid="cart-item" data-slug={item.slug} className="flex gap-3 py-4">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-paper-2">
                          <Image src={item.images[0]} alt={item.name} fill sizes="80px" className="object-cover" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-serif text-lg leading-tight text-ink">{item.name}</h3>
                            <button
                              type="button"
                              data-testid="cart-remove"
                              onClick={() => remove(item.slug)}
                              aria-label={`Remove ${item.name}`}
                              className="text-sm font-semibold text-muted hover:text-terracotta-ink"
                            >
                              Remove
                            </button>
                          </div>
                          <p className="text-sm text-muted">{formatINR(item.price ?? 0)} each</p>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <QtyStepper slug={item.slug} />
                            <span className="font-bold text-ink tabular-nums">
                              {formatINR((item.price ?? 0) * qty)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <footer className="border-t border-line px-5 py-4">
                    <div className="mb-3 flex items-center justify-between text-lg">
                      <span className="text-ink-soft">Subtotal</span>
                      <span data-testid="cart-subtotal" className="font-bold text-ink tabular-nums">
                        {formatINR(subtotal)}
                      </span>
                    </div>
                    <Link
                      href="/checkout"
                      onClick={() => setOpen(false)}
                      data-testid="go-to-checkout"
                      className="block rounded-full bg-terracotta px-6 py-3 text-center text-base font-bold text-white shadow-[0_8px_20px_rgba(188,83,40,0.4)] transition-opacity hover:opacity-90"
                    >
                      Checkout
                    </Link>
                  </footer>
                </>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
