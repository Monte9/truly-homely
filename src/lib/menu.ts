import data from "@/data/menu.json";

export type MenuItem = {
  slug: string;
  name: string;
  price: string | null;
  tags: string[];
  types: string[];
  images: string[];
};

export type MenuData = {
  generatedFrom: string;
  count: number;
  categories: string[];
  items: MenuItem[];
};

const menu = data as MenuData;

export const ALL_CATEGORY = "All";

export function getMenu(): MenuData {
  return menu;
}

export function getItems(): MenuItem[] {
  return menu.items;
}

export function getCategories(): string[] {
  return menu.categories;
}

export function getDish(slug: string): MenuItem | undefined {
  return menu.items.find((i) => i.slug === slug);
}

export function getSlugs(): string[] {
  return menu.items.map((i) => i.slug);
}

// Other dishes to surface on a dish page: prefer ones sharing a category, then
// fill from the rest of the menu so the section is always satisfyingly full.
export function getRelated(slug: string, limit = 4): MenuItem[] {
  const dish = getDish(slug);
  if (!dish) return [];
  const others = menu.items.filter((i) => i.slug !== slug);
  const sameType = others.filter((i) => i.types.some((t) => dish.types.includes(t)));
  const picked: MenuItem[] = [];
  for (const item of [...sameType, ...others]) {
    if (picked.length >= limit) break;
    if (!picked.some((p) => p.slug === item.slug)) picked.push(item);
  }
  return picked;
}
