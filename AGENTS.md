# Zero 2 Hero engineering instructions

The official user-facing product name is always **ZERO 2 HERO**. Treat “02,” “Z2H,” and similar forms as conversational shorthand only. Do not publish “Zero to Hero,” “0→H,” or another variant as the brand name.

## Product truth

Zero 2 Hero is a real-world skill and goal progression platform. It is not specifically a DJ app, ADHD app, habit tracker, crypto app, or AI business app.

Use these terms consistently: **Journey**, **Level**, **Mission**, **Boss Mission**, **Proof of Work**, **XP**, and **Hero**.

- XP is non-monetary, Journey-specific progression.
- NIM is an optional economic commitment/reward layer.
- Money must never purchase XP or skill levels.
- A user defines their own Hero outcome.
- The product must remain useful without a wallet or AI API key.

## Current scope

Protect the competition MVP vertical slice:

`landing → Journey creation → proposed path → approval → dashboard → Mission → proof → XP → Nimiq surface → public Journey`

Do not add messaging, a verification marketplace, house betting, subscriptions, native mobile apps, RekordBridge features, Lucid Sync internal architecture, or a large achievement system unless a later user request explicitly expands scope.

## Architecture rules

- Keep progression logic, proof logic, persistence, Nimiq integration, and UI separate.
- Keep XP values centralized and configurable.
- Do not couple planning to the DJ example.
- Never fake successful wallet connections or blockchain transactions.
- Treat uploads as untrusted and move files to durable authenticated storage before production.
- Prefer a complete, tested core flow over more screens.

## Visual language

Use a dark near-black foundation with restrained cyan, blue, purple, and magenta accents. Keep it premium, readable, energetic, and mobile-first. Avoid casino imagery, crypto-bro styling, childish game UI, and overloaded cyberpunk dashboards.

Brand statements:

- **Same mind. New skills. Bigger possibilities.**
- **Real skills. Real progress. Proof of work.**

## Required checks

Run `pnpm test`, `pnpm lint`, and `pnpm build` after material changes. Update README limitations whenever real external integration is incomplete.
