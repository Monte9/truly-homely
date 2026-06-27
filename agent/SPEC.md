# SPEC

Product spec for Truly Homely, derived from `agent/GOAL.md`.

> **Status: not yet written.** The planner subagent produces this file once the
> menu data has landed in `data/`. It expands the goal into concrete
> architecture decisions, the data model, routes, the menu-browsing UX, the
> animation language, the performance budget, and the evaluability contract
> (DOM hooks the evaluator can assert against). Until then this is a placeholder.

When written, this spec should cover at least:

1. **Architecture decisions** - rendering strategy (static/SSG), image pipeline
   (next/image), styling and animation libraries, and why.
2. **Data model** - the shape of a menu item parsed from `data/` (id, name,
   category, price, description, photo path, tags), and how categories are
   derived. Adding a dish or photo must require zero code changes.
3. **Routes** - the menu index, optional per-category views, and a per-dish
   detail view.
4. **The browsing UX** - layout, category navigation/filtering, entrance and
   hover animations, the dish detail view, empty/loading states.
5. **Performance budget** - image sizes, route JS budget, mobile DPR behavior.
6. **Evaluability contract** - stable DOM hooks / data attributes so the
   Playwright evaluator can assert item counts, categories, filtering, and
   navigation without reading pixels.
7. **Fallbacks and accessibility** - no-JS path, missing-photo placeholder,
   keyboard navigation, reduced motion.
