# ZERO 2 HERO feature map

**Same mind. New skills. Bigger possibilities.**

ZERO 2 HERO is a progression platform for any real-world skill or goal. The Your Shot DJ competition is the current featured use case. It demonstrates the system without limiting the product to DJing.

## 1. Ways people enter

### Main ZERO 2 HERO entry

1. A visitor lands on the main ZERO 2 HERO page.
2. The page explains Journeys, Levels, Missions, Boss Missions, Proof of Work, XP, and the Hero outcome.
3. The visitor can start a new Journey, continue a saved Journey, or open a featured use case.
4. Example outcomes can include becoming a DJ, running a 5K, learning guitar, building a first app, or another user-defined goal.

### Your Shot DJ entry

1. A visitor follows the **DJ use case** link from the main product.
2. They see the Your Shot 30-day Journey, dated Missions, recording checkpoints, and performance-date choice.
3. They choose the October 24 or October 25 performance date.
4. ZERO 2 HERO calculates the lead-up period from September 22 and ends Challenge Day 30 on the selected performance date.
5. They can start or continue the Journey and enter the optional class portal.

### Another ZERO 2 HERO challenge

1. A visitor chooses **Start your Journey**.
2. They describe the skill or outcome, current starting point, intended Hero outcome, commitment, deadline, and available resources.
3. The system proposes five Levels and an attainable Mission path.
4. The user reviews and edits the proposed path before approving it.
5. The approved Journey opens on the dashboard with the next clear Mission.

## 2. Guest features

- Understand the product from the landing page without logging in.
- Review the featured DJ Journey as an example.
- Review a public Journey and its visible Proof of Work.
- Start a personal Journey without a wallet or AI key.
- Open the class-portal login and request an account.
- Read the positivity clause before joining the community.
- See RekordBridge as a clearly labeled future companion integration.

## 3. Signup, approval, and account security

### Member signup

1. The person enters a display name and unique username.
2. They accept the positivity clause.
3. Their request enters a pending state.
4. The Founder approves or declines the request.
5. An approved member receives the temporary password pattern `username0205`.

### First login

1. The member logs in with their username and temporary password.
2. Portal access remains blocked until they choose a new password.
3. They create and confirm a private 4–8 digit security PIN.
4. The temporary password is replaced and the account becomes security-ready.

### Password recovery

1. The member selects **Request a password reset**.
2. They enter their username and security PIN.
3. The portal automatically compares the PIN and records **PASS** or **FAIL**.
4. The Founder sees the result without needing to see the submitted PIN.
5. A failed request cannot be approved and can be denied.
6. An approved request resets the password to `username0205` and requires another password change at the next login.
7. The Founder can also trigger a manual reset from the member controls.

Production accounts require server-side authentication, password hashing, rate limits, recovery auditing, secure sessions, and hashed security PINs. Browser-local credentials are only for demonstrating the flow.

## 4. Member Journey experience

### Journey dashboard

- See the Hero outcome and active Journey.
- See overall completion percentage, current Level, XP, and Proof of Work count.
- See one clear next Mission.
- Review the full Journey path and locked, active, or cleared status.
- Open an appropriate tutorial search when a Mission includes a learning topic.
- Open the public Journey presentation.

### Mission completion

1. The user opens the active Mission.
2. They complete the real-world task.
3. They submit the required basic, photo, or video Proof of Work.
4. They can add a reflection about what changed or what they learned.
5. The Mission becomes cleared and Journey-specific XP is awarded.
6. The next Mission becomes active.

### Progression rules

- XP represents real progress within one Journey.
- Money and NIM cannot purchase XP or Levels.
- Boss Missions require stronger Proof of Work.
- Completing the final Boss Mission reaches the user-defined Hero outcome.
- The product remains useful without Nimiq, a wallet, or an AI API key.

## 5. Your Shot 30-day Journey

- September 22 lead-up Missions prepare the goal, equipment, schedule, and musical direction.
- The selected show date determines Challenge Day 1 and Challenge Day 30.
- Five Levels cover Foundations, Beatmatching, Phrasing and Preparation, Cleaner Mixing, and Performance.
- Daily Missions follow the researched Your Shot course sequence.
- Recording checkpoints appear on Days 7, 14, 21, 28, and 30.
- Day 29 covers final rehearsal, USB backup, cues, equipment, and show preparation.
- Day 30 is the Your Shot performance Boss Mission.
- Changing the selected performance date reschedules the Journey without erasing completed work.

## 6. DJ class companion

The class companion stays inside the DJ portal. It is an add-on to ZERO 2 HERO rather than a second application.

### Practice areas

- **Prepare:** load tracks and create useful memory and hot cues.
- **Listen:** use headphone cue, compare with the master, and count phrases.
- **Mix:** beatmatch with tempo and small jog nudges without Sync.
- **Perform:** complete a phrase-aware transition using faders and EQ.

### Practice tools

- Short 8–15 minute sessions.
- Visible countdown timer with start, pause, and continue controls.
- Clear task checklist for each practice.
- Per-member completion progress.
- Compact lesson coach for tempo, cueing, phrasing, and EQ questions.
- Controller setup walkthrough covering Play, Cue, Browse, Load, tempo, jog wheels, headphone cue, faders, EQ, and crossfader.

RekordBridge can later add verified controller mapping and live MIDI capture. Until a release is hosted by **avaedge617**, its download remains a clearly labeled placeholder.

## 7. Recording feed

### Uploading

- A member can upload a short phone recording or practice mix.
- They add a title and optional context or feedback request.
- The recording appears in the shared feed with browser playback.
- The local prototype accepts browser-supported audio and limits files to 3 MB.
- Production requires authenticated object storage, durable URLs, file validation, size limits, and moderation.

### Community feedback

- Approved members can like a recording.
- Approved members can leave public comments.
- Feedback should name something that worked, provide one useful suggestion, and encourage the next attempt.
- Basic hostile-language filtering reinforces the positivity clause.
- There are no private messages.

## 8. Public live chat

- One shared room supports practice questions, class check-ins, and show-day encouragement.
- Every message is public to approved portal members.
- The positivity clause applies to every message.
- Private messaging is intentionally excluded.
- The prototype stores messages in the current browser; production requires a realtime backend, member identity, moderation, reporting, retention rules, and abuse controls.

## 9. Founder controls

### Membership

- Review pending signup requests.
- Approve a request and assign the temporary password automatically.
- Decline a request.
- Review the approved-member roster.
- See which members must update a password and which are security-ready.
- Remove a member.

### Password recovery

- Review pending reset requests.
- See automatic security-PIN **PASS** or **FAIL** status.
- Approve only a passing request.
- Deny a failed or suspicious request.
- Manually reset an approved member to their default temporary password.

### Community management needed for production

- Remove inappropriate recordings, comments, and chat messages.
- Suspend or restore a member without destroying their Journey data.
- Review member reports and moderation history.
- Configure upload limits and accepted audio formats.
- Pin class announcements and show-day information.
- Export or delete member data when required.

These moderation controls describe the intended hosted product and are not all implemented in the browser-local prototype.

## 10. Public Journey and sharing

- A user can view their Journey as a public-facing progression story.
- The page shows their Hero outcome, progress, Mission path, and submitted Proof of Work.
- Sharing must preserve the user's choice about what is public.
- The current URL works only in the same browser because Journey data is local.
- Production sharing requires hosted identity, database persistence, authenticated media storage, visibility controls, and stable public URLs.

## 11. Optional Nimiq layer

- A member can connect a Nimiq account when running inside Nimiq Pay.
- NIM can represent an optional commitment or reward.
- The app must never fake a wallet connection or transaction.
- NIM cannot buy XP, Missions, Levels, or skill progress.
- Planned commitments can be displayed before real transfers exist.
- Real transfers require a funded and auditable backend, recipient rules, confirmation handling, transaction reconciliation, and abuse prevention.

## 12. Product boundary

### Competition submission

The competition MVP remains the generic ZERO 2 HERO vertical slice:

`landing → Journey creation → proposed path → approval → dashboard → Mission → Proof of Work → XP → Nimiq surface → public Journey`

### Current DJ use case

The Your Shot challenge, class companion, recording feed, member portal, and public chat demonstrate how ZERO 2 HERO can support one specific real-world community. They remain linked add-ons and do not redefine the core product.

### Future hosted release

A production launch needs secure hosted accounts, a database, durable audio and Proof of Work storage, realtime chat, moderation, public visibility controls, secure recovery, and deployment under the **avaedge617** GitHub account.
