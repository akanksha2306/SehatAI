# SehatAI — Deferred Items

## 🚨 MUST remove before shipping (security-relevant)
- [ ] **Auth bypass for a fixed list of emails** — `POST /api/auth/magic-link` returns a real signed-in JWT directly in the response for any email in the hardcoded `DEV_BYPASS_EMAILS` set (`kanjoliaakanksha@gmail.com`, `akankshakanjolia@gmail.com`, and growing as needed for testers), skipping the email/click-through entirely. Root cause: no verified Resend sending domain, so real magic-link email only reaches the Resend account's own address — this bypass is the workaround until that's fixed properly (see item below). Marked with `🚨 DEV-ONLY BYPASS` comments in `backend/src/controllers/AuthController.ts` and `frontend/src/lib/api-client.ts` — remove the `DEV_BYPASS_EMAILS` block and the `token`/`user` bypass fields before shipping.
- [ ] **Real fix for the above: verify a sending domain in Resend.** Needs Akanksha to own a domain and add DNS records — once done, magic-link email works for anyone, and the bypass list above can be deleted entirely instead of just not-yet-removed.
- [x] ~~Pre-filled sign-in email~~ — resolved 2026-08-24, `DEV_PREFILLED_EMAIL` removed entirely (was also visible on the public deployed site, not just a dev convenience).

## Content scope (deliberately shrunk for the demo)
- [x] ~~Hall of Hallucinations capped to 2 chapters~~ — resolved 2026-08-24, now unlocked to all 10.
- [ ] **Prompt Lab still capped to 2 of its 7 chapters.** Governed by `getChapterLimit()` in `backend/src/services/CourseService.ts` (Hall returns 10, Prompt Lab returns 2). All 7 Prompt Lab chapters still exist untouched in the database — nothing was deleted. To unlock, change what `getChapterLimit()` returns for the `prompt` track (or remove the function and its 3 call sites entirely to uncap both tracks).

## Cosmetic / non-blocking
Small/cosmetic items and non-blocking fixes, parked so they don't derail focus on major features. Revisit after the core feature set is built.

- [ ] Sign-in screen: the word "SehatAI" in the subtitle ("SehatAI coaches clinicians...") should render bigger/more emphasized — currently same size as the rest of the sentence.
