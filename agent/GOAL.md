# GOAL

The north star for Truly Homely. This file is human-owned. The planner reads it;
agents never edit it.

## The goal

A website where I can browse the **Truly Homely** menu in a clean, polished UX
with neat animations.

- Every menu item shows its **photo**, alongside its name and (when present)
  price and description.
- Browsing feels **delightful**: a thoughtfully laid-out gallery of dishes,
  smooth entrance and hover motion, and a way to look at a single dish up close.
- It is **fast and mobile-first**: images are optimized, nothing janks, and it
  reads beautifully on a phone.
- It is driven entirely by the **menu data in the repo** (`data/`): adding or
  changing a dish or photo updates the site with no hand-wiring.

## Out of scope (for now)

- Online ordering, carts, payments, accounts.
- A CMS or admin UI. The data files are the source of truth.

## Constraints

- The app is a Next.js site deployed on Vercel by pushing to the repo.
- `pnpm build` stays green every sprint.
- No secrets are required to run or deploy the browsing experience.
