# Truly Homely

A website to browse the **Truly Homely** menu: home-style dishes, each shown
with its photo, in a clean and polished UI with neat animations.

Built with Next.js (App Router), TypeScript, and Tailwind CSS. Deployed on Vercel.

## Getting started

```bash
pnpm install
pnpm dev      # http://localhost:3000
```

Other scripts:

```bash
pnpm build    # production build
pnpm start    # serve the production build
```

## Deploying to Vercel

This is a standard Next.js app. Import the repo on Vercel (or run `vercel`) and
deploy with the defaults - no extra configuration or secrets are needed for the
browsing experience. Every push to the repo triggers a deploy.

## Project layout

```
src/app/          Next.js App Router pages
data/             menu data and photos (uploaded by the human)
agent/            agentic build-harness state (goal, spec, backlog, rubric, evals)
.claude/          the build-sprint skill and planner/evaluator subagents
```

## How this is built

This repo carries a self-contained **agentic build harness** (planner ->
builder -> evaluator). See [AGENTS.md](AGENTS.md) and
[`.claude/skills/build-sprint/SKILL.md`](.claude/skills/build-sprint/SKILL.md).
Run the build-sprint skill to build the next feature toward the goal; a
fresh-context evaluator grades each sprint with Playwright before it lands.
