# SehatAI — Feature Breakdown

Derived from `SehatAI-Onboarding.logic.txt` and `SehatAI-App.logic.txt`. Everything below currently exists only as in-memory UI state in the design — none of it is backed by real auth, a database, or a real AI call yet. Grouped by area; see `plan.md` for build order.

## 1. Auth & user accounts
- [ ] Email-based sign-in/sign-up (design shows an email field + an "SSO" button stub — decide real auth: magic link, password, or actual SSO provider)
- [ ] User record (id, email, created_at) in Neon via Prisma
- [ ] Session handling (JWT, per `express-backend` agent conventions)
- [ ] Persist the onboarding answers to the user record (currently lost on refresh)

## 2. Onboarding wizard
- [ ] 5-step flow: welcome/email → confidence → challenges (multi-select) → goal → time cadence → done/recap
- [ ] Step progress indicator + back/continue navigation (already fully specified in design — port as-is)
- [ ] Persist answers: `confidence` (beginner/some/confident), `challenges` (multi: docs/summaries/comms/coord/prompteng), `goal` (confident/time/prompts/verify/compliant/cme), `time_cadence` (2/5/10 min)
- [ ] Recap screen summarizing all four answers
- [ ] Redirect straight to onboarding for new users, straight to Path for returning users who've completed it
- [ ] **Decision needed:** should these answers actually drive personalization (e.g. reorder Path tiles, filter chapters) or just be stored? Design doesn't currently use them for personalization — flagged in `PRD.md` open questions.

## 3. Path (home dashboard)
- [ ] Four module tiles: Prompt Lab, Hall of Hallucinations, AI Scribe, Build Your Workflow
- [ ] Per-tile progress badge (e.g. "3/7", "5/10 · 120 cr") driven by real completion data
- [ ] Persistent streak + credit balance display in the header/nav

## 4. Course engine (shared by Prompt Lab + Hall of Hallucinations)
Both tracks are the same engine over different content arrays — build once, parameterize by track.
- [ ] Chapter list view with locked/unlocked/complete states (a chapter unlocks only after the previous one is completed — sequential gating)
- [ ] Chapter reading screen (title, paragraphs, one-line "key takeaway")
- [ ] Quiz screen: multiple-choice, 1-2 questions per chapter, immediate right/wrong feedback + explanation text per question
- [ ] Reward screen on chapter completion: credits earned, score (e.g. "2/2"), unlock-next CTA
- [ ] Progress bar (chapters cleared / total, %)
- [ ] Server-side persistence of: per-user chapter completion, quiz scores, credits earned, and current streak
- [ ] Content source: **Prompt Lab** — 7 chapters (prompt basics, roles, task+context, format+constraints, zero/few-shot, chain-of-thought, iterate+verify). **Hall of Hallucinations** — 10 chapters (what an LLM is, tokens, training cutoff, what hallucination means, why it sounds confident, prompts steering output, retrieval/grounding, high-risk zones, human-in-the-loop workflow, becoming a safe practitioner). Content strings live in `SehatAI-App.logic.txt` (`promptChapters`, `hallChapters`) — move into a DB table or seed file, not hardcoded in frontend, so content can be edited without a redeploy.

## 5. Prompt bank (within Prompt Lab)
- [ ] Static list of 3 ready-made clinical prompt templates (patient explanation, SBAR handoff, de-jargon a report) with copy-to-clipboard
- [ ] **[future]** Consider making this DB-backed/editable rather than hardcoded, so templates can grow without a frontend release

## 6. Prompt improver (within Prompt Lab)
- [ ] Textarea for a rough prompt → AI rewrites it into a structured prompt (role/task/context/format/constraints) via backend-proxied Claude call
- [ ] Loading state, done state, "rewrite again" affordance (already specified in design — port as-is)

## 7. AI Scribe
- [ ] Real audio capture + speech-to-text (the design's "recording" is a scripted word-by-word playback of a fixed sample transcript, not real transcription — this needs an actual STT integration to be a real feature; **[open question in PRD.md]**)
- [ ] Editable transcript before translation
- [ ] Dialect/language selector — 9 options (Spanish Mexican, Spanish Caribbean, Hindi, Tagalog, Vietnamese, Arabic Levantine, Mandarin Simplified, Portuguese Brazilian, Plain English low-literacy)
- [ ] Translate transcript via backend-proxied Claude call, with an explicit constraint in the prompt to preserve medication names/doses/timing exactly (already specified in design's prompt — carry this constraint into the real backend prompt, it's a safety requirement not a nice-to-have)
- [ ] Recording/translation history — currently ephemeral per-session; decide if past scribe sessions should persist per patient/encounter or stay session-only for privacy

## 8. Build Your Workflow
- [ ] Task input + optional "how you do it now" description, with quick-pick suggestion chips (Discharge instructions, Shift handoff SBAR, Referral letter, Prior-auth letter, Patient portal replies)
- [ ] Generates 3-part output via backend-proxied Claude call: Playbook (numbered steps), Ready-to-use prompt template (with `[bracketed]` fields), Verify-before-signoff checklist
- [ ] Copy-to-clipboard and "save to my workflows" actions
- [ ] Persistence for saved workflows per user (currently "Saved ✓" is just a UI flag with no actual storage)
- [ ] A way to view/reuse previously saved workflows (not in the current design — needed once save is real)

## 9. Gamification (streak + credits)
- [ ] Credits awarded per chapter completion (20-35 cr depending on chapter, defined in content data)
- [ ] Daily streak tracking — needs a real "last active date" check server-side (design just has a static `streak: 12` placeholder, no actual streak logic)
- [ ] Decide what credits are redeemable for, if anything, vs. pure engagement signal (ties into the "Earn CME credits" onboarding goal option — see `PRD.md` open questions)

## 10. Backend AI integration layer
All three AI-backed features in the design call `window.claude.complete` directly from the frontend and fall back to a static placeholder when unavailable. This must move server-side:
- [ ] `POST /api/scribe/translate` — dialect translation
- [ ] `POST /api/workflow/generate` — workflow builder
- [ ] `POST /api/prompt/improve` — prompt improver
- [ ] Server holds the Anthropic API key (never shipped to frontend); backend constructs the same prompts the design already specifies (see each feature above for the exact constraints to preserve)
- [ ] Rate limiting on these endpoints (cost control — every call is a paid model call)
- [ ] Basic usage logging per user (for cost monitoring and the success-signal tracking in `PRD.md`)

## 11. Data model (Neon / Prisma) — first-pass entities
- [ ] `User` (id, email, auth fields, created_at)
- [ ] `OnboardingResponse` (user_id, confidence, challenges[], goal, time_cadence, completed_at)
- [ ] `ChapterProgress` (user_id, track [prompt|hall], chapter_index, completed_at, quiz_score, credits_earned)
- [ ] `UserStats` (user_id, credits_total, current_streak, longest_streak, last_active_date)
- [ ] `SavedWorkflow` (user_id, task, description, playbook, prompt_template, checklist, created_at)
- [ ] `Chapter` (track, index, title, content, quiz JSON, reward) — seeded from the existing design content, editable without redeploy
- [ ] **[decide]** `ScribeSession` — only if scribe history needs to persist (see open question in section 7)
