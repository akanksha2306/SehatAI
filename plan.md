# SehatAI — Implementation Plan

Sequencing for the features in `features.md`. Backend tasks are owned by the `express-backend` agent, frontend tasks by the `react-frontend` agent (per `CLAUDE.md`). Each phase should be functionally complete and verifiable (`tsc` clean, manually testable) before moving to the next — don't parallelize phases 0-2, they're foundational.

## Before starting

**Decided (2026-08-22, see `notes/2026-08-22-scribe-gamification-grill.md`): the two "surprise" features stay mocked through the core build.** AI Scribe keeps the design's scripted word-by-word playback (no real STT), and streak/credits stay simple/placeholder — not the hardened, day-boundary/timezone/idempotent version. Neither blocks Phase 0-3. Each gets its own decision pass right before the phase that needs it:
- AI Scribe real STT (vendor, HIPAA/BAA requirement, streaming vs. batch, retention) → revisit before Phase 4/5
- Real streak/credit logic (activity definition, timezone, race conditions, what credits are for / CME) → revisit before Phase 6

One remaining open question from `PRD.md` does still affect earlier scope and is worth a quick call before Phase 2:
1. Do onboarding answers drive personalization, or just get stored? If undecided, proceed with "store only" — cheapest, easiest to upgrade later.

---

## Phase 0 — Repo & project scaffolding

- [ ] `git init`, initial commit of existing design files + docs
- [ ] Scaffold frontend: Vite + React + TypeScript, Tailwind, shadcn/ui init, React Router v7 — `react-frontend` agent
- [ ] Scaffold backend: Express + TypeScript, Prisma, Zod, project structure per `express-backend` agent conventions (`routes/controllers/services/middleware/schemas/prisma/lib`) — `express-backend` agent
- [ ] Provision Neon Postgres project, set `DATABASE_URL` in backend `.env` (never commit it)
- [ ] `prisma init`, confirm connection with `prisma db pull`/`migrate dev` against an empty schema
- [ ] Both `tsconfig.json`s set to `"strict": true`; confirm `npx tsc --noEmit` runs clean on empty scaffolds
- [ ] Decide monorepo layout now (e.g. `/frontend`, `/backend` at repo root) — keeps the two agents' working directories unambiguous

**Done when:** frontend dev server and backend dev server both run locally, backend can read/write a trivial row in Neon.

## Phase 1 — Data model & auth

- [ ] Write the Prisma schema for all entities in `features.md` §11 (`User`, `OnboardingResponse`, `ChapterProgress`, `UserStats`, `SavedWorkflow`, `Chapter`) — `express-backend`
- [ ] First migration (`prisma migrate dev`)
- [ ] Seed script: load `promptChapters` and `hallChapters` content (currently in `SehatAI-App.logic.txt`) into the `Chapter` table — `express-backend`
- [ ] Auth: sign-up/sign-in endpoints, password hashing (bcrypt) or magic-link, JWT issuance, `authenticate` middleware — `express-backend`
- [ ] Frontend auth screens/state: the design's welcome step already has an email field + SSO stub — wire the real submit to the auth endpoint — `react-frontend`

**Done when:** a user can sign up, sign in, and hit an authenticated `/api/me` endpoint from the frontend.

## Phase 2 — Onboarding

- [ ] `POST /api/onboarding` (validated via Zod: confidence, challenges[], goal, time_cadence) → writes `OnboardingResponse`, marks user onboarded — `express-backend`
- [ ] Redirect logic: new/un-onboarded users → onboarding flow; onboarded users → Path — `react-frontend`
- [ ] Port the 5-step wizard UI from `SehatAI-Onboarding.logic.txt` as atomic-design components (step indicator = molecule, option card = molecule, wizard shell = organism) — `react-frontend`
- [ ] Recap screen reads back saved answers from the API response, not just local state — `react-frontend`

**Done when:** onboarding answers survive a refresh and a re-login (i.e. actually persisted, not just component state).

## Phase 3 — Course engine (Prompt Lab + Hall of Hallucinations)

Build one engine, parameterized by track — do not duplicate the two courses as separate code paths.

- [ ] `GET /api/courses/:track/chapters` — chapter list + per-user lock/complete state — `express-backend`
- [ ] `POST /api/courses/:track/chapters/:index/complete` — Zod-validated quiz score payload, writes `ChapterProgress`, credits `UserStats` atomically (Prisma `$transaction`) — `express-backend`
- [ ] Chapter list, reading, quiz, and reward screens as organisms reused across both tracks — `react-frontend`
- [ ] Path dashboard tiles wired to real per-track progress — `react-frontend`
- [ ] Prompt bank (static templates, copy-to-clipboard) — `react-frontend` only, no backend needed yet

**Done when:** completing a chapter's quiz persists progress + credits server-side and correctly unlocks the next chapter after a refresh.

## Phase 4 — AI backend integration layer

Build the three proxied AI endpoints before wiring the two features that need them (Scribe, Build Workflow) and the prompt improver.

- [ ] `POST /api/prompt/improve`, `POST /api/scribe/translate`, `POST /api/workflow/generate` — Zod-validated request bodies, server-side Anthropic API key, prompts ported verbatim from the constraints already specified in `SehatAI-App.logic.txt` (esp. the "preserve medication names/doses/timing exactly" constraint on translation) — `express-backend`
- [ ] Rate limiting on all three (e.g. per-user per-minute cap) — `express-backend`
- [ ] Basic usage logging (user_id, endpoint, timestamp, token count if available) for cost tracking — `express-backend`

**Done when:** each endpoint returns a real Claude completion given a valid payload, rejects invalid payloads with 400, and is rate-limited.

## Phase 5 — Prompt improver + AI Scribe + Build Workflow (frontend)

Can proceed in parallel once Phase 4 is done — three independent UI surfaces against the same backend layer.

- [ ] Prompt improver UI (textarea → rewritten prompt) inside Prompt Lab — `react-frontend`
- [ ] AI Scribe: resolve the STT decision from "Before starting" — either browser `SpeechRecognition` or a vendor SDK — then build record → transcript (editable) → dialect select → translate — `react-frontend`
- [ ] Build Workflow: task input + suggestion chips → generate → copy/save — `react-frontend`
- [ ] `POST /api/workflows` (save) and `GET /api/workflows` (list saved) — `express-backend`
- [ ] Saved-workflows view (not in original design — needed since save is now real, not a UI flag) — `react-frontend`

**Done when:** all three tools produce real Claude output and Build Workflow's "save" actually persists and can be retrieved.

## Phase 6 — Gamification correctness

- [ ] Real streak logic server-side: increment on first activity of a new calendar day, reset if a day is missed (design currently has a static placeholder `streak: 12`) — `express-backend`
- [ ] `UserStats` surfaced consistently across Path header, per-track progress — `react-frontend`
- [ ] Resolve the credits-redemption question from `PRD.md` (§5/§7) — either implement redemption or explicitly document credits as engagement-only for now

**Done when:** streak increments/resets correctly across day boundaries in manual testing (or a fast-forwarded test clock).

## Phase 7 — Hardening (pre-launch)

- [ ] Error handling audit: centralized error middleware covers all endpoints, no raw Prisma/DB errors leak to the client (per `express-backend` conventions)
- [ ] `tsc --noEmit` clean on both frontend and backend
- [ ] Basic integration test pass on auth, onboarding, and one full chapter-completion flow **[testing framework not yet chosen — decide alongside Phase 0 scaffolding, e.g. Vitest + supertest]**
- [ ] Env var / secrets check: `DATABASE_URL`, Anthropic API key, JWT secret all out of source control
- [ ] Deployment target decision **[not yet made — needed before this phase, e.g. frontend on Vercel, backend on Railway/Render/Fly, Neon already handles DB hosting]**
