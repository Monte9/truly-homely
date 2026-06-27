"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export default function DishGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [selected, setSelected] = useState(0);
  const reduce = useReducedMotion() ?? false;
  const current = images[selected] ?? images[0];

  return (
    <div>
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-line bg-paper-2 shadow-[0_18px_50px_rgba(58,42,29,0.16)]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={current}
              alt={name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {images.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-3" data-testid="gallery-thumbs">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={`Show photo ${i + 1} of ${name}`}
              aria-current={i === selected}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                i === selected
                  ? "border-terracotta opacity-100"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
