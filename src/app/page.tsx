import MenuBrowser from "@/components/MenuBrowser";
import { getCategories, getItems, getMenu } from "@/lib/menu";

export default function Home() {
  const items = getItems();
  const categories = getCategories();
  const { count } = getMenu();

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <header className="py-12 text-center sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-terracotta">
          Truly Homely
        </p>
        <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl">
          Home-cooked,
          <br className="sm:hidden" /> served with love
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-ink-soft sm:text-lg">
          Warm Gujarati home cooking, from breakfast bites to festive sweets.
          Browse {count} dishes, each made the homely way.
        </p>
      </header>

      <MenuBrowser items={items} categories={categories} />
    </main>
  );
}
