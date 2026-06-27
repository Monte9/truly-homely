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
