# SehatAI — AI Scribe & Gamification: Grill / Discovery Notes
Date: 2026-08-22 · Goal: Pin down real decisions for the 2 surprises found in the design (fake Scribe recording, fake streak/credits) so `features.md` and `plan.md` can be made concrete instead of flagged as open questions.

## Summary / key decisions
- **Decision: defer both surprises.** Build the "normal" features first (auth, onboarding, course engine — Prompt Lab / Hall of Hallucinations progression). Ship them with the design's existing mocked/placeholder behavior intact:
  - AI Scribe keeps the scripted word-by-word playback of the fixed sample transcript (no real STT yet).
  - Streak/credits keep simple/placeholder logic (not necessarily the literal hardcoded `12`, but not the fully hardened day-boundary/timezone/idempotent version either) until revisited.
- Real STT vendor choice (HIPAA/BAA question, medical vocabulary accuracy, streaming vs batch, retention policy) and real streak/credit logic (activity definition, timezone, race conditions, credit redemption/CME) are **not blocking** the initial build. They get their own grill session later, right before their respective plan phases (Scribe → before Phase 4/5; streak/credits → before Phase 6).
- This matches how `plan.md` was already sequenced (Scribe = Phase 4/5, gamification correctness = Phase 6, both after the core Phase 0-3 build) — the only change is making the deferral an explicit decision rather than an open question sitting in "Before starting."

## Q&A log

### Q1 — AI Scribe: compliance requirement
- Asked: Should AI Scribe be built HIPAA-compliant from day one (BAA-covered STT vendor), or can that decision wait?
- Captured: User reframed the question — rather than deciding STT vendor/compliance now, defer the whole "make Scribe real" feature until after the normal features are done. Same call extended to streak/credits by the user's phrasing ("those 2 surprise features, can we do them later?").
- Flags: STT vendor + HIPAA/BAA decision -> revisit in a future grill session before starting Phase 4/5 (AI backend integration layer) in `plan.md`.

### Q2 — Streak/credit real logic
- Asked: (not formally asked — folded into the same deferral answer as Q1)
- Captured: Streak/credit definition, timezone handling, race conditions, and what credits are actually for (redemption vs. pure engagement vs. CME) are all deferred, not decided.
- Flags: Streak/credit design -> revisit in a future grill session before starting Phase 6 (Gamification correctness) in `plan.md`.

## Open flags (pending input)
- AI Scribe real STT approach/vendor + HIPAA/BAA requirement -> revisit before Phase 4/5
- Streak/credit real logic (activity definition, timezone, redemption/CME) -> revisit before Phase 6
