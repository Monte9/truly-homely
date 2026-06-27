# CLAUDE.md

This file points Claude Code at the repo's agent guide.

Read **[AGENTS.md](AGENTS.md)** for voice, conventions, stack, and navigation.

Humans: see **[PLAN.md](PLAN.md)** for roadmap and product direction.

## Running the harness

The autonomous build harness lives in `.claude/skills/build-sprint/SKILL.md`. To
build the next feature toward the goal, run the build-sprint skill. It reads
`agent/STATE.md` and loops sprints (planner -> builder -> evaluator) until the
backlog is empty or a sprint blocks.

## Local development

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build (must stay green)
```
