# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state

This repository is **pre-implementation**. It contains only design artifacts — no `package.json`, no frontend/backend source, no build tooling, and it is not yet a git repo. There are no build/lint/test commands to run because no codebase exists yet. Do not invent any.

**Intended target stack** (stated by the project owner, not yet scaffolded):
- Frontend: React + Vite + Tailwind + shadcn/ui
- Backend: Express.js / Node.js
- Database: Neon (serverless Postgres) via Prisma ORM

See `PRD.md`, `features.md`, and `plan.md` for the product spec, feature breakdown, and implementation plan.

Two user-level Claude Code subagents already exist for this stack and should be used once implementation starts: `react-frontend` (Vite/Tailwind/shadcn/React Router v7, strict TypeScript, atomic-design component structure, `tsc` verification required) and `express-backend` (Express/Prisma/Zod, strict TypeScript, layered architecture, `tsc` verification required). Both run on Haiku.

## Repository contents

| File | What it is |
|---|---|
| `SehatAI-App.html` | Self-contained, bundled export of the main app screen from Claude Design's canvas tool. Inlines all JS/CSS into one file with an unpacking loader (`__bundler_loading`/`__bundler_thumbnail`). **Not meant to be hand-edited** — it's a rendered snapshot of the design, not application source. |
| `SehatAI-App.logic.txt` | The actual design logic behind `SehatAI-App.html` — a `class Component extends DCLogic` with a `renderVals()` method that returns the view-model consumed by the canvas template. This is the source of truth for the app's behavior/content; read this instead of parsing the bundled HTML. |
| `SehatAI-Onboarding.html` | Same bundled-export format as above, for the onboarding flow screen. |
| `SehatAI-Onboarding.logic.txt` | Logic/content source for the onboarding flow, same `DCLogic` pattern. |
| `Untitled.md` | Empty. |

When asked to change what the app does or looks like, treat the `.logic.txt` files as spec — they contain the actual state shape, content strings (course chapters, quiz questions, onboarding copy), and interaction logic. The `.html` files are compiled output of a design tool and will be regenerated from the design, not maintained by hand once real implementation begins.

## Product architecture (from the design logic)

The product is **SehatAI**, an AI-literacy coaching app for clinicians. (Earlier design mockups used the name "Aegis" in copy — renamed to SehatAI throughout on 2026-08-22.) It has two top-level flows:

### Onboarding (`SehatAI-Onboarding.logic.txt`)
A linear 5-step flow (`welcome → confidence → challenges → goal → time → done`) that calibrates a new user: sign-in (email), self-rated AI confidence, where their time leaks (multi-select), one anchor goal, and daily time budget (2/5/10 min). Ends on a recap screen. This is a data-collection wizard with no persistence yet — answers live only in component state.

### Main app (`SehatAI-App.logic.txt`)
Five sections, tab-navigated:
- **Prompt Lab** — 7-chapter lesson track (`promptChapters`) teaching prompt engineering; each chapter has reading content, a 2-question quiz, and a credit reward. Progress is tracked per-track in `state.done`.
- **Hall of Hallucinations** — 10-chapter gamified track (`hallChapters`) on how LLMs work and why they hallucinate, same chapter/quiz/reward shape as Prompt Lab. Both tracks share the same rendering and progression logic (`chaptersFor`, `openChapter`, `pick`, `finish`) — they're data-driven from the two chapter arrays, not separately coded screens.
- **AI Scribe** — mock consultation recorder: simulates live transcription word-by-word (`startRec`), then translates the transcript into a selected dialect/language via `window.claude.complete`.
- **Build Workflow** — takes a repeated clinical task + description and generates a 3-part output (playbook, ready-to-use prompt, verify-before-signoff checklist) via `window.claude.complete`.
- A **prompt bank** and **prompt improver** (rewrites a rough prompt into a structured one) live inside the Prompt Lab track.

All three AI-backed features (`translate`, `generateWorkflow`, `improvePrompt`) currently call `window.claude.complete` directly from the component and fall back to a static placeholder string when it's unavailable — there is no real backend call yet. When building the actual Express/Supabase backend, these three call sites are the integration points to replace with real API calls.

Quiz/progress/credit state (`streak`, `credits`, `done`, per-chapter quiz score) is all in-memory component state with no persistence layer — this is the main gap the Neon/Prisma backend needs to fill (user accounts, progress, streaks, credits).

Whenever there is any backend feature work, it should be picked up by backend agent ie express-backend and it should do it.
Whenever there is any frontend feature work, it should be picked up by frontend agent ie react-frontend and it should do it.


