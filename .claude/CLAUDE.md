# pixel-beat — ECC project scope

Stack: TypeScript + Express 5 + Socket.io realtime pixel-canvas app (see README.md).
No database — grid state is in-memory; saves are raw `.bin` files written under
`public/assets/` via `fs`. Vanilla JS/HTML/CSS frontend, no bundler/framework.

Update 2026-09-19: a production dev pipeline was added via `/plan` — Vitest
(`tests/`), ESLint + Prettier, and GitHub Actions CI (`.github/workflows/ci.yml`)
running build+lint+format+test on every push/PR to `main`. No Docker still.
The DAILY/LIBRARY classification below predates this and hasn't been re-run
against the new tooling yet — `tdd-workflow` and `verification-loop` are more
directly actionable now that a real test suite exists.

ECC is installed as a **global** plugin (`ecc@ecc`, hook_profile "standard"), so
every agent/skill/command in the full catalog is technically reachable in every
project. This file pins the daily-use subset for _this_ repo so sessions default
to it without asking; everything else is LIBRARY — still reachable by exact name,
indexed by keyword in `.claude/skills/skill-library/SKILL.md`.

Produced by `/ecc:agent-sort` on 2026-09-19. Re-run it if the stack changes
(test framework, database, frontend framework, CI/Docker added).

## Daily agents (10 of 68)

architect, build-error-resolver, code-reviewer, code-simplifier, planner,
refactor-cleaner, security-reviewer, silent-failure-hunter, typescript-reviewer,
agent-evaluator*

*listed by the review pass for meta/quality use, not stack-matched — safe to drop if unused.

## Daily skills (14 of 292)

coding-standards, tdd-workflow, verification-loop, git-workflow, error-handling,
code-tour, codebase-onboarding, search-first, context-budget, delivery-gate,
backend-patterns, api-design, documentation-lookup, security-review

## Daily commands (12 of 94)

/aside, /build-fix, /checkpoint, /code-review, /feature-dev, /plan, /pr,
/refactor-clean, /resume-session, /save-session, /update-codemaps, /update-docs

## Rules that apply

`rules/common`, `rules/typescript` (manifest-driven via tsconfig.json), and
`rules/web` (path-glob match on `public/index.html` / `public/style.css` even
without a JS framework). All other language rule folders (react, vue, python,
go, java, kotlin, swift, rust, cpp, csharp, fsharp, php, ruby, perl, dart,
angular, nuxt, react-native, arkts) are off-stack — LIBRARY.

## Hooks

Standard profile's generic safety/quality/git hooks apply as-is (bash safety,
config protection, stop-time `tsc --noEmit`, console.log scan, git guardrails,
cost/session tracking). LIBRARY/inert here: Plan Canvas, desktop-notify,
post-edit-format/quality-gate (no Biome/Prettier config), design-quality-check,
auto-tmux-dev (repo's dev script is `npm run start`, not `dev`), mcp-health-check
(no project MCP servers configured). **INCOMPATIBLE:** `insaits-security-monitor`
requires a Python/pip runtime this repo doesn't have — leave disabled.

## Known gap

There is no supported way to suppress the other 58 agents / 278 skills / 82
commands from tool listings short of disabling the `ecc@ecc` plugin entirely
(which would also remove the daily set) or moving to ECC's scaffolded install.
This file is a behavioral pointer for Claude and contributors, not an enforced
filter.
