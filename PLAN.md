# PLAN.md - Truly Homely

Human-facing roadmap and product direction. Agents read this; the north star
lives in [agent/GOAL.md](agent/GOAL.md).

## Product

A website to browse the **Truly Homely** menu: home-style dishes, each shown
with its photo, in a clean and polished UI with neat, tasteful animations. The
goal is a delightful browsing experience, not an ordering system (yet).

## Direction

1. **Foundation** - Next.js + Vercel app, deployable hello world.
2. **Data** - menu items and photos uploaded into the repo under `data/`.
3. **Menu experience** - a polished, animated menu-browsing UI driven by the data:
   - A grid/gallery of dishes with photos, names, and prices/descriptions.
   - Category navigation/filtering.
   - Smooth entrance and hover animations; a detail view per dish.
   - Fast images (optimized), mobile-first, accessible.

## Design direction (from the human, 2026-06-27)

- **Look & feel: warm & homely.** Cozy, appetizing, home-kitchen vibe: warm
  tones, soft cards, big food photos. The visual identity matches the "Truly
  Homely" name. Not stark-minimal, not neon-bold.
- **Layout: grid + category filters.** A photo grid of dishes with category
  tabs/filters, plus a detail view per dish on tap. (See GOAL.md for the rest.)

The planner should treat these as fixed constraints when expanding the spec.

## How we build

This repo uses an agentic build harness (see [AGENTS.md](AGENTS.md) and
`.claude/skills/build-sprint/SKILL.md`). The harness expands this plan into a
SPEC and an ordered BACKLOG of sprints, builds one sprint at a time, and grades
each with a Playwright-driven evaluator before it lands on main.

## Status

- [x] Agentic harness ported and committed
- [x] Next.js + Vercel hello world app
- [ ] Menu data uploaded (`data/`)
- [ ] Menu browsing experience
