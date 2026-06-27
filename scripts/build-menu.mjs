// Build the menu dataset from the Notion export under data/source/.
//
// Reads the "Menu Items" CSV (Name, Price, Tags, Type), maps each dish to its
// image folder, copies the photos into public/menu/<slug>/, and writes
// src/data/menu.json. Re-run any time the source data changes (wired as
// predev + prebuild). Adding a dish or photo in data/source needs no code edits.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(ROOT, "data", "source", "Truly Homely", "Menu Items");
const PUBLIC_MENU = path.join(ROOT, "public", "menu");
const OUT_JSON = path.join(ROOT, "src", "data", "menu.json");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Minimal RFC-4180-ish CSV parser (handles quoted fields with commas/quotes).
function parseCsv(text) {
  text = text.replace(/^﻿/, ""); // strip BOM
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field); field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((v) => v !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); if (row.some((v) => v !== "")) rows.push(row); }
  const header = rows.shift().map((h) => h.trim());
  return rows.map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])));
}

const splitList = (s) =>
  (s || "").split(",").map((x) => x.trim()).filter(Boolean);

async function findCsv(dir) {
  const parent = path.dirname(dir);
  const entries = await fs.readdir(parent);
  const csv = entries.find((e) => e.startsWith("Menu Items") && e.endsWith(".csv"));
  if (!csv) throw new Error(`No "Menu Items*.csv" found in ${parent}`);
  return path.join(parent, csv);
}

async function imagesFor(name) {
  const dir = path.join(SOURCE, name);
  let entries;
  try {
    entries = await fs.readdir(dir);
  } catch {
    return { dir: null, files: [] };
  }
  const files = entries
    .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
  return { dir, files };
}

async function main() {
  const csvPath = await findCsv(SOURCE);
  const rows = parseCsv(await fs.readFile(csvPath, "utf8"));

  // fresh output dir for images
  await fs.rm(PUBLIC_MENU, { recursive: true, force: true });
  await fs.mkdir(PUBLIC_MENU, { recursive: true });

  const items = [];
  let missingPhotos = 0;

  for (const row of rows) {
    const name = (row.Name || "").trim();
    if (!name) continue;
    const slug = slugify(name);
    const { dir, files } = await imagesFor(name);

    const images = [];
    if (dir && files.length) {
      const destDir = path.join(PUBLIC_MENU, slug);
      await fs.mkdir(destDir, { recursive: true });
      for (let i = 0; i < files.length; i++) {
        const ext = path.extname(files[i]).toLowerCase();
        const destName = `${i + 1}${ext}`;
        await fs.copyFile(path.join(dir, files[i]), path.join(destDir, destName));
        images.push(`/menu/${slug}/${destName}`);
      }
    } else {
      missingPhotos++;
    }

    items.push({
      slug,
      name,
      price: (row.Price || "").trim() || null,
      tags: splitList(row.Tags),
      types: splitList(row.Type),
      images,
    });
  }

  // categories: every distinct Type across the menu, in first-seen order
  const categories = [];
  for (const it of items) for (const t of it.types) if (!categories.includes(t)) categories.push(t);

  const dataset = { generatedFrom: "data/source", count: items.length, categories, items };
  await fs.mkdir(path.dirname(OUT_JSON), { recursive: true });
  await fs.writeFile(OUT_JSON, JSON.stringify(dataset, null, 2) + "\n");

  const totalImages = items.reduce((n, it) => n + it.images.length, 0);
  console.log(
    `menu: ${items.length} dishes, ${totalImages} photos, ${categories.length} categories` +
      (missingPhotos ? `, ${missingPhotos} without photos` : "")
  );
}

main().catch((err) => {
  console.error("build-menu failed:", err);
  process.exit(1);
});
