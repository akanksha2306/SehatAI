# SehatAI — Deferred Items

## 🚨 MUST remove before shipping (security-relevant)
- [ ] **Auth bypass for `kanjoliaakanksha@gmail.com`** — `POST /api/auth/magic-link` returns a real signed-in JWT directly in the response for this one exact email, skipping the email/click-through entirely. Added for testing convenience. Marked with `🚨 DEV-ONLY BYPASS` comments in `backend/src/controllers/AuthController.ts` and `frontend/src/lib/api-client.ts` / `sign-in.tsx` — remove the `DEV_BYPASS_EMAIL` block and the `token`/`user` bypass fields before shipping.
- [ ] **Pre-filled sign-in email** — `sign-in.tsx`'s `DEV_PREFILLED_EMAIL` constant. Lower risk than the bypass above, but should go too.

## Content scope (deliberately shrunk for the demo)
- [ ] **Restore full chapter count.** Both tracks are capped to 2 chapters each for demo purposes via `DEMO_CHAPTER_LIMIT = 2` in `backend/src/services/CourseService.ts`. All 17 chapters (7 Prompt Lab + 10 Hall of Hallucinations) still exist untouched in the database — nothing was deleted. To restore full access, delete the `DEMO_CHAPTER_LIMIT` constant and its 3 usages in that file.

## Cosmetic / non-blocking
Small/cosmetic items and non-blocking fixes, parked so they don't derail focus on major features. Revisit after the core feature set is built.

- [ ] Sign-in screen: the word "SehatAI" in the subtitle ("SehatAI coaches clinicians...") should render bigger/more emphasized — currently same size as the rest of the sentence.
