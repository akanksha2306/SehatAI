# SehatAI — External Services

A running log of external accounts/services connected to this project, so it's clear what's live where.

- **Neon** (Postgres database) — connected 2026-08-22, used for the app's database via Prisma.
- ~~**Resend** (email service) — connected 2026-08-22~~ — removed 2026-08-25, replaced by Brevo. Sandbox sender could only deliver to the account's own email without a verified domain; never worked for real users.
- **Brevo** (email service) — connected 2026-08-25, sends the sign-in verification code. Sender `kanjoliaakanksha@gmail.com`, verified as a single sender (no domain owned yet — DKIM/DMARC show warnings, deliverability to Gmail/Yahoo/Outlook isn't guaranteed until a real domain is added).
- **Mixpanel** (product analytics) — connected 2026-08-24, free tier, EU data residency (`api-eu.mixpanel.com`). Client-side only, token set locally and on Render.
