import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { defaultPassword, isPositiveEnough, loadPortalState, POSITIVITY_CLAUSE, savePortalState, type AudioPost, type PasswordResetRequest, type PortalAccount, type PortalState } from './lib/portal'
import { authApi } from './lib/authApi'

type PortalPage = 'companion' | 'feed' | 'chat' | 'members'

export default function Portal({ back, openCourse }: { back: () => void; openCourse: () => void }) {
  const [state, setState] = useState<PortalState>(() => loadPortalState())
  const [accountId, setAccountId] = useState<string | null>(null)
  const [page, setPage] = useState<PortalPage>('companion')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(true)
  const account = state.accounts.find((item) => item.id === accountId)
  useEffect(() => savePortalState(state), [state])
  useEffect(() => { authApi.session().then(({ account: sessionAccount }) => { if (sessionAccount && (sessionAccount.role === 'founder' || sessionAccount.program === 'your-shot')) { setState((current) => ({ ...current, accounts: [sessionAccount] })); setAccountId(sessionAccount.id) } }).finally(() => setLoading(false)) }, [])
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 2800); return () => clearTimeout(timer) }, [notice])

  const login = (next: PortalAccount) => { setState((current) => ({ ...current, accounts: [next] })); setAccountId(next.id) }
  const logout = async () => { await authApi.logout().catch(() => undefined); setAccountId(null); setState((current) => ({ ...current, accounts: [] })) }
  if (loading) return <section className="security-setup"><p>Checking secure access…</p></section>
  if (!account) return <PortalLogin login={login} back={back} />
  if (account.mustChangePassword) return <FirstLoginSetup account={account} finish={async (password, pin) => { await authApi.finishFirstLogin(password, pin); setState({ ...state, accounts: state.accounts.map((item) => item.id === account.id ? { ...item, mustChangePassword: false } : item) }) }} logout={logout} />
  return <section className="portal-shell">
    <header className="portal-head"><button className="portal-wordmark" onClick={back}><span>ZERO 2 HERO</span><b>YOUR SHOT PORTAL</b></button><nav><button onClick={openCourse}>30-day course</button><button className={page === 'companion' ? 'active' : ''} onClick={() => setPage('companion')}>Class companion</button><button className={page === 'feed' ? 'active' : ''} onClick={() => setPage('feed')}>Recording feed</button><button className={page === 'chat' ? 'active' : ''} onClick={() => setPage('chat')}>Live chat</button>{account.role === 'founder' && <button className={page === 'members' ? 'active' : ''} onClick={() => setPage('members')}>Founder</button>}</nav><div className="portal-profile"><span>{account.displayName.slice(0, 2).toUpperCase()}</span><div><b>{account.displayName}</b><small>{account.role}</small></div><button onClick={logout}>Log out</button></div></header>
    <main className="portal-main">
      {page === 'companion' && <ClassCompanion account={account} state={state} setState={setState} notify={setNotice} />}
      {page === 'feed' && <RecordingFeed state={state} setState={setState} account={account} notify={setNotice} />}
      {page === 'chat' && <LiveChat state={state} setState={setState} account={account} notify={setNotice} />}
      {page === 'members' && account.role === 'founder' && <MemberApprovals currentAccount={account} />}
    </main>
    {notice && <div className="toast">{notice}</div>}
  </section>
}

function PortalLogin({ login, back }: { login: (account: PortalAccount) => void; back: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [pin, setPin] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [message, setMessage] = useState('')
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setMessage('')
    try {
      if (mode === 'login') { const result = await authApi.login(username, password, 'your-shot'); login(result.account); return }
      if (mode === 'reset') { const result = await authApi.requestReset(username, pin, 'your-shot'); setMode('login'); setPin(''); setMessage(result.message); return }
      if (!agreed) { setMessage('Agree to the positivity clause to request access.'); return }
      await authApi.signup(displayName.trim() || username.trim(), username, 'your-shot', true); setMode('login'); setPassword(''); setMessage('Signup sent. A Founder must approve it before you can log in.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'The request failed.') }
  }
  return <section className="portal-login"><button className="back-link" onClick={back}>← Back to ZERO 2 HERO</button><div className="portal-login-grid"><div className="portal-login-story"><span className="portal-chip">YOUR SHOT · ZERO 2 HERO</span><h1>Practice in public.<br /><em>Grow together.</em></h1><p>The link is public. The course, companion, recordings, and chat open only after a Founder approves a Your Shot account.</p><div className="positive-card"><b>THE POSITIVITY CLAUSE</b><p>{POSITIVITY_CLAUSE}</p></div><div className="rekord-card"><span>COMING SOON</span><h3>RekordBridge</h3><p>A future bridge for sharing prepared DJ library data and set workflows. The download link is a placeholder until the file is hosted.</p><button onClick={() => setMessage('RekordBridge download is coming soon. This is the temporary placeholder.')}>RekordBridge placeholder ↗</button></div></div><form className="portal-login-card" onSubmit={submit}><small>YOUR SHOT PORTAL</small><h2>{mode === 'login' ? 'Approved members.' : mode === 'signup' ? 'Request Your Shot access.' : 'Request a password reset.'}</h2>{mode === 'signup' && <label><span>Display name</span><input required value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label>}<label><span>Username</span><input required value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" /></label>{mode === 'login' && <label><span>Password</span><input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>}{mode === 'reset' && <label><span>Security PIN</span><input required inputMode="numeric" pattern="[0-9]{4,8}" type="password" value={pin} onChange={(event) => setPin(event.target.value)} placeholder="4–8 digits" /></label>}{mode === 'signup' && <><p className="default-password-note">After approval, your temporary password will be <b>{username || 'username'}0205</b>. You must replace it and create a security PIN at first login.</p><label className="agreement"><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} /><span>I agree to the positivity clause.</span></label></>}{message && <p className="form-message">{message}</p>}<button className="primary full" type="submit">{mode === 'login' ? 'Log in' : mode === 'signup' ? 'Send Your Shot request' : 'Send reset request'}</button><button className="text-button" type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage('') }}>{mode === 'login' ? 'Request Your Shot access' : 'Back to login'}</button>{mode === 'login' && <button className="text-button" type="button" onClick={() => { setMode('reset'); setMessage('') }}>Forgot password? Request a reset</button>}</form></div></section>
}

export function FirstLoginSetup({ account, finish, logout }: { account: PortalAccount; finish: (password: string, pin: string) => Promise<void>; logout: () => void | Promise<void> }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pin, setPin] = useState('')
  const [pinConfirm, setPinConfirm] = useState('')
  const [message, setMessage] = useState('')
  const submit = async (event: FormEvent) => { event.preventDefault(); if (password.length < 12 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) { setMessage('Use 12+ characters with uppercase, lowercase, and a number.'); return }; if (password === defaultPassword(account.username)) { setMessage('Choose a password different from the temporary password.'); return }; if (password !== confirm) { setMessage('The passwords do not match.'); return }; if (!/^\d{4,8}$/.test(pin) || pin !== pinConfirm) { setMessage('Create a matching 4–8 digit security PIN.'); return }; try { await finish(password, pin) } catch (error) { setMessage(error instanceof Error ? error.message : 'Security setup failed.') } }
  return <section className="security-setup"><form className="portal-login-card" onSubmit={submit}><small>FIRST LOGIN SECURITY</small><h2>Protect your account.</h2><p>Your temporary password worked. Create a private password and PIN before entering the portal.</p><label><span>New password</span><input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label><label><span>Confirm password</span><input type="password" required value={confirm} onChange={(event) => setConfirm(event.target.value)} /></label><label><span>Security PIN</span><input type="password" inputMode="numeric" pattern="[0-9]{4,8}" required value={pin} onChange={(event) => setPin(event.target.value)} /></label><label><span>Confirm PIN</span><input type="password" inputMode="numeric" pattern="[0-9]{4,8}" required value={pinConfirm} onChange={(event) => setPinConfirm(event.target.value)} /></label><p className="security-note">Your PIN checks future reset requests. The Founder sees only PASS or FAIL.</p>{message && <p className="form-message">{message}</p>}<button className="primary full">Save security and enter</button><button type="button" className="text-button" onClick={logout}>Log out</button></form></section>
}

const companionLessons = [
  { id: 'prepare', label: 'PREPARE', minutes: 8, title: 'Set up your next mix', description: 'Choose two tracks, set useful cues, and know where the transition should happen.', tasks: ['Load one track on each deck.', 'Set a memory cue at the start of both tracks.', 'Set a hot cue at a vocal or energy change.'] },
  { id: 'listen', label: 'LISTEN', minutes: 10, title: 'Cue the incoming track', description: 'Hear the next track privately and recognize the phrase before the room does.', tasks: ['Cue the incoming deck in your headphones.', 'Compare headphone cue with the master.', 'Count an 8-bar phrase in both tracks.'] },
  { id: 'mix', label: 'MIX', minutes: 12, title: 'Beatmatch without Sync', description: 'Use tempo and small jog nudges to hold two tracks together by ear.', tasks: ['Start the outgoing track and count a phrase.', 'Cue the incoming track on the downbeat.', 'Adjust tempo until the beats stop drifting.', 'Use a gentle nudge for the final correction.'] },
  { id: 'perform', label: 'PERFORM', minutes: 15, title: 'Make a clean transition', description: 'Bring the next song in with timing, EQ, and deliberate energy.', tasks: ['Start on the first beat of a phrase.', 'Bring in the channel smoothly.', 'Trade the LOW EQ between tracks.', 'Finish the transition and listen back.'] },
] as const

function ClassCompanion({ account, state, setState, notify }: { account: PortalAccount; state: PortalState; setState: (state: PortalState) => void; notify: (value: string) => void }) {
  const [lessonId, setLessonId] = useState<string | null>(null)
  const [remaining, setRemaining] = useState(0)
  const [running, setRunning] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('Ask a lesson question and the coach will keep the answer short.')
  const [setupStep, setSetupStep] = useState<number | null>(null)
  const lesson = companionLessons.find((item) => item.id === lessonId)
  const completed = account.completedCompanionLessons ?? []
  useEffect(() => { if (!running || remaining <= 0) return; const timer = setInterval(() => setRemaining((value) => value - 1), 1000); return () => clearInterval(timer) }, [running, remaining])
  useEffect(() => { if (remaining === 0) setRunning(false) }, [remaining])
  const openLesson = (id: string) => { const selected = companionLessons.find((item) => item.id === id)!; setLessonId(id); setRemaining(selected.minutes * 60); setRunning(false); setAnswer('Ask a lesson question and the coach will keep the answer short.') }
  const finish = () => { if (!lesson || completed.includes(lesson.id)) return; setState({ ...state, accounts: state.accounts.map((item) => item.id === account.id ? { ...item, completedCompanionLessons: [...completed, lesson.id] } : item) }); notify(`${lesson.title} complete`) }
  const ask = () => { const text = question.toLowerCase(); let reply = 'Focus on one small step: listen, adjust, then listen again.'; if (text.includes('tempo') || text.includes('fast') || text.includes('slow')) reply = 'If the incoming track pulls ahead, slow it slightly. If it falls behind, speed it up. Use a small jog nudge only after the tempo is close.'; else if (text.includes('cue') || text.includes('headphone')) reply = 'Headphone cue is private. Compare it with the master so you can hear whether the incoming track is ahead or behind.'; else if (text.includes('beat') || text.includes('phrase') || text.includes('count')) reply = 'Count four beats per bar and listen for groups of 8, 16, or 32 bars. Start the new track when both phrases begin together.'; else if (text.includes('eq') || text.includes('bass') || text.includes('low')) reply = 'Avoid two full basslines at once. Reduce LOW on the incoming track, bring it in, then trade the LOW EQ at the phrase change.'; setAnswer(reply); setQuestion('') }
  const setupSteps = ['Choose your controller or select touch-only practice.', 'Find Play and Cue on both decks.', 'Find Browse and Load.', 'Find both tempo controls and jog wheels.', 'Find headphone cue and master cue.', 'Find channel faders, LOW EQ, and the crossfader.']
  if (setupStep !== null) return <section className="companion-page"><button className="back-link" onClick={() => setSetupStep(null)}>← Class companion</button><div className="setup-companion"><small>CONTROLLER SETUP · STEP {setupStep + 1} OF {setupSteps.length}</small><h1>{setupSteps[setupStep]}</h1><p>Only map what you need for class. RekordBridge live MIDI capture remains a future add-on.</p><button className="primary" onClick={() => setupStep === setupSteps.length - 1 ? setSetupStep(null) : setSetupStep(setupStep + 1)}>{setupStep === setupSteps.length - 1 ? 'Finish setup' : 'I found it'}</button></div></section>
  if (lesson) return <section className="companion-page"><button className="back-link" onClick={() => setLessonId(null)}>← All class practice</button><div className="lesson-detail"><small>{lesson.label} · {lesson.minutes} MINUTES</small><h1>{lesson.title}</h1><p>{lesson.description}</p><div className="lesson-work"><section><h2>Your practice</h2><ol>{lesson.tasks.map((task) => <li key={task}>{task}</li>)}</ol><div className="practice-timer"><strong>{String(Math.floor(remaining / 60)).padStart(2, '0')}:{String(remaining % 60).padStart(2, '0')}</strong><button className="secondary" onClick={() => setRunning(!running)} disabled={remaining === 0}>{remaining === 0 ? 'Timer complete' : running ? 'Pause' : remaining === lesson.minutes * 60 ? 'Start timer' : 'Continue'}</button></div><button className="primary full" onClick={finish} disabled={completed.includes(lesson.id)}>{completed.includes(lesson.id) ? 'Practice complete' : 'Complete practice'}</button></section><aside><small>LESSON COACH</small><h2>Ask about this practice.</h2><p>{answer}</p><div className="comment-box"><input value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') ask() }} placeholder="How do I know which way to move tempo?" /><button onClick={ask}>Ask</button></div></aside></div></div></section>
  return <section className="companion-page"><div className="portal-title"><div><small>YOUR SHOT CLASS ADD-ON</small><h1>Class companion</h1><p>Short practice for your real equipment and Your Shot lessons. This stays inside the DJ portal and does not replace the main Zero 2 Hero app.</p></div><button className="secondary" onClick={() => setSetupStep(0)}>Set up controller</button></div><div className="companion-progress"><span>{completed.length}/4 practices complete</span><i><b style={{ width: `${completed.length * 25}%` }} /></i></div><div className="companion-grid">{companionLessons.map((item, index) => <button key={item.id} onClick={() => openLesson(item.id)}><span>{String(index + 1).padStart(2, '0')}</span><small>{item.label} · {item.minutes} MIN</small><h2>{item.title}</h2><p>{item.description}</p><b>{completed.includes(item.id) ? 'COMPLETED ✓' : 'START PRACTICE →'}</b></button>)}</div><div className="companion-boundary"><div><small>REKORDBRIDGE</small><h2>Controller integration comes later.</h2><p>This class companion guides practice today. Future RekordBridge releases owned by <b>avaedge617</b> can add verified controller mapping and live MIDI capture when hosted.</p></div><button className="secondary" onClick={() => notify('RekordBridge link will be added after avaedge617 hosts the release.')}>Future download link</button></div></section>
}

function RecordingFeed({ state, setState, account, notify }: { state: PortalState; setState: (state: PortalState) => void; account: PortalAccount; notify: (value: string) => void }) {
  const [showUpload, setShowUpload] = useState(false)
  return <><section className="portal-title"><div><small>COMMUNITY PROOF OF WORK</small><h1>Recording feed</h1><p>Phone recordings are welcome. Share the work in progress and help another Hero improve.</p></div><button className="primary" onClick={() => setShowUpload(true)}>Upload audio</button></section><div className="feed-layout"><section className="recording-feed">{state.recordings.length ? state.recordings.slice().reverse().map((post) => <RecordingCard key={post.id} post={post} account={account} state={state} setState={setState} notify={notify} />) : <div className="feed-empty"><span>♪</span><h2>No recordings yet.</h2><p>Upload the first phone recording or practice mix.</p><button className="primary" onClick={() => setShowUpload(true)}>Share a recording</button></div>}</section><aside className="community-rules"><small>ROOM STANDARD</small><h3>Useful feedback wins.</h3><p>{POSITIVITY_CLAUSE}</p><ul><li>Name one thing that worked.</li><li>Make one specific suggestion.</li><li>Encourage the next attempt.</li></ul><div><b>NO PRIVATE MESSAGES</b><span>Conversation stays in the recording feed and public live chat.</span></div></aside></div>{showUpload && <UploadModal close={() => setShowUpload(false)} submit={(post) => { try { setState({ ...state, recordings: [...state.recordings, post] }); setShowUpload(false); notify('Recording added to the feed') } catch { notify('This recording is too large for local demo storage') } }} account={account} />}</>
}

function RecordingCard({ post, account, state, setState, notify }: { post: AudioPost; account: PortalAccount; state: PortalState; setState: (state: PortalState) => void; notify: (value: string) => void }) {
  const [comment, setComment] = useState('')
  const update = (next: AudioPost) => setState({ ...state, recordings: state.recordings.map((item) => item.id === post.id ? next : item) })
  const liked = post.likes.includes(account.id)
  const addComment = () => { if (!isPositiveEnough(comment)) { notify('Keep feedback constructive and positive.'); return }; update({ ...post, comments: [...post.comments, { id: crypto.randomUUID(), author: account.displayName, text: comment.trim(), createdAt: new Date().toISOString() }] }); setComment('') }
  return <article className="recording-card"><header><span>{post.author.slice(0, 2).toUpperCase()}</span><div><b>{post.author}</b><small>{new Date(post.createdAt).toLocaleString()}</small></div></header><h2>{post.title}</h2>{post.caption && <p>{post.caption}</p>}<audio controls preload="metadata" src={post.audioDataUrl}>Your browser cannot play this recording.</audio><div className="feed-actions"><button className={liked ? 'liked' : ''} onClick={() => update({ ...post, likes: liked ? post.likes.filter((id) => id !== account.id) : [...post.likes, account.id] })}>♥ {post.likes.length}</button><span>{post.comments.length} comments</span><small>{post.fileName}</small></div><div className="comments">{post.comments.map((item) => <div key={item.id}><b>{item.author}</b><p>{item.text}</p></div>)}</div><div className="comment-box"><input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Leave positive, useful feedback…" onKeyDown={(event) => { if (event.key === 'Enter') addComment() }} /><button onClick={addComment}>Post</button></div></article>
}

function UploadModal({ close, submit, account }: { close: () => void; submit: (post: AudioPost) => void; account: PortalAccount }) {
  const input = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const upload = () => {
    if (!file || !title.trim()) return
    if (file.size > 3 * 1024 * 1024) { setError('For this local demo, choose an audio file under 3 MB.'); return }
    const reader = new FileReader()
    reader.onload = () => submit({ id: crypto.randomUUID(), author: account.displayName, title: title.trim(), caption: caption.trim(), fileName: file.name, audioDataUrl: String(reader.result), likes: [], comments: [], createdAt: new Date().toISOString() })
    reader.onerror = () => setError('The audio file could not be read.')
    reader.readAsDataURL(file)
  }
  return <div className="modal-backdrop"><section className="modal upload-audio"><button className="modal-close" onClick={close}>×</button><small>SHARE PROOF OF WORK</small><h2>Upload a recording.</h2><p>A phone memo or short practice mix is enough. MP3, M4A, WAV, and other browser-supported audio formats are accepted.</p><label className="note-field"><span>Recording title</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Day 7 beatmatch practice" /></label><label className="note-field"><span>Context <i>optional</i></span><textarea value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="What were you practicing? What feedback would help?" /></label><input className="sr-only" ref={input} type="file" accept="audio/*" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setError('') }} /><button className="upload-zone" onClick={() => input.current?.click()}><strong>{file?.name ?? 'Choose audio file'}</strong><span>Local demo limit: 3 MB</span></button>{error && <p className="form-message">{error}</p>}<button className="primary full" disabled={!file || !title.trim()} onClick={upload}>Add to recording feed</button></section></div>
}

function LiveChat({ state, setState, account, notify }: { state: PortalState; setState: (state: PortalState) => void; account: PortalAccount; notify: (value: string) => void }) {
  const [text, setText] = useState('')
  const send = () => { if (!isPositiveEnough(text)) { notify('Keep the live chat positive.'); return }; setState({ ...state, chat: [...state.chat, { id: crypto.randomUUID(), author: account.displayName, text: text.trim(), createdAt: new Date().toISOString() }] }); setText('') }
  return <section className="chat-page"><div className="portal-title"><div><small>PUBLIC ROOM</small><h1>Live chat</h1><p>One shared room for practice questions, set check-ins, and show-day support.</p></div></div><div className="chat-window"><div className="chat-messages">{state.chat.length ? state.chat.map((post) => <article key={post.id}><span>{post.author.slice(0, 2).toUpperCase()}</span><div><header><b>{post.author}</b><small>{new Date(post.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</small></header><p>{post.text}</p></div></article>) : <div className="chat-empty">The room is quiet. Say hello or share today’s practice goal.</div>}</div><div className="chat-compose"><input value={text} onChange={(event) => setText(event.target.value)} placeholder="Message the public room…" onKeyDown={(event) => { if (event.key === 'Enter') send() }} /><button className="primary" onClick={send}>Send</button></div><p>Public room only · Positivity clause applies · Messages update in this browser demo</p></div></section>
}

export function MemberApprovals({ currentAccount }: { currentAccount: PortalAccount }) {
  const [accounts, setAccounts] = useState<PortalAccount[]>([])
  const [resets, setResets] = useState<PasswordResetRequest[]>([])
  const [message, setMessage] = useState('')
  const load = async () => { try { const data = await authApi.founder.list(); setAccounts(data.accounts); setResets(data.resetRequests) } catch (error) { setMessage(error instanceof Error ? error.message : 'Founder data could not load.') } }
  useEffect(() => { void load() }, [])
  const pending = accounts.filter((account) => account.status === 'pending')
  const regularPending = pending.filter((account) => account.program === 'zero2hero')
  const yourShotPending = pending.filter((account) => account.program === 'your-shot')
  const decide = async (id: string, approve: boolean) => { await authApi.founder.accountAction(id, approve ? 'approve' : 'decline'); await load() }
  const decideReset = async (id: string, approve: boolean) => { await authApi.founder.resetAction(id, approve ? 'approve' : 'deny'); await load() }
  const resetMember = async (account: PortalAccount) => { await authApi.founder.accountAction(account.id, 'reset'); await load() }
  const removeMember = async (account: PortalAccount) => { await authApi.founder.accountAction(account.id, 'delete'); await load() }
  const requestList = (accounts: PortalAccount[], empty: string) => <div className="approval-list">{accounts.length ? accounts.map((account) => <article key={account.id}><span>{account.displayName.slice(0, 2).toUpperCase()}</span><div><h3>{account.displayName}</h3><p>@{account.username} · Default: {defaultPassword(account.username)}</p></div><button className="secondary" onClick={() => decide(account.id, false)}>Decline</button><button className="primary" onClick={() => decide(account.id, true)}>Approve</button></article>) : <div className="founder-empty">{empty}</div>}</div>
  return <section><div className="portal-title"><div><small>FOUNDER CONTROLS</small><h1>Members & security</h1><p>Accounts, approvals, password hashes, and sessions now live on the secure server.</p></div></div>{message && <p className="form-message">{message}</p>}<h2 className="founder-section-title">ZERO 2 HERO signup requests</h2>{requestList(regularPending, 'No pending ZERO 2 HERO signups.')}<h2 className="founder-section-title">Your Shot signup requests</h2>{requestList(yourShotPending, 'No pending Your Shot signups.')}<h2 className="founder-section-title">Password reset requests</h2><div className="approval-list">{resets.length ? resets.map((request) => <article key={request.id}><span>{request.username.slice(0, 2).toUpperCase()}</span><div><h3>@{request.username}</h3><p>Security PIN check: <b className={request.pinPassed ? 'pin-pass' : 'pin-fail'}>{request.pinPassed ? 'PASS' : 'FAIL'}</b></p></div><button className="secondary" onClick={() => void decideReset(request.id, false)}>Deny</button><button className="primary" disabled={!request.pinPassed} onClick={() => void decideReset(request.id, true)}>Approve reset</button></article>) : <div className="founder-empty">No pending password resets.</div>}</div><section className="member-roster"><small>APPROVED MEMBERS</small>{accounts.filter((account) => account.status === 'approved').map((account) => <div className="member-row" key={account.id}><div><b>{account.displayName}</b><span>@{account.username} · {account.program === 'your-shot' ? 'Your Shot' : 'ZERO 2 HERO'} · {account.mustChangePassword ? 'Must update password' : 'Security ready'}</span></div><i>{account.role}</i>{account.id !== currentAccount.id && <><button onClick={() => void resetMember(account)}>Reset password</button><button className="danger-button" onClick={() => void removeMember(account)}>Remove user</button></>}</div>)}</section></section>
}
