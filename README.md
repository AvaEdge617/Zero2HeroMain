# Zero 2 Hero

GitHub owner for this project: **avaedge617**. The local workspace is prepared for that account, but no GitHub remote has been created or guessed.

**Same mind. New skills. Bigger possibilities.**

Zero 2 Hero turns a capability or outcome into a visible real-world progression path. A user establishes their **Zero**, defines their own **Hero**, reviews an attainable path, completes Missions, submits Proof of Work, and earns Journey-specific XP.

This repository contains the competition MVP for the Nimiq Mini Apps Competition. It prioritizes one complete vertical slice over the full long-term product.

## Current MVP

- Mobile-first landing page that explains the product in under 60 seconds
- Conversational Journey creation covering starting point, Hero outcome, time, deadline, and resources
- Deterministic path planning that works without an AI key
- Editable five-Level plan before Journey approval
- Initial Practice, Demonstrate, Create, and Boss Missions
- Photo, video, and basic Proof of Work flows
- Centralized proof/XP rules and Journey-specific progression
- Mission completion, XP, level, and progress visualization
- Shareable public Journey page
- Seed-friendly `ZERO → DJ` planning based on a real five-week live-performance goal
- Optional Your Shot DJ starter Journey beginning September 22, with lead-up Missions, 30 course-based daily Missions, an October 24/25 performance selector, recording checkpoints, and topic-specific tutorial searches
- Local DJ portal demo with seeded Founder/User accounts, Founder-approved signups, forced first-login password/PIN setup, PIN-checked reset requests, member removal, audio recording uploads, likes, comments, and one public live-chat room
- The DJ Companion is contained inside the class portal with Prepare, Listen, Mix, and Perform practice cards, timers, a compact lesson coach, and a controller-setup checklist. It is an optional class add-on rather than a second Zero 2 Hero application.
- Official `@nimiq/mini-app-sdk` boundary for account connection inside Nimiq Pay
- Honest disconnected-browser state and planned NIM commitment history
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

The UI can save a **planned NIM commitment**, but it deliberately does not send NIM yet: a production escrow/reward recipient and resolution policy have not been configured. Before enabling transactions, configure an appropriate recipient/contract strategy, add backend reconciliation, test the wallet confirmation flow in Nimiq Pay, and persist transaction hashes server-side.

No environment variables or secrets are required for this MVP.

## Known limitations

- Journeys and proof metadata are stored only in the current browser.
- DJ portal accounts, passwords, approvals, recordings, comments, likes, and chat are local demo data. Production requires authenticated hosted accounts, password hashing, moderation controls, database storage, realtime delivery, and durable audio storage.
- Demo temporary passwords follow `username0205`. Passwords and PINs are intentionally browser-local prototype data; do not reuse real credentials until a secure backend and password hashing are implemented.
- Local audio uploads are limited to 3 MB because the demo stores them in browser storage. RekordBridge currently points to a clearly labeled placeholder until its file is hosted.
- Uploaded files are represented by local filename metadata; production needs durable object storage and upload authorization.
- The 30-day challenge is a reusable starter plan based on the accessible Your Shot course outline and resource topics; it is not official course content or a replacement for the lessons. Recording files are not persisted by this MVP.
- Deterministic templates replace AI-generated planning for reliability and zero-key setup.
- Public Journey URLs are shareable on the same browser but require hosted persistence for cross-device viewing.
- Community verification, escrow, payouts, followers, backing, and messaging are future work.
- A real NIM transfer is intentionally disabled until its recipient and resolution rules are configured.

## Competition readiness checklist

- [x] Core product value is clear from the landing screen
- [x] Journey creation → plan → approval → dashboard works
- [x] Mission → proof → XP progression works
- [x] Public Journey presentation works
- [x] Nimiq SDK integration boundary is present and honest
- [x] Mobile and desktop layouts are responsive
- [x] Tests, lint, and production build are available
- [ ] Deploy to HTTPS hosting
- [ ] Register/open the domain as a Nimiq Pay Mini App
- [ ] Validate `listAccounts` on physical iOS/Android Nimiq Pay
- [ ] Choose and implement the competition-safe NIM transfer/reward recipient flow
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
