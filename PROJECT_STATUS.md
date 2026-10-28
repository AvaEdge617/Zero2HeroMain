# ZERO 2 HERO project status

Last updated: October 28, 2026

## DONE

- Competition MVP Journey flow is implemented and published through GitHub Pages.
- Nimiq Mini App SDK is integrated for wallet-approved direct NIM transfers.
- Account data, password hashes, approval state, sessions, and reset requests use a server API and PostgreSQL.
- Signup now asks the applicant to create a strong password and private security PIN. The Founder approves access without seeing either secret.
- Older pending accounts remain compatible with the temporary-password first-login flow.
- Required checks pass: 19 tests, lint, and production build.

## NEXT

1. Point the free Render web service at the durable Supabase PostgreSQL project.
2. Verify the live health endpoint and cross-site secure session cookie.
3. Run the production signup, pending lockout, Founder approval, login, logout, and reset walkthrough.
4. Complete one real Nimiq Pay test transaction and save the transaction reference as competition evidence.
5. Submit the registered mini app through the official competition dashboard before the Cycle III deadline.

## BLOCKED

- The public Render API does not currently answer its health endpoint. Render's free PostgreSQL databases expire after 30 days, and the existing database reached that age around October 28.
- Render account inspection is blocked until its Codex connector is reauthenticated or the service is inspected in the Render dashboard.

## NEEDS YOU

- Keep the Supabase database password private. Enter the Supabase pooled PostgreSQL connection string as `DATABASE_URL` in the Render service when prompted.
- Reconnect the Render integration in Codex if you want automated service, deploy, and log checks from this project chat.
- Approve the final production test account in the Founder dashboard when the backend is healthy.

## Reporting format

Future project-lead reports will use **DONE / NEXT / BLOCKED / NEEDS YOU** and will separate automated software checks from real wallet, hosted-service, browser, and hardware verification.
