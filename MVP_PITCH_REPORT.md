# ZERO 2 HERO — MVP Pitch Report

## The short pitch

**ZERO 2 HERO turns a real-world goal into a clear path of action, evidence, and visible progress.**

Most people do not fail because they have no ambition. They fail because the distance between where they are and where they want to be feels too large. Advice, courses, and goal trackers can tell someone what to learn, but they rarely connect learning to proof that the person can actually do it.

ZERO 2 HERO closes that gap. A person defines their starting point—their **Zero—and the outcome they want to reach—their Hero**. The platform proposes a Journey made of Levels and Missions. The user reviews the plan, completes real-world Missions, submits Proof of Work, and earns Journey-specific XP as evidence of progress.

**Same mind. New skills. Bigger possibilities.**

## The problem

People often know what they want but do not know what to do next. Large goals become scattered across videos, notes, courses, calendars, and unfinished checklists. Progress is usually measured by attendance, time spent, or boxes checked rather than demonstrated ability.

This creates four common problems:

- The goal is too broad to begin confidently.
- The next useful action is unclear.
- Learning and real-world practice become disconnected.
- Progress is difficult to see, prove, or share.

Existing habit trackers can record repetition. Course platforms can deliver lessons. Project-management tools can organize tasks. ZERO 2 HERO focuses on the missing connection between a personal outcome, an attainable progression path, and real Proof of Work.

## The MVP solution

The MVP tests one central idea:

> People are more likely to move toward a difficult real-world outcome when the path is broken into achievable Missions and progress requires evidence of action.

The complete MVP loop is:

`landing → Journey creation → proposed path → approval → dashboard → Mission → Proof of Work → XP → Nimiq surface → public Journey`

### 1. Define the Journey

The user describes:

- Where they are starting—their **Zero**.
- What they want to be able to do—their **Hero** outcome.
- The time and resources they have available.
- Whether they are working at their own pace or toward a deadline.

### 2. Review the proposed path

ZERO 2 HERO turns that information into an editable set of Levels with practical Missions and Boss Missions. The plan is proposed rather than imposed: the user can review and approve it before beginning.

### 3. Take one clear next action

The dashboard shows the full Journey while keeping the immediate focus on one active Mission. This reduces the pressure of the larger goal without hiding where the person is going.

### 4. Submit Proof of Work

Completing a Mission requires appropriate evidence, such as a written reflection, photo, or video. Boss Missions require stronger evidence because they represent meaningful demonstrations of skill.

### 5. Earn visible progress

Accepted Proof of Work clears the Mission and awards Journey-specific XP. XP represents demonstrated progress within that Journey. It cannot be purchased and has no monetary value.

### 6. Share the story

The public Journey presents the Hero outcome, completed Missions, progress, and chosen Proof of Work as a progression story rather than a simple completion badge.

## Why this is an MVP

This version is deliberately narrow. It is large enough to test the full value proposition and small enough to build, demonstrate, and evaluate as one coherent product.

The MVP answers these questions:

1. Can a first-time visitor understand the product quickly?
2. Can a user turn a broad goal into an understandable Journey?
3. Does one clear Mission make it easier to begin?
4. Does requiring Proof of Work produce more meaningful progress than checking a box?
5. Does visible XP and a public Journey make progress easier to understand and sustain?

Features such as private messaging, subscriptions, a verification marketplace, large achievement systems, native mobile apps, and advanced community tools are outside this test. They would add complexity without proving the core idea.

## The first real use case

The featured use case is a **Your Shot DJ Journey** built around preparation for a live performance. It includes foundational practice, beatmatching, phrasing, transition work, recording checkpoints, rehearsal, and a final performance Boss Mission.

This is a strong MVP example because the goal has:

- A clear starting point.
- Skills that can be practiced in stages.
- Evidence that can be recorded.
- A real deadline.
- A final performance that demonstrates the outcome.

The DJ Journey proves how the system can work, but it does not define the platform. The same structure can support learning guitar, running a first 5K, building an application, preparing for employment, starting a business, or pursuing another user-defined Hero outcome.

## What makes ZERO 2 HERO different

### The user defines Hero

Success is based on the outcome the person chooses. The platform provides structure without deciding what achievement must mean for everyone.

### Progress requires action

ZERO 2 HERO connects planning to work completed in the real world. Proof of Work makes progress inspectable and gives the user something concrete to reflect on.

### Planning works without an AI subscription

The MVP includes deterministic planning, so the core experience does not depend on an AI API key. AI can improve planning later without becoming a requirement for using the product.

### The product works without a wallet

Nimiq is an optional commitment and reward layer. A user can create and complete a Journey without connecting a wallet. Money and NIM can never purchase XP, Missions, Levels, or skill.

### The system can grow across many goals

Journeys use shared progression rules while allowing the Missions and Proof of Work to fit the actual outcome. This gives ZERO 2 HERO a reusable foundation instead of locking it to one course or industry.

## Nimiq’s role

Nimiq can add an optional economic commitment or reward to a Journey. For example, a user may choose to place value behind completing a goal, or a sponsor may reward verified progress.

The MVP keeps that layer honest:

- NIM remains separate from XP.
- Wallet access uses the official Nimiq Mini App boundary.
- A normal browser clearly reports when Nimiq Pay is unavailable.
- The application never invents an address, balance, transfer, or successful transaction.
- Direct NIM rewards require explicit recipient confirmation in Nimiq Pay. Escrow, conditional release, refunds, and backend reconciliation remain outside the MVP.

This demonstrates a credible integration path without pretending that unfinished financial infrastructure is complete.

## Who the MVP is for

The first users are people who have a meaningful goal but need help turning it into a practical sequence of actions. They may be learning independently, following a course, preparing for an event, or trying to show what they can do.

The longer-term customer and partner possibilities include:

- Individual learners and creators.
- Coaches and instructors.
- Cohort and challenge communities.
- Workforce and skill-development programs.
- Organizations that want progress demonstrated through real outcomes.

The MVP begins with the individual Journey because every larger model depends on that experience being useful.

## Demonstration walkthrough

A competition demonstration should show one uninterrupted story:

1. Open the landing page and explain ZERO 2 HERO in one sentence.
2. Enter a starting point and a specific Hero outcome.
3. Add available time, resources, and a target deadline.
4. Review the proposed Journey and its Levels.
5. Edit or approve the path.
6. Open the dashboard and identify the active Mission.
7. Complete the Mission and submit Proof of Work.
8. Show the Mission clearing and XP increasing.
9. Open the optional Nimiq surface and explain its honest availability state.
10. Open the public Journey and show the progress story.
11. Briefly show the Your Shot DJ Journey as proof that the structure supports a real deadline and real performance.

The demonstration should prioritize this completed loop over a tour of every screen.

## How the MVP will be measured

The first release should collect a small set of meaningful signals:

- Percentage of visitors who begin Journey creation.
- Percentage who approve a proposed Journey.
- Percentage who open their first Mission.
- Percentage who submit their first Proof of Work.
- Time from Journey approval to first completed Mission.
- Number of users who complete a Boss Mission.
- User feedback on whether the next action was clear.
- User feedback on whether Proof of Work made progress feel more real.

The most important early measure is the number of users who move from intention to a first verified action.

## Current product state

The prototype already establishes the intended core experience: Journey creation, editable planning, Mission progression, Proof of Work, XP, public Journey presentation, and an isolated Nimiq integration boundary. It also includes the DJ Journey as a detailed example.

Some infrastructure remains incomplete and must be described accurately during the pitch:

- Journey and proof metadata are currently stored in the user’s browser.
- Stable cross-device public sharing requires hosted persistence.
- Uploaded Proof of Work needs durable, authenticated object storage for production.
- Nimiq Pay still requires physical mobile validation.
- The direct NIM reward request is implemented, but it still needs physical Nimiq Pay validation and durable transaction reconciliation.
- Submission media and legitimate external-user feedback still need to be completed.

These limitations do not prevent the MVP from demonstrating the core loop. They define the work required to move from a competition prototype to a dependable hosted product.

## After the MVP

If the core behavior is validated, the next phase is:

1. Add hosted Journey, Mission, and Proof of Work persistence.
2. Add durable authenticated media storage and visibility controls.
3. Validate the direct NIM reward flow in Nimiq Pay and add durable transaction reconciliation.
4. Test the product with legitimate users across several types of Journeys.
5. Add optional planning intelligence without making an AI key mandatory.
6. Add verification and community features only when the usage evidence supports them.

## The ask

The immediate goal is to test ZERO 2 HERO with people pursuing real outcomes and learn whether its Mission-and-proof structure helps them begin, continue, and demonstrate progress.

For a competition audience, the ask is straightforward:

- Evaluate the complete working progression loop.
- Consider the DJ Journey as one real example of a broader platform.
- Judge the Nimiq layer by its practical role and honest implementation boundary.
- Support the next stage of hosted persistence, real-user testing, and production-ready wallet integration.

## Closing statement

ZERO 2 HERO is built around a simple belief: a person should be able to see a path from where they are to what they want to become—and every step should represent something they actually did.

**Real skills. Real progress. Proof of work.**
