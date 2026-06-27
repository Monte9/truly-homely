# BACKLOG

Ordered sprints expanding `agent/SPEC.md`. The site is shippable after each
sprint. ACs are DRAFT until the evaluator strengthens them during ALIGN (see
`agent/RUBRIC.md` "Criteria alignment"); they describe observable,
interaction-verifiable outcomes and prescribe no implementation. Cap ~6 ACs per
sprint. One sprint in flight at a time.

## Format

```
## Sprint N - <title>  [pending | aligned | done]

**Goal:** one sentence describing the outcome.

**Acceptance criteria:**
1. ... (interaction-verifiable)
```

---

## Sprint 1 - Menu browsing experience [done]

> Landed on main 2026-06-27. Verdict: PASS on attempt 2 (attempt 1 failed only
> on a missing-favicon console 404; fixed by adding src/app/icon.svg). See
> agent/evals/20260627-023940-sprint-1.md and
> agent/evals/20260627-024209-sprint-1-attempt-2.md.


**Goal:** Ship the full warm, homely menu: a photo grid of dishes with category
filtering and a per-dish detail view, driven entirely by `src/data/menu.json`,
with tasteful entrance/hover/filter/detail motion that is mobile-first,
accessible, and reduced-motion aware.

**Acceptance criteria (DRAFT):**

1. The index at `/` renders one dish card per item in the data: the grid
   (`data-testid="dish-grid"`) has `data-count="19"` and exactly 19
   `data-testid="dish-card"` elements, each with a `data-slug` matching the data
   and showing the dish name (and price when present, e.g. Gujarati Muthiya
   shows its price). Counts and names are read from the data, not hardcoded.
2. The category filter bar (`data-testid="category-filter"`) shows "All" plus one
   control per category in the data (Breakfast, Snack, Dessert, Dinner, Lunch,
   Meal). Clicking a category leaves exactly that control `data-active="true"`
   and updates the grid `data-count` and visible cards to exactly the dishes
   whose `types` include it (e.g. Dessert yields only the dessert dishes);
   clicking "All" restores all 19. Dishes with no type appear under "All" and
   never vanish from it.
3. Clicking a dish card navigates to `/dish/<slug>`, which renders
   `data-testid="dish-detail"` with the matching `data-slug`, the dish name as
   the heading, the price/tags when present, and all of that dish's photos; a
   `data-testid="back-to-menu"` control returns to `/`. A dish with multiple
   photos (e.g. Khaman Dhokla, 3 photos) shows all of them.
4. Every rendered menu photo (grid and detail) loads with `naturalWidth > 0`
   (no 404s, no broken-image icons) and is consistently framed without
   squish/stretch across dishes.
5. Motion is present and tasteful: cards animate in on load and respond to
   hover/focus, and changing the category filter transitions the grid smoothly
   without jank; with `prefers-reduced-motion: reduce` all content is fully
   visible and usable with motion effectively disabled.
6. At 390px and 1280px the index and a dish detail view render correctly with no
   horizontal overflow and no console errors; `pnpm build` exits 0.

---

## Sprint 2 - Taste and motion polish [pending] (optional)

**Goal:** Raise the menu from "works" to "appetizing": refine warm palette,
typography, card composition, photo framing, copy, and the feel of
entrance/hover/filter/detail motion based on a taste audit.

**Acceptance criteria (DRAFT):**

1. A taste audit (per RUBRIC) at 1280x900 and 390x844 is recorded with
   screenshot evidence and a ranked findings list, and every "blocks shippable"
   finding it raises is resolved in this sprint.
2. The warm/homely identity reads clearly: palette, typography hierarchy, and
   spacing are cohesive across the index and detail views; names and prices are
   legible with no near-invisible text; the page feels like a menu you want to
   scroll.
3. Dish cards are visually consistent: uniform photo aspect ratio and framing,
   consistent card rhythm across rows, and clean handling of long names, missing
   prices, and tag badges.
4. The detail view is composed and appetizing: hero photo and any additional
   photos are well-framed and crisp on retina, and the back affordance is clear
   and easy to hit on mobile.
5. Motion feels intentional end to end: entrance stagger, hover/active, filter
   transitions, and detail-open read as smooth and coordinated, never block
   interaction, and fully respect `prefers-reduced-motion`.
6. No regressions: all Sprint 1 ACs still hold, `pnpm build` exits 0, no console
   errors, and no horizontal overflow at 390px on any touched page.
