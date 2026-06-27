"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { MenuItem } from "@/lib/menu";
import { ALL_CATEGORY } from "@/lib/menu";
import DishCard from "./DishCard";

export default function MenuBrowser({
  items,
  categories,
}: {
  items: MenuItem[];
  categories: string[];
}) {
  const [active, setActive] = useState<string>(ALL_CATEGORY);
  const reduce = useReducedMotion() ?? false;

  const filters = useMemo(() => [ALL_CATEGORY, ...categories], [categories]);
  const filtered = useMemo(
    () =>
      active === ALL_CATEGORY
        ? items
        : items.filter((i) => i.types.includes(active)),
    [active, items]
  );

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-4 mb-8 border-b border-line bg-paper shadow-[0_6px_18px_rgba(58,42,29,0.07)]">
        <nav
          aria-label="Filter dishes by category"
          data-testid="category-filter"
          className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {filters.map((cat) => {
            const isActive = cat === active;
            return (
              <button
                key={cat}
                type="button"
                data-category={cat}
                data-active={isActive}
                aria-pressed={isActive}
                onClick={() => setActive(cat)}
                className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? "text-white"
                    : "text-ink-soft hover:bg-paper-2 hover:text-ink"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-pill"
                    transition={
                      reduce ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 38 }
                    }
                    className="absolute inset-0 -z-10 rounded-full bg-terracotta shadow-[0_6px_16px_rgba(188,83,40,0.35)]"
                  />
                )}
                {cat}
              </button>
            );
          })}
        </nav>
        {/* right-edge fade hints the row scrolls horizontally on narrow screens */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-paper to-transparent sm:hidden" />
      </div>

      <motion.div
        layout
        data-testid="dish-grid"
        data-count={filtered.length}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <DishCard key={item.slug} item={item} index={i} reduce={reduce} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="py-20 text-center text-lg text-muted">
          No dishes in this category yet.
        </p>
      )}
    </div>
  );
}
