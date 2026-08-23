# SehatAI — Solution PRD

> Derived from the two design artifacts in this repo (`SehatAI-Onboarding.html`/`.logic.txt` and `SehatAI-App.html`/`.logic.txt`). Anything not directly evidenced in those designs is marked **[assumption]** and should be validated before being treated as a decision.

## 1. Problem

Clinicians are already using general-purpose AI tools (ChatGPT, Claude, etc.) in their daily workflow — documentation, patient communication, summarizing records — without training on how these models actually fail. The core risk the product names explicitly in its own onboarding copy: AI gives **"confident nonsense"** — fluent, certain-sounding output that can be subtly or entirely wrong (hallucinated citations, wrong doses, mistranslated instructions) with no visible signal that it's wrong. In a clinical setting, that failure mode has real patient-safety consequences.

Clinicians also have almost no slack time for training — a course that assumes 30+ minute sessions or generic AI-literacy content unrelated to their actual tasks won't get used.

## 2. Target users

Clinicians (the onboarding copy addresses the user as "Doctor" and references hospital email sign-in) — physicians and likely nurses/allied staff **[assumption: exact roles beyond "clinician" not specified in source]**. Users range from AI beginners to daily users who "just want the edge cases" (per the onboarding confidence question), so the product must calibrate rather than assume a single skill level.

## 3. Product goal

Teach clinicians to use AI **safely and confidently in their actual workflow** — not as an abstract AI-literacy course, but through short, daily, task-relevant lessons plus real tools (a scribe/translator, a workflow builder) that put the taught skills to immediate use. The product's own stated thesis: *"AI drafts, you decide."* Every AI-assisted feature exists to reinforce a verify-before-use habit, not to replace clinical judgment.

## 4. Solution overview

A gamified micro-learning app with two halves:

1. **Calibrated onboarding** — a 5-step wizard (confidence level, where time leaks in their day, one anchor goal, daily time budget) that personalizes what the user sees first. Answers currently aren't used to actually filter content in the design (all users see the same two tracks) — wiring that calibration into real personalization is a build gap, not just a persistence gap.
2. **A home ("Path") dashboard** surfacing four modules, gated by quiz-based progression and rewarded with credits/streaks:
   - **Prompt Lab** — 7-chapter course teaching prompt engineering fundamentals (role, task, context, format/constraints, zero/few-shot, chain-of-thought, iteration+verification), plus a **prompt bank** (ready-made clinical prompt templates) and a **prompt improver** tool.
   - **Hall of Hallucinations** — 10-chapter gamified course on how LLMs actually work and why/where they hallucinate, ending in the same "verify before you sign off" workflow principle.
   - **AI Scribe** — records/transcribes a consultation and translates it into the patient's language/dialect (9 dialects including several Spanish variants, Hindi, Tagalog, Vietnamese, Arabic, Mandarin, Portuguese, and a "Plain English (low literacy)" mode), preserving medication names/doses/timing exactly.
   - **Build Your Workflow** — turns a clinician's repeated task into a reusable 3-part artifact: a playbook, a copy-ready prompt template, and a "verify before you sign" checklist.

Every AI-generated output in the design (translation, workflow, improved prompt) is produced by a single underlying model call and explicitly framed as a draft the clinician must verify — this "AI drafts, you decide" framing is a product principle, not just a UI detail, and should be preserved through implementation (e.g. don't silently auto-apply AI output; always require an explicit accept/copy/save action, which the design already does).

## 5. Success signals **[assumption — not specified in source, propose for validation]**

- Onboarding completion rate and drop-off step
- Daily/weekly active use against the user's chosen time cadence (2/5/10 min) — are people actually returning at their stated cadence?
- Chapter completion rate per track (Prompt Lab vs. Hall of Hallucinations) and quiz pass rate on first attempt
- Repeat usage of AI Scribe and Build Workflow (tools, not lessons — usage here signals the training is translating into real workflow adoption)
- Streak retention (7-day, 30-day)

## 6. Out of scope (for this phase)

- Actual clinical charting / EHR integration — AI Scribe is a translation/documentation aid, not a charting system
- CME credit issuance — named as a possible onboarding goal option ("Earn CME credits") but no CME logic exists in the design; treat as a future goal, not a committed feature
- Multi-role support beyond "clinician" (e.g. admin dashboards, care teams) — not evidenced in the design
- Real-time speech-to-text — the design's "recording" is a simulated word-by-word playback of a fixed sample transcript, not real audio transcription

## 7. Key open questions for the product owner

1. Should onboarding answers (confidence, challenges, goal, cadence) actually personalize the Path/dashboard content, or is that future scope?
2. Is CME credit issuance a real near-term goal, given it's offered as an onboarding option with no supporting feature?
3. What's the real transcription source for AI Scribe — a speech-to-text vendor, or is browser-native speech recognition sufficient?
4. Are credits/streak purely engagement gamification, or do they tie to anything real (CME, certification, leaderboards)?

## 8. Target technical stack

- Frontend: React + Vite + Tailwind CSS + shadcn/ui + React Router v7
- Backend: Express.js (Node.js), Prisma ORM, Zod validation
- Database: Neon (serverless Postgres)
- AI: Anthropic Claude via backend-proxied API calls (replacing the design's direct `window.claude.complete` calls — see `plan.md`)

See `features.md` for the feature-by-feature breakdown and `plan.md` for the implementation sequencing.
