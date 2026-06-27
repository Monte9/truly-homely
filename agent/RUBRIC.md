# Evaluator Rubric

The evaluator grades the running site against this rubric plus the current
sprint's acceptance criteria from `agent/BACKLOG.md`. Every line of the verdict
must cite evidence: a screenshot path, a command output, or a DOM/console
observation. No evidence, no verdict.

## Hard gates (any FAIL fails the sprint)

1. `pnpm build` exits 0 with no errors
2. Zero console errors on: the menu index, one dish detail view, and every page the sprint touched
3. No broken images: every rendered menu photo has `naturalWidth > 0` (no missing/404 images, no broken placeholders)
4. No horizontal overflow at 390px viewport width on touched pages
5. Every acceptance criterion of the current sprint demonstrated by actual interaction (click it, filter it, navigate it), not by reading the code
6. No regressions: the menu index and at least one dish view render correctly at 1280px and 390px
7. The menu reflects the data: item and category counts on the page match what is in `data/` (no hardcoded or dropped items)

## Soft criteria (note in verdict, do not fail on these alone)

- Spacing, alignment, and grid rhythm are consistent across dishes
- Typography hierarchy is clear; prices and names are legible; no near-invisible text
- Photos are well-framed (consistent aspect ratio, no squish/stretch) and crisp on retina
- Hover/active/focus states present on interactive elements (cards, filters, links)
- Motion feels intentional and smooth: entrance and hover animations do not jank, respect `prefers-reduced-motion`, and never block interaction
- Empty/loading and missing-photo states look deliberate, not broken
- The overall feel is appetizing and polished, like a real menu you want to scroll

## Criteria alignment (pre-build, every sprint)

The builder and evaluator agree the acceptance criteria BEFORE the build, so
evaluation judges whether the implementation is the best outcome for the sprint
goal, not merely whether it works. At sprint start the evaluator reviews the
planner's draft ACs against the sprint goal, GOAL.md, and SPEC.md: strengthen
weak criteria, add outcome-quality criteria (feel, legibility, composition,
motion, failure modes), cut redundancy, cap at ~6, keep every criterion
interaction-verifiable, prescribe no implementation. The agreed list is recorded
in BACKLOG.md (marked "aligned") and `agent/evals/<ts>-sprint-N-criteria.md`
before feature code is written. The post-build verdict grades against the agreed
list, and an implementation that meets every AC's letter while missing the
sprint goal FAILS with evidence.

## Taste audit (on request, used by taste-pass sprints)

When a sprint asks for a taste audit, switch from gatekeeper to curator: browse
the menu at 1280x900 and 390x844, open a dish detail, exercise category
filtering, and judge it as a hungry, demanding visitor. Deliverable:
`agent/evals/<ts>-taste-audit.md` with screenshot evidence and a ranked findings
list covering composition, photography presentation, spacing, typography, copy,
and motion feel. Rate each finding "blocks shippable" or "nice to have".
Findings must be concrete enough to convert into interaction-verifiable
acceptance criteria. An audit is not a verdict; it does not PASS or FAIL a
sprint by itself.

## Protocol

- Screenshot at 1280x900 and 390x844 for each checked page, saved under `agent/evals/shots/` (gitignored)
- Verdict file: `agent/evals/YYYYMMDD-HHmmss-sprint-N.md` (committed), structure: one line per hard gate with PASS/FAIL + evidence, soft notes, overall verdict, and concrete fix instructions on FAIL
- Overall verdict is PASS only if all hard gates pass

## Calibration

The human audits a sampled PASS periodically. When the audit disagrees with a
verdict, tighten the failing criterion here rather than in the evaluator prompt.
