# SehatAI

**Your shield against confident nonsense.**

SehatAI coaches clinicians to use AI safely, confidently, and on the job — built around real tasks, not abstract theory. It teaches doctors how AI actually works (and where it fails) through short gamified lessons, then puts that judgment to work with real tools for translation, prompt writing, and workflow building.

Core principle: **AI drafts, you decide.**

## Features

- **Prompt Lab** — 7-chapter course on prompt engineering, each ending in a quiz
- **Hall of Hallucinations** — 10-chapter gamified course on how LLMs work and why they hallucinate
- **Prompt bank** — ready-made clinical prompt templates, copy-to-clipboard
- **Prompt improver** — rewrites a rough prompt into a structured one (AI-backed)
- **AI Scribe** — simulated consultation recording, translated into 9 patient dialects (AI-backed)
- **Build Your Workflow** — turns a repeated task into a playbook + prompt template + verify checklist (AI-backed), with real save/reuse
- **Onboarding** — calibrates confidence level, focus areas, goal, and daily time budget
- **Gamification** — real credits and streak tracking based on actual chapter completion

> Note: the three AI-backed features above currently run on clearly-labeled mock output — they need a real Anthropic API key to produce live AI responses (see [Configuration](#configuration)). Everything else is fully real.

## Tech stack

**Frontend:** React 19 · Vite · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui · React Router v7 · TanStack Query · React Hook Form + Zod

**Backend:** Express · TypeScript (strict) · Prisma ORM · Zod validation · JWT auth (magic-link, passwordless) · express-rate-limit

**Database:** Neon (serverless Postgres)

**Email:** Resend (magic-link delivery)

**AI:** Anthropic Claude, proxied server-side (never exposed to the frontend)

**Animations:** LottieFiles (`@lottiefiles/dotlottie-react`)

## Project structure

```
SehatAI/
├── frontend/          # React + Vite app
│   └── src/
│       ├── features/  # atomic-design feature modules (courses, onboarding, scribe, workflow)
│       ├── pages/      # route-level pages
│       ├── lib/         # typed API client
│       └── contexts/  # auth context
├── backend/            # Express API
│   └── src/
│       ├── routes/        # route wiring
│       ├── controllers/  # request/response handling
│       ├── services/     # business logic (the only layer touching Prisma)
│       ├── middleware/  # auth, validation, rate limiting, error handling
│       └── schemas/      # Zod validation schemas
│   └── prisma/           # schema, migrations, seed data
├── CLAUDE.md            # codebase guide for Claude Code
├── PRD.md                 # solution PRD
├── features.md          # full feature breakdown
├── plan.md               # phased implementation plan
├── Deferred.md          # parked items, incl. what MUST be removed before shipping
└── services.md          # external accounts connected (Neon, Resend)
```

## Getting started

### Prerequisites
- Node.js
- A [Neon](https://neon.tech) Postgres database
- A [Resend](https://resend.com) API key (for magic-link emails)
- An [Anthropic](https://console.anthropic.com) API key (optional — AI features run on mock output without it)

### Backend

```bash
cd backend
npm install
```

Create `backend/.env` (see `backend/.env.example` for the full list):

```
DATABASE_URL=          # your Neon connection string
JWT_SECRET=              # random 32+ byte string
PORT=4000
APP_URL=                  # your frontend's URL, e.g. http://localhost:5173
RESEND_API_KEY=
ANTHROPIC_API_KEY=      # optional — omit to run AI features on mock output
```

```bash
npx prisma migrate dev   # apply the database schema
npx prisma db seed          # seed the 17 course chapters
npm run dev                     # starts on http://localhost:4000
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:4000
```

```bash
npm run dev   # starts on http://localhost:5173
```

## Configuration

**Magic-link sign-in:** no password — enter your email, click the link sent to you. In dev, if `ANTHROPIC_API_KEY`/`RESEND_API_KEY` aren't set up correctly this fails gracefully with clear errors, not silent failures.

**AI features (Prompt Improver, Scribe translate, Workflow generate):** each checks for `ANTHROPIC_API_KEY` at call time. No key → clearly-labeled mock response. Key present → real Claude call. No code changes needed to switch — just set the env var.

## Documentation

- [`PRD.md`](./PRD.md) — problem, target users, product goals, open questions
- [`features.md`](./features.md) — feature-by-feature breakdown
- [`plan.md`](./plan.md) — phased build plan
- [`Deferred.md`](./Deferred.md) — parked items and pre-launch cleanup checklist
- [`CLAUDE.md`](./CLAUDE.md) — architecture notes for AI-assisted development on this codebase
