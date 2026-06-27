"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Transition } from "motion/react";
import type { MenuItem } from "@/lib/menu";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function DishCard({
  item,
  index,
  reduce,
}: {
  item: MenuItem;
  index: number;
  reduce: boolean;
}) {
  const enter: Transition = reduce
    ? { duration: 0 }
    : { duration: 0.4, ease: EASE, delay: Math.min(index * 0.04, 0.4) };

  return (
    <motion.div
      layout
      data-testid="dish-card"
      data-slug={item.slug}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      transition={enter}
      whileHover={reduce ? undefined : { y: -6 }}
      className="group"
    >
      <Link
        href={`/dish/${item.slug}`}
        className="block h-full overflow-hidden rounded-3xl border border-line bg-card shadow-[0_2px_10px_rgba(58,42,29,0.06)] outline-none transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(58,42,29,0.16)] focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-paper-2">
          <Image
            src={item.images[0]}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {item.tags.length > 0 && (
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-terracotta/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-start justify-between gap-3 px-5 py-4">
          <div className="min-w-0">
            <h3 className="font-serif text-xl leading-tight text-ink">{item.name}</h3>
            {item.types.length > 0 && (
              <p className="mt-1 truncate text-sm text-muted">{item.types.join(" · ")}</p>
            )}
          </div>
          {item.price && (
            <span className="shrink-0 rounded-full bg-paper-2 px-3 py-1 text-sm font-bold text-terracotta-ink">
              {item.price}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
