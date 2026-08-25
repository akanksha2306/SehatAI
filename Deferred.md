# SehatAI — Deferred Items

## 🚨 MUST remove before shipping (security-relevant)
- [ ] **Auth bypass for a fixed list of emails** — `POST /api/auth/magic-link` returns a real signed-in JWT directly in the response for any email in the hardcoded `DEV_BYPASS_EMAILS` set (`kanjoliaakanksha@gmail.com`, `akankshakanjolia@gmail.com`, and growing as needed for testers), skipping the email/code round-trip entirely. Originally added because Resend couldn't reach real recipients (see below, now moot — Brevo can) but kept for zero-friction testing convenience. Marked with `🚨 DEV-ONLY BYPASS` comments in `backend/src/controllers/AuthController.ts` and `frontend/src/lib/api-client.ts` — remove the `DEV_BYPASS_EMAILS` block and the `token`/`user` bypass fields before shipping.
- [x] ~~Real fix: verify a sending domain in Resend~~ — superseded 2026-08-25: switched email providers to Brevo instead (single verified sender, no domain needed, works today). New follow-up below.
- [ ] **Brevo sender is an unverified-domain freemail address** (`kanjoliaakanksha@gmail.com`) — DKIM shows "Default" (not domain-authenticated) and DMARC warns "freemail domain is not recommended." Works for now, but Gmail/Yahoo/Outlook's bulk-sender rules may still spam-filter or block it at real volume. Real fix: buy a domain (e.g. `sehatai.com`), add the DKIM/DMARC DNS records Brevo provides, send from `noreply@sehatai.com` instead.
- [x] ~~Pre-filled sign-in email~~ — resolved 2026-08-24, `DEV_PREFILLED_EMAIL` removed entirely (was also visible on the public deployed site, not just a dev convenience).
- [x] ~~Magic-link click-through~~ — resolved 2026-08-25, replaced with a 6-digit code. Single-use link tokens were being silently consumed by email clients' link-prescanning before the user clicked, making delivery look broken non-deterministically.

## Content scope (deliberately shrunk for the demo)
- [x] ~~Hall of Hallucinations capped to 2 chapters~~ — resolved 2026-08-24, now unlocked to all 10.
- [ ] **Prompt Lab still capped to 2 of its 7 chapters** — and the new experimental `promptlab_dummy` track (2026-08-25, 5 chapters seeded) inherited the same cap. Governed by `getChapterLimit()` in `backend/src/services/CourseService.ts` (Hall returns 10, everything else returns 2). All chapters still exist untouched in the database — nothing was deleted. To unlock, change what `getChapterLimit()` returns per track (or remove the function and its call sites entirely to uncap everything).

## Cosmetic / non-blocking
Small/cosmetic items and non-blocking fixes, parked so they don't derail focus on major features. Revisit after the core feature set is built.

- [ ] Sign-in screen: the word "SehatAI" in the subtitle ("SehatAI coaches clinicians...") should render bigger/more emphasized — currently same size as the rest of the sentence.
