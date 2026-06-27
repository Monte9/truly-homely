"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, type Transition } from "motion/react";
import type { MenuItem } from "@/lib/menu";
import { useCart } from "./cart/CartProvider";
import { formatINR } from "@/lib/format";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function DishCard({
  item,
  index,
  reduce,
  onOpen,
}: {
  item: MenuItem;
  index: number;
  reduce: boolean;
  onOpen: (images: string[], index: number) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const multi = item.images.length > 1;
  const { inCart, add, increment, decrement } = useCart();
  const qty = inCart(item.slug);

  const enter: Transition = reduce
    ? { duration: 0 }
    : { duration: 0.45, ease: EASE, delay: Math.min(index * 0.035, 0.3) };

  function onScroll() {
    const el = scroller.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  }

  function goTo(i: number) {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <motion.div
      layout
      data-testid="dish-card"
      data-slug={item.slug}
      initial={reduce ? false : { opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
      transition={enter}
      whileHover={reduce ? undefined : { y: -6 }}
      className="group overflow-hidden rounded-3xl border border-line bg-card shadow-[0_2px_10px_rgba(58,42,29,0.06)] transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(58,42,29,0.16)]"
    >
      <div className="relative">
        <div
          ref={scroller}
          onScroll={onScroll}
          data-testid="card-carousel"
          className="flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto overflow-y-hidden bg-paper-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {item.images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => onOpen(item.images, i)}
              aria-label={`View ${item.name} photo ${i + 1} full screen`}
              className="relative h-full w-full shrink-0 snap-center cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-terracotta"
            >
              <Image
                src={src}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {multi && (
          <>
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
              {item.images.map((src, i) => (
                <span
                  key={src}
                  className={`h-1.5 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.4)] transition-all duration-300 ${
                    i === active ? "w-4 bg-white" : "w-1.5 bg-white/70"
                  }`}
                />
              ))}
            </div>
            {/* desktop-only step arrows */}
            <button
              type="button"
              onClick={() => goTo(Math.max(0, active - 1))}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-ink/45 text-lg text-white opacity-0 transition-opacity group-hover:opacity-100 sm:flex"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => goTo(Math.min(item.images.length - 1, active + 1))}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-ink/45 text-lg text-white opacity-0 transition-opacity group-hover:opacity-100 sm:flex"
            >
              ›
            </button>
          </>
        )}
      </div>

      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-xl leading-tight text-ink">{item.name}</h3>
          {item.price != null && (
            <span className="shrink-0 rounded-full bg-paper-2 px-3 py-1 text-sm font-bold text-terracotta-ink tabular-nums">
              {formatINR(item.price)}
            </span>
          )}
        </div>

        {(item.types.length > 0 || item.tags.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.types.map((t) => (
              <span
                key={t}
                className="rounded-full bg-paper-2 px-2.5 py-1 text-xs font-semibold text-ink-soft"
              >
                {t}
              </span>
            ))}
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-terracotta/35 bg-terracotta/10 px-2.5 py-1 text-xs font-semibold text-terracotta-ink"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4">
          {qty === 0 ? (
            <button
              type="button"
              data-testid="add-to-cart"
              onClick={() => add(item.slug)}
              className="w-full rounded-full bg-terracotta px-4 py-2.5 text-sm font-bold text-white shadow-[0_4px_12px_rgba(188,83,40,0.3)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              Add to cart
            </button>
          ) : (
            <div
              data-testid="card-in-cart"
              className="flex items-center justify-between rounded-full border border-terracotta/40 bg-terracotta/10 px-2 py-1.5"
            >
              <button
                type="button"
                data-testid="qty-decrease"
                onClick={() => decrement(item.slug)}
                aria-label={`Decrease ${item.name} quantity`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-lg text-terracotta-ink shadow-sm transition-colors hover:bg-paper-2"
              >
                −
              </button>
              <span className="text-sm font-bold tabular-nums text-terracotta-ink" aria-live="polite">
                {qty} in cart
              </span>
              <button
                type="button"
                data-testid="qty-increase"
                onClick={() => increment(item.slug)}
                aria-label={`Increase ${item.name} quantity`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-lg text-terracotta-ink shadow-sm transition-colors hover:bg-paper-2"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
