# ZERO 2 HERO

GitHub repository: **[AvaEdge617/Zero2HeroMain](https://github.com/AvaEdge617/Zero2HeroMain)**. The local folder remains the working copy and pushes to the `main` branch.

The repository deploys the frontend to GitHub Pages whenever `main` is pushed. A Render web service and PostgreSQL database provide authentication through `render.yaml`. Local development continues to run from this folder with `pnpm dev` and `pnpm server`.

**Same mind. New skills. Bigger possibilities.**

ZERO 2 HERO turns a capability or outcome into a visible real-world progression path. A user establishes their **Zero**, defines their own **Hero**, reviews an attainable path, completes Missions, submits Proof of Work, and earns Journey-specific XP.

The product supports any real-world skill or goal. The Your Shot DJ Journey and companion portal are a linked use case based on the founder's current competition, not the definition or limit of ZERO 2 HERO.

This repository contains the competition MVP for the Nimiq Mini Apps Competition. It prioritizes one complete vertical slice over the full long-term product.

## Current MVP

- Mobile-first landing page that explains the product in under 60 seconds
- Conversational Journey creation covering starting point, Hero outcome, time, self-paced or target-deadline pacing, and resources
- Deterministic path planning that works without an AI key, with expandable Levels for complex and regulated Journeys
- A detailed regulated-service backlog that remains complete when self-paced; a deadline adds timing instead of removing work
- Free official and community learning resources are the first recommendation; paid tools or services are presented only when a free option cannot meet the Mission need
- Editable five-Level plan before Journey approval
- Initial Practice, Demonstrate, Create, and Boss Missions
- Photo, video, and basic Proof of Work flows
- Centralized proof/XP rules and Journey-specific progression
- Mission completion, XP, level, and progress visualization
- Shareable public Journey page
- Seed-friendly `ZERO → DJ` planning based on a real five-week live-performance goal
- Optional Your Shot DJ starter Journey beginning September 22, with lead-up Missions, 30 course-based daily Missions, an October 24/25 performance selector, recording checkpoints, and topic-specific tutorial searches
- Server-backed ZERO 2 HERO and Your Shot signups with separate Founder approval queues. Your Shot course, companion, recording feed, and chat require an approved server session.
- Passwords and security PINs are bcrypt-hashed in PostgreSQL. Login sessions use random, hashed server-side tokens delivered through Secure, HttpOnly cookies.
- Login rate limiting, strict input validation, origin checks, restricted CORS, Helmet security headers, generic reset responses, and server-authorized Founder actions.
- User-created passwords and security PINs at signup, Founder approval before access, PIN-checked reset requests, member removal, audio recording uploads, likes, comments, and one public live-chat room.
- The DJ Companion is contained inside the class portal with Prepare, Listen, Mix, and Perform practice cards, timers, a compact lesson coach, and a controller-setup checklist. It is an optional class add-on rather than a second ZERO 2 HERO application.
- The portal now explains the current CueCraft and RekordBridge private-beta capabilities. CueCraft owns the local two-deck learning, Set Planner, Transition Lab, guided practice, touch, and selected USB-controller workflows. RekordBridge owns Windows MIDI Learn, profiles, controller translation, and protected local pairing. ZERO 2 HERO continues to own Journeys, Missions, Proof of Work, and XP.
- Official `@nimiq/mini-app-sdk` connection and direct NIM transfer flow inside Nimiq Pay
- Honest disconnected-browser state and wallet-confirmed NIM reward history
- Local persistence through `localStorage`

## Architecture

- `src/App.tsx` — application screens and MVP interaction flow
- `src/lib/progression.ts` — deterministic planning, missions, XP, and progression rules
- `src/lib/store.ts` — replaceable local persistence adapter
- `src/lib/nimiq.ts` — isolated official Nimiq Mini App SDK adapter
- `src/types.ts` — Journey, Mission, Proof, XP, Wallet, Reward, and future Verification-ready types
- `src/styles.css` — responsive visual system

Progression, persistence, and Nimiq access are kept outside the UI so they can later move to an API/database without rewriting the product flow.

## Run locally

Requires Node.js 22+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Vite.

## Validate

```bash
pnpm test
pnpm lint
pnpm build
```

## Nimiq integration status

The app imports the official `@nimiq/mini-app-sdk`, initializes its provider, and requests accounts when **Connect wallet** is selected. That connection is expected to work when the app is loaded as a Mini App inside Nimiq Pay.

An ordinary browser receives an explicit unavailable message. The MVP never invents a wallet address, balance, transaction, or successful blockchain payment.

The reward flow requests a direct NIM transfer to a recipient explicitly entered by the user. Nimiq Pay presents the final transaction for wallet approval, and ZERO 2 HERO records the event only when the provider returns a serialized transaction reference. The transfer does not buy XP or unlock Levels. The optional `VITE_NIMIQ_REWARD_RECIPIENT` build variable can prefill a known recipient, but the value remains visible and editable for confirmation.

No secrets are required for the Nimiq flow. A physical Nimiq Pay test is still required before claiming that wallet connection and transfer work in production.

## Known limitations

- Journeys and proof metadata are stored only in the current browser, separated by authenticated account. Logging out hides them, but they do not yet follow the account to another device.
- Accounts, password hashes, sessions, approvals, and reset requests use the hosted PostgreSQL backend. Recordings, comments, likes, companion completion, and chat remain browser-local until durable authenticated storage is added.
- New applicants choose a strong password and private security PIN before submitting. The Founder can approve access without seeing either secret. Founder-approved resets use the temporary `username0205` format and force a password/PIN update at the next login. Seed account passwords come only from hosting secrets and are never stored in the frontend or repository.
- Local audio uploads are limited to 3 MB because the demo stores them in browser storage. CueCraft and RekordBridge are described as private Windows previews; no public download is shown until an approved release is hosted.
- CueCraft and RekordBridge do not silently share ZERO 2 HERO credentials, music, or progress. A learner explicitly chooses what practice evidence becomes Proof of Work.
- Uploaded files are represented by local filename metadata; production needs durable object storage and upload authorization.
- The 30-day challenge is a reusable starter plan based on the accessible Your Shot course outline and resource topics; it is not official course content or a replacement for the lessons. Recording files are not persisted by this MVP.
- Deterministic templates replace AI-generated planning for reliability and zero-key setup.
- Public Journey URLs require hosted persistence before they can reliably show a Journey on another device or to another account.
- Community verification, escrow, payouts, followers, backing, and messaging are future work.
- NIM rewards are direct, irreversible transfers rather than escrow. Refunds, conditional release, and backend reconciliation are outside this MVP.

## Competition readiness checklist

- [x] Core product value is clear from the landing screen
- [x] Journey creation → plan → approval → dashboard works
- [x] Mission → proof → XP progression works
- [x] Public Journey presentation works
- [x] Nimiq SDK wallet connection and direct-transfer request are implemented
- [x] Public repository includes the required MIT license
- [x] Mobile and desktop layouts are responsive
- [x] Tests, lint, and production build are available
- [x] Deploy to HTTPS hosting
- [ ] Register/open the domain as a Nimiq Pay Mini App
- [ ] Validate `listAccounts` on physical iOS/Android Nimiq Pay
- [x] Implement a direct, user-confirmed NIM reward transfer without coupling money to XP
- [ ] Add hosted persistence and proof storage
- [ ] Recruit at least 25 legitimate wallet users and collect feedback
- [ ] Record submission demo media and publish promotion links

## Recommended Phase 2

1. Add hosted identity, database persistence, and file storage.
2. Complete the real NIM commitment/reward flow with auditable transaction records.
3. Add independent Proof verification with hidden votes and anti-farming rules.
4. Replace or supplement deterministic planning with an AI planning adapter.
5. Add follow/back mechanics around public Journeys.

The full product vocabulary and scope rules live in [AGENTS.md](AGENTS.md).
