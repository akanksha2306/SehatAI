# SehatAI — Auth & Onboarding Wizard: Grill / Discovery Notes
Date: 2026-08-22 · Goal: Pin down the open decisions in `features.md` Feature 1 (Auth & user accounts) and Feature 2 (Onboarding wizard) before Phase 1/2 of `plan.md` starts.

## Summary / key decisions
- **Auth method: magic link.** Passwordless email link, no password storage/reset flow. Real institutional/hospital SSO explicitly deferred until an actual enterprise customer requires it.
- Remaining sub-decisions (session/JWT expiry length, refresh tokens, domain/license verification) not yet drilled into — defaulted for the first build rather than blocking on them, since the user wants to move to implementation. Revisit if they turn out to matter.

## Q&A log

### Q1 — Auth method
- Asked: Magic link vs. password vs. real institutional SSO?
- Captured: "Yes please build the magic link" — confirmed as recommended.
- Flags: none

## Open flags (pending input)
- Session/JWT expiry + refresh-token design -> not yet drilled into, defaulted for v1
- Magic-link email delivery for local dev (real email provider vs. console-logged link) -> defaulting to console-logged link for dev, flagged to user separately in-thread
