# AGENTS.md - truly-homely

For AI agents working in this repo. Humans: see [PLAN.md](PLAN.md).

## What this is

Truly Homely is a Next.js site for browsing a home-style ("truly homely") food menu: every dish shown with its photo in a clean, polished, animated UI. The data (menu items + photos) lives in the repo and the site renders it.

This repo carries a self-contained **agentic build harness** (ported from the history-stories project) so features can be built autonomously: a planner expands the goal into sprints, a builder implements one sprint at a time, and a fresh-context evaluator grades the running site with Playwright before anything lands.

## Voice & Working Style

- Skip filler. No "great question," "happy to help," or "absolutely."
- Strong opinions, weakly held. Commit to a take.
- Be resourceful before asking. Read the files, inspect history, then act. Only ping the human when genuinely blocked.
- Call things out when something is risky or sloppy.
- No em dashes. Use plain punctuation.

## Repo Conventions

**Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, pnpm. Deployed on Vercel.

**Content / data paths:**

- `data/` - menu data (JSON/markdown) and item photos, uploaded by the human
- `public/` - static assets served as-is
- `src/` - site code
- `agent/` - build harness state: goal, spec, backlog, state cursor, rubric, eval verdicts
- `.claude/skills/` - project-specific agent skills (the build harness)
- `.claude/agents/` - planner and evaluator subagents

**Git workflow:**

- Show the diff before committing unless the human explicitly says to commit.
- Use Conventional Commits (`feat:`, `fix:`, `chore:`, `feat(sprint-N):`).
- One sprint in flight at a time; main only receives passing work.
- Push after every committed change.

**Quality bar:**

- The menu must read as a real, appetizing menu: every item shows its photo, name, and price/description when present.
- Clean, polished UX with tasteful motion. Animations should feel intentional, never janky.
- `pnpm build` stays green every sprint.
- No console errors; no broken images; no horizontal overflow at 390px.

## Skills

- `.claude/skills/build-sprint/SKILL.md` - autonomous build harness (planner / builder / evaluator). State in `agent/`.

## Navigation

- `PLAN.md` - roadmap and product direction
- `agent/GOAL.md` - north star (human-owned, agents never edit)
- `agent/SPEC.md` - product spec (planner output)
- `agent/BACKLOG.md` - ordered sprints with acceptance criteria
- `agent/STATE.md` - cursor: phase, sprint, attempts, history
- `agent/RUBRIC.md` - evaluator criteria
- `agent/evals/` - committed eval verdicts (`shots/` is gitignored)
- `src/` - site code
- `data/` - menu data and photos

## Done When

For scaffold changes: build or inspect enough to verify no repo conventions broke, commit, and push.

For a sprint: `pnpm build` is green, the evaluator returned PASS with evidence, the verdict is committed under `agent/evals/`, STATE.md is advanced, and the commit is pushed.
