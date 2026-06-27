"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";

export default function Lightbox({
  images,
  index,
  name,
  reduce,
  onClose,
}: {
  images: string[];
  index: number;
  name: string;
  reduce: boolean;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);
  const multi = images.length > 1;

  const go = useCallback(
    (dir: number) => setCurrent((c) => (c + dir + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [go, onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={name}
      data-testid="lightbox"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/92 p-4 backdrop-blur-sm sm:p-8"
    >
      <button
        type="button"
        onClick={onClose}
        data-testid="lightbox-close"
        aria-label="Close"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition-colors hover:bg-white/25"
      >
        ×
      </button>

      <motion.div
        key={current}
        initial={reduce ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduce ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative h-full w-full max-w-5xl"
      >
        <Image
          src={images[current]}
          alt={name}
          fill
          priority
          sizes="100vw"
          className="object-contain"
        />
      </motion.div>

      {multi && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition-colors hover:bg-white/25 sm:left-6"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); go(1); }}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition-colors hover:bg-white/25 sm:right-6"
          >
            ›
          </button>
          <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                aria-label={`Photo ${i + 1}`}
                aria-current={i === current}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
