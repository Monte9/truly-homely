"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

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
  // [current photo, direction of last move] so slides animate the right way
  const [[current, dir], setState] = useState<[number, number]>([index, 0]);
  const multi = images.length > 1;

  const paginate = useCallback(
    (d: number) => setState(([c]) => [(c + d + images.length) % images.length, d]),
    [images.length]
  );
  const jumpTo = useCallback(
    (i: number) => setState(([c]) => [i, i > c ? 1 : -1]),
    []
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") paginate(1);
      else if (e.key === "ArrowLeft") paginate(-1);
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [paginate, onClose]);

  function onDragEnd(_e: unknown, info: PanInfo) {
    const swipe = info.offset.x + info.velocity.x * 0.2;
    if (multi && swipe < -70) paginate(1);
    else if (multi && swipe > 70) paginate(-1);
  }

  const slideVariants = {
    enter: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d > 0 ? -80 : 80 }),
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={name}
      data-testid="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.25 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/92 p-4 backdrop-blur-md sm:p-10"
    >
      <button
        type="button"
        onClick={onClose}
        data-testid="lightbox-close"
        aria-label="Close"
        className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white shadow-lg backdrop-blur transition-colors hover:bg-white/30"
      >
        ×
      </button>

      <motion.div
        initial={reduce ? false : { scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={reduce ? { opacity: 0 } : { scale: 0.92, opacity: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.32, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 h-full w-full max-w-5xl"
      >
        <AnimatePresence custom={dir} initial={false} mode="popLayout">
          <motion.div
            key={current}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduce ? { duration: 0 } : { duration: 0.3, ease: EASE }}
            drag={multi ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={onDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <Image
              src={images[current]}
              alt={name}
              fill
              priority
              draggable={false}
              sizes="100vw"
              className="select-none object-contain"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {multi && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); paginate(-1); }}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white shadow-lg backdrop-blur transition-colors hover:bg-white/30 sm:left-6"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); paginate(1); }}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white shadow-lg backdrop-blur transition-colors hover:bg-white/30 sm:right-6"
          >
            ›
          </button>
          <div className="absolute inset-x-0 bottom-5 z-30 flex justify-center gap-2">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={(e) => { e.stopPropagation(); jumpTo(i); }}
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
