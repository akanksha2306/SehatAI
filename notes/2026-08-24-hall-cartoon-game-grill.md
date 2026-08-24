# Hall of Hallucinations — Cartoon/Game Mechanic: Grill / Discovery Notes
Date: 2026-08-24 · Goal: Extract what the "caricature/cartoon + coin-throw game" idea for Hall of Hallucinations actually is, and decide the image-generation provider question (Gemini or other).

## Summary / key decisions
- **⚠️ PIVOT (superseded the coin-flip idea below):** the coin-flip reveal-moment concept is scrapped entirely — "remove this coin flip wall idea, I don't want that."
- **New concept**: a doctor character (holding an X-ray/report) who intros/starts the chapter's quiz — "he just tells the user to pick this quiz." This reads as a host/intro character at the start of the quiz, not a per-answer reveal. Animated, not static.
- **Specific asset chosen by user**: https://lottiefiles.com/free-animation/female-doctor-holding-x-ray-nljMuFt9UT — she wants this exact one implemented, not a search for alternatives.
- **No AI image generation needed** — still holds, resolves the original "Gemini or something else" question as moot.
- **Source: free Lottie animation** — still holds, just a different specific animation than the coin-flip search.
- **Scope not yet confirmed**: Hall of Hallucinations only, or also Prompt Lab — still an open question, now applies to where this doctor-intro appears rather than the coin-flip reveal.

<details>
<summary>Superseded: coin-flip concept (kept for history, no longer the plan)</summary>

A cartoon coin-flip animation was originally going to play as a delight/reveal moment right after picking a quiz answer, with two matching happy/sad landing clips. Scrapped per the pivot above — LottieFiles blocked automated preview fetching (403) before a specific pair was ever confirmed, then the user changed direction entirely before that got resolved.
</details>

## Q&A log

### Q1 — What does the coin-throw represent?
- Asked: Where does this fit into the existing chapter/quiz structure — a reveal-moment animation, a standalone mini-game, or something else?
- Captured: Confirmed exactly as recommended — a cartoon character coin-flip animation plays right after answering a quiz question, landing on ✓/✗ to match correctness. Decorative/delight layer on the existing feedback, not a new game mode.
- Flags: none

### Q2 — Does this need AI image generation at all?
- Asked: One reusable pre-built animation (no AI, no cost, no latency) vs. a uniquely AI-generated image every time (needs Gemini/another provider, real cost/latency)?
- Captured: "Go with option A" — one reusable animation, built once, no AI involved. Resolves the original Gemini question as moot.
- Flags: none

### Q3 — How should the animation be built/sourced?
- Asked: Free Lottie animation (fast, polished, stock) vs. custom-coded SVG (on-brand, simpler look) vs. commissioned/sourced art (best quality, needs sourcing first)?
- Captured: "Go with A" — free Lottie animation. Custom-branded character treated as a possible later polish pass, not now.
- Flags: none

### Q4 — Stock coin-spin + our own ✓/✗ overlay, or two full matching animations?
- Asked: Simpler approach (stock spin + our own icon reveal) vs. two separate full "happy landing"/"sad landing" clips as a matching pair?
- Captured: Wants the two-full-animations approach — a matching happy-landing (correct) / sad-landing (wrong) pair, not the simpler icon-overlay approach.
- Flags: **Need to actually source a matching happy/sad coin-flip Lottie pair** -> this is a real-asset search task for build time (search LottieFiles or similar), not a pure decision — will present candidate options when building rather than guessing blind here.

## Open flags (pending input)
- ~~Sourcing a matching happy/sad coin-flip Lottie animation pair~~ — moot, coin-flip concept scrapped.
- Resolved: user found and downloaded the exact asset herself (`DNA-Doctor.lottie`, a female doctor holding an X-ray), copied into `frontend/public/animations/dna-doctor.lottie`. Build dispatched.
- Still open: Hall of Hallucinations only vs. also Prompt Lab — defaulted to Hall-only per her original framing, not explicitly re-confirmed after the pivot.
