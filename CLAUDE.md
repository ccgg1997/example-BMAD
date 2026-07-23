# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

**Domicilios San Pedro** — planning artifacts for a small delivery-tracking web app for an independent pharmacy (Droguería San Pedro). The problem: delivery drivers (repartidores) verbally get handed orders and track them from memory or paper, causing duplicate/lost order assignments and payment disputes. The app will let a driver register which order numbers they're taking on departure (blocking double-assignment) and let the owner see a per-driver count/amount-owed summary.

This repository currently contains **only BMad Method planning docs — no application source code exists yet** (no `package.json`, `app/`, or `prisma/` at the root). The target project structure is fully specified in `docs/architecture/unified-project-structure.md` but has not been scaffolded. Story files exist (`docs/stories/*.story.md`) but all are in `Draft` status — implementation has not started. Do not assume any app code, tests, or build tooling exist until you've checked.

## BMad Method workflow

This project uses the **BMad Method** (agentic planning framework, `.bmad-core/`). Planning documents were produced by BMad agent personas (Analyst, PM, Architect, PO) invoked via `.claude/commands/BMad/agents/*.md` (slash-invoked, e.g. `/BMad:agents:dev`, `/BMad:agents:sm`). Key config: `.bmad-core/core-config.yaml`.

- PRD is sharded: `docs/prd.md` is the index, real content lives in `docs/prd/*.md` (goals, requirements, epics, UI goals, technical assumptions).
- Architecture is sharded: `docs/architecture.md` is the index, real content lives in `docs/architecture/*.md`.
- Stories live in `docs/stories/{epic}.{story}.story.md`, generated from epics via the `create-next-story` task, and follow `.bmad-core/templates/story-tmpl.yaml`.
- Standard loop for future dev work: **SM** drafts next story from the epic → **Dev** implements against the story's acceptance criteria → **QA** reviews (`.bmad-core/tasks/review-story.md`, gate results recorded per `qa-gate-tmpl.yaml`). Use `/BMad:agents:sm`, `/BMad:agents:dev`, `/BMad:agents:qa` to invoke these personas.
- `docs/architecture/coding-standards.md`, `tech-stack.md`, and `unified-project-structure.md` are marked as "always load" for the Dev agent (`devLoadAlwaysFiles` in core-config.yaml) — read these before writing any app code.

### Planning destination and tracker integrations

Before creating, updating, synchronizing, or publishing any planning artifact (roadmap, epic, story, task, backlog, sprint, acceptance criteria, or status), require the user to explicitly choose the target: **Jira** or **Azure DevOps**.

- If the target is missing, ask which tracker to use before performing any external write.
- Do not infer the target from installed MCP servers, previous work, repository history, or an existing mirror.
- Do not publish to both trackers unless the user explicitly requests both.
- A request explicitly limited to local BMad files may remain local without selecting an external tracker.
- Read-only requests that already name Jira or Azure DevOps do not require another destination question.

When the user selects **Jira**, use these two skills (global, `~/.claude/skills/`):

- `crear-stories-jira` — builds the Epic → Story → Subtask hierarchy in Jira from `docs/prd/epic-*.md` + `docs/stories/*.story.md`. Run once per new/updated story before dev work starts; idempotent (searches by summary before creating).
- `flujo-tarea-jira` — invoke every time the Dev agent starts or finishes a Task/Subtask or a full story during `develop-story`. On start: transitions the matching Jira issue to "in progress" (only sets `Status: InProgress` in the `.story.md` on the story's first task). On finishing a task: marks its checkbox `[x]`, updates File List, commits + pushes that increment, transitions the Jira Subtask to Done. On finishing the whole story: runs `story-dod-checklist`, sets `.story.md` `Status` to `Review` or `Done`, commits/pushes, and transitions the Jira Story issue accordingly. Never creates Jira issues itself (that's `crear-stories-jira`'s job) and never guesses transition names — always reads them via `getTransitionsForJiraIssue` first.

When the user selects **Azure DevOps**, use the global skill `manage-azure-devops` (`~/.codex/skills/manage-azure-devops/SKILL.md`) and the `azure_devops` MCP. Read the current project state before writing, avoid duplicates, apply only requested changes, and verify every write with a follow-up read. Do not modify Jira unless the user explicitly requests both trackers.

## Planned architecture (not yet built)

Once scaffolded, this will be a single Next.js 15 (App Router) project — frontend and backend (Route Handlers) in one codebase, TypeScript throughout:

- **DB:** PostgreSQL 16 via Prisma. Three models: `Repartidor`, `RegistroSalida` (the core entity — one row per order registered as "out for delivery"), `ConfiguracionSistema` (singleton holding the current per-delivery fee).
- **Auth:** single shared app password (no per-user accounts), signed httpOnly session cookie — not OAuth/JWT/multi-user.
- **State:** no global state manager — React Server Components read straight from the DB; `useState` for local UI state only.
- **API:** REST/JSON via Next.js Route Handlers under `app/api/**`.
- **Testing:** Vitest (+ React Testing Library for components) for unit/integration. **No E2E for MVP** — manual guided testing before each delivery to the owner instead.
- **Deploy:** single VPS via Docker Compose (app + Postgres + Caddy reverse proxy), GitHub Actions CI/CD.
- **Full stack table:** `docs/architecture/tech-stack.md` is the source of truth — check it before adding any dependency.

### Critical rules once code exists (from `docs/architecture/coding-standards.md`)

- No direct Prisma access from Client Components — DB queries only in Server Components, Route Handlers, or `lib/services/*`.
- Env vars only via `lib/config.ts`, never scattered `process.env`.
- Every Route Handler validates its body with `zod` before calling a service.
- `tarifaAplicada` (fee) is snapshotted onto each `RegistroSalida` at creation time — never recalculated retroactively if the system fee config changes later.
- Duplicate-order-assignment prevention (FR4) relies on the DB `UNIQUE` constraint on `numero_pedido` as the single source of truth — do not duplicate that check in application logic.
- Never log the app password or `SESSION_SECRET` (not in Sentry, not in Pino logs).
- Naming: components PascalCase, hooks camelCase `useX`, API routes kebab-case, DB tables snake_case.

## Commands (once scaffolded)

Per `docs/architecture/development-workflow.md`:

```bash
cp .env.example .env
npm install
docker compose up -d db
npx prisma migrate dev

npm run dev      # local dev server (Turbopack), pointing at Dockerized db
npm run test     # Vitest
docker compose up -d   # run everything (app + db) in Docker
```

Required env vars: `DATABASE_URL`, `APP_PASSWORD`, `SESSION_SECRET`, `SENTRY_DSN` (optional).

## Language note

All product/planning docs (brief, PRD, architecture, stories) are written in **Spanish** — match that language when editing or extending them.
