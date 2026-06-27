import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DishGallery from "@/components/DishGallery";
import { getDish, getRelated, getSlugs } from "@/lib/menu";

export function generateStaticParams() {
  return getSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dish = getDish(slug);
  if (!dish) return { title: "Dish not found - Truly Homely" };
  return {
    title: `${dish.name} - Truly Homely`,
    description: `${dish.name}, home-cooked the Truly Homely way.`,
  };
}

export default async function DishPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dish = getDish(slug);
  if (!dish) notFound();
  const related = getRelated(dish.slug, 4);

  return (
    <main
      className="mx-auto max-w-3xl px-4 pb-24 pt-6 sm:px-6"
      data-testid="dish-detail"
      data-slug={dish.slug}
    >
      <Link
        href="/"
        data-testid="back-to-menu"
        className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:text-terracotta-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
      >
        <span aria-hidden>←</span> Back to the menu
      </Link>

      <div className="mt-6">
        <DishGallery images={dish.images} name={dish.name} />
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">
            {dish.name}
          </h1>
          {dish.price && (
            <span className="rounded-full bg-terracotta px-4 py-2 text-lg font-bold text-white shadow-[0_6px_16px_rgba(188,83,40,0.3)]">
              {dish.price}
            </span>
          )}
        </div>

        {(dish.types.length > 0 || dish.tags.length > 0) && (
          <div className="mt-5 flex flex-wrap gap-2">
            {dish.types.map((t) => (
              <span
                key={t}
                className="rounded-full bg-paper-2 px-3 py-1.5 text-sm font-semibold text-ink-soft"
              >
                {t}
              </span>
            ))}
            {dish.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-terracotta/40 px-3 py-1.5 text-sm font-semibold text-terracotta-ink"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="mt-8 max-w-prose text-lg leading-relaxed text-ink-soft">
          Made fresh and served the homely way, just like home.
        </p>
      </div>

      {related.length > 0 && (
        <section className="mt-14 border-t border-line pt-10">
          <h2 className="font-serif text-2xl text-ink">More from the kitchen</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/dish/${item.slug}`}
                className="group block overflow-hidden rounded-2xl border border-line bg-card shadow-[0_2px_10px_rgba(58,42,29,0.06)] transition-shadow duration-300 hover:shadow-[0_14px_30px_rgba(58,42,29,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
              >
                <div className="relative aspect-square overflow-hidden bg-paper-2">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 200px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <p className="truncate px-3 py-2.5 font-serif text-sm text-ink">
                  {item.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
