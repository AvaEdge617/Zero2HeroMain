import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { Journey, JourneyInput, JourneyLevel, Mission, ProofType, RewardEvent } from './types'
import { connectWallet, type WalletState } from './lib/nimiq'
import { currentJourneyLevel, journeyProgress, makeMissions, planJourney, XP_RULES } from './lib/progression'
import { createDjChallenge, djChallengeLevels, djChallengeMissions, djResourceUrl, DJ_CHALLENGE_ID, DJ_PERFORMANCE_DATES, formatMissionDate, upgradeDjChallenge, type DjPerformanceDate } from './lib/djChallenge'
import { loadJourneys, saveJourneys } from './lib/store'
import Portal from './Portal'

type View = 'landing' | 'create' | 'plan' | 'dashboard' | 'public' | 'challenge' | 'portal'
const emptyInput: JourneyInput = { goal: '', startingPoint: '', hero: '', commitment: '', deadline: '', resources: '' }

function Icon({ name }: { name: 'arrow' | 'spark' | 'check' | 'wallet' | 'proof' | 'share' }) {
  const paths = {
    arrow: <path d="m5 12 14 0m-6-6 6 6-6 6" />,
    spark: <path d="m12 2 1.6 5.2L19 9l-5.4 1.8L12 16l-1.6-5.2L5 9l5.4-1.8L12 2Zm7 13 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />,
    check: <path d="m5 12 4 4L19 6" />,
    wallet: <><path d="M4 6h14a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12" /><path d="M15 11h7v4h-7a2 2 0 0 1 0-4Z" /></>,
    proof: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m7 15 3-3 3 3 4-5 3 4" /><circle cx="8" cy="8" r="1" /></>,
    share: <><circle cx="18" cy="5" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="18" cy="19" r="2" /><path d="m8 11 8-5M8 13l8 5" /></>,
  }
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

function Brand() {
  return <button className="brand" onClick={() => location.hash = ''} aria-label="Zero 2 Hero home"><span>0</span><i>2</i><strong>HERO</strong></button>
}

function App() {
  const [view, setView] = useState<View>('landing')
  const [journeys, setJourneys] = useState<Journey[]>(() => loadJourneys().map((journey) => upgradeDjChallenge(journey)))
  const [activeId, setActiveId] = useState<string | null>(() => loadJourneys()[0]?.id ?? null)
  const [input, setInput] = useState<JourneyInput>(emptyInput)
  const [levels, setLevels] = useState<JourneyLevel[]>([])
  const [wallet, setWallet] = useState<WalletState>({ status: 'idle' })
  const [toast, setToast] = useState('')

  const active = journeys.find((journey) => journey.id === activeId) ?? journeys[0]
  useEffect(() => saveJourneys(journeys), [journeys])
  useEffect(() => {
    const route = () => {
      const hash = location.hash.replace(/^#\/?/, '')
      if (hash.startsWith('journey/')) {
        const routeId = hash.slice('journey/'.length)
        if (journeys.some((journey) => journey.id === routeId)) setActiveId(routeId)
        setView('public')
      }
      else if (hash === 'app') setView('dashboard')
      else if (hash === 'challenge') setView('challenge')
      else if (hash === 'portal') setView('portal')
      else setView('landing')
    }
    route(); addEventListener('hashchange', route); return () => removeEventListener('hashchange', route)
  }, [journeys])
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 2600); return () => clearTimeout(timer) }, [toast])

  const updateJourney = (next: Journey) => setJourneys((all) => all.map((journey) => journey.id === next.id ? next : journey))
  const start = () => { setInput(emptyInput); setLevels([]); setView('create'); scrollTo(0, 0) }
  const propose = (event: FormEvent) => { event.preventDefault(); setLevels(planJourney(input)); setView('plan'); scrollTo(0, 0) }
  const approve = () => {
    const id = crypto.randomUUID()
    const journey: Journey = { id, owner: 'Onna', input, levels, missions: makeMissions(levels, input), proofs: [], rewardEvents: [], xp: 0, public: true, createdAt: new Date().toISOString() }
    setJourneys((all) => [journey, ...all]); setActiveId(id); setView('dashboard'); location.hash = 'app'; scrollTo(0, 0)
  }

  const connect = async () => { setWallet({ status: 'connecting' }); setWallet(await connectWallet()) }
  const openExisting = (id: string) => { setActiveId(id); setView('dashboard'); location.hash = 'app'; scrollTo(0, 0) }
  const previewChallenge = () => { setView('challenge'); location.hash = 'challenge'; scrollTo(0, 0) }
  const beginChallenge = (performanceDate: DjPerformanceDate) => {
    const existing = journeys.find((journey) => journey.templateId === DJ_CHALLENGE_ID)
    if (existing) { updateJourney(upgradeDjChallenge(existing, performanceDate)); openExisting(existing.id); return }
    const challenge = createDjChallenge(performanceDate)
    setJourneys((all) => [challenge, ...all]); setActiveId(challenge.id); setView('dashboard'); location.hash = 'app'; scrollTo(0, 0)
  }

  if (view === 'portal') return <Portal back={() => { location.hash = 'challenge'; setView('challenge') }} />

  return <div className="app-shell">
    <div className="ambient ambient-a" /><div className="ambient ambient-b" />
    <header className="topbar"><Brand /><nav><button className="nav-link" onClick={() => { location.hash = 'portal'; setView('portal') }}>DJ portal</button>{active && <button className="nav-link" onClick={() => openExisting(active.id)}>My journey</button>}<WalletButton wallet={wallet} connect={connect} /></nav></header>
    <main>
      {view === 'landing' && <Landing start={start} challenge={previewChallenge} active={active} openExisting={openExisting} />}
      {view === 'challenge' && <ChallengePreview begin={beginChallenge} alreadyStarted={journeys.some((journey) => journey.templateId === DJ_CHALLENGE_ID)} />}
      {view === 'create' && <JourneyForm input={input} setInput={setInput} submit={propose} />}
      {view === 'plan' && <Plan input={input} levels={levels} setLevels={setLevels} approve={approve} back={() => setView('create')} />}
      {view === 'dashboard' && active && <Dashboard journey={active} update={updateJourney} wallet={wallet} connect={connect} publicView={() => { location.hash = `journey/${active.id}`; setView('public') }} notify={setToast} />}
      {view === 'dashboard' && !active && <Landing start={start} challenge={previewChallenge} active={active} openExisting={openExisting} />}
      {view === 'public' && active && <PublicJourney journey={active} start={start} notify={setToast} />}
    </main>
    {toast && <div className="toast" role="status">{toast}</div>}
  </div>
}

function WalletButton({ wallet, connect }: { wallet: WalletState; connect: () => void }) {
  const connected = wallet.status === 'connected'
  return <button className={`wallet-button ${connected ? 'connected' : ''}`} onClick={connect} disabled={wallet.status === 'connecting'}>
    <Icon name="wallet" />{wallet.status === 'connecting' ? 'Connecting…' : connected ? `${wallet.address?.slice(0, 5)}…${wallet.address?.slice(-4)}` : 'Connect wallet'}
  </button>
}

function DjBadge() {
  return <span className="dj-badge" aria-label="Your Shot DJ Journey"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 17a10 10 0 0 1 20 0M6 17v8h5v-8H6Zm15 0v8h5v-8h-5Z" /><path d="M12 27c2 2 6 2 8 0" /></svg><span>YOUR SHOT · DJ</span></span>
}

function Landing({ start, challenge, active, openExisting }: { start: () => void; challenge: () => void; active?: Journey; openExisting: (id: string) => void }) {
  return <>
    <section className="hero-section">
      <div className="eyebrow"><span /> REAL-WORLD PROGRESSION</div>
      <h1>Same mind.<br /><em>New skills.</em><br />Bigger possibilities.</h1>
      <p>Turn something you want to become into a clear journey of Missions, proof, and visible progress.</p>
      <div className="hero-actions"><button className="primary" onClick={start}>Start your journey <Icon name="arrow" /></button>{active && <button className="secondary" onClick={() => openExisting(active.id)}>Continue journey</button>}</div>
      <div className="microproof"><span className="faces">O <i>M</i> <b>J</b></span><strong>Proof over promises.</strong> Built for progress you can show.</div>
    </section>
    <section className="challenge-feature"><div className="challenge-feature-inner"><DjBadge /><div><small>STARTS SEPTEMBER 22</small><h2>30 days. One set.<br /><em>Your show date.</em></h2><p>Begin with lead-up Missions, follow the course-aligned daily challenge, and perform at Your Shot on October 24 or 25.</p><button className="primary" onClick={challenge}>Explore the challenge <Icon name="arrow" /></button></div><div className="challenge-count"><strong>30</strong><span>DAYS</span><small>Plus dated lead-up Missions</small></div></div></section>
    <section className="loop-section">
      <div className="section-head"><span>THE LOOP</span><h2>Your ambition becomes<br /><em>the next clear move.</em></h2></div>
      <div className="loop-grid">
        <article><b>01</b><Icon name="spark" /><h3>Define Hero</h3><p>Choose a capability or outcome that matters to you.</p></article>
        <article><b>02</b><span className="mini-level">LVL 01</span><h3>Follow the path</h3><p>Review an attainable progression before you commit.</p></article>
        <article><b>03</b><Icon name="proof" /><h3>Show the work</h3><p>Complete Missions with photos, video, or basic proof.</p></article>
        <article><b>04</b><span className="xp-mark">+XP</span><h3>Become capable</h3><p>Earn Journey XP and unlock the next challenge.</p></article>
      </div>
    </section>
    <section className="examples"><p>ONE SYSTEM. ANY JOURNEY.</p><div><span>ZERO → DJ</span><span>ZERO → 5K</span><span>ZERO → GUITAR</span><span>ZERO → FIRST APP</span></div></section>
  </>
}

function ChallengePreview({ begin, alreadyStarted }: { begin: (date: DjPerformanceDate) => void; alreadyStarted: boolean }) {
  const [performanceDate, setPerformanceDate] = useState<DjPerformanceDate>(DJ_PERFORMANCE_DATES[0])
  const missions = djChallengeMissions(performanceDate)
  const leadUp = missions.filter((mission) => mission.phase === 'lead-up')
  return <section className="challenge-page"><div className="challenge-intro"><DjBadge /><div className="eyebrow"><span /> START SEPTEMBER 22, 2026</div><h1>Your road to<br /><em>Your Shot.</em></h1><p>Choose your performance date. The website maps a Your Shot-based Mission to every day: a short lead-up, then the complete 30-day challenge ending on show day.</p><div className="date-picker"><span>CHOOSE YOUR PERFORMANCE</span>{DJ_PERFORMANCE_DATES.map((date) => <button className={date === performanceDate ? 'selected' : ''} key={date} onClick={() => setPerformanceDate(date)}><b>OCT</b><strong>{date.slice(-2)}</strong><small>{new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`))}</small></button>)}</div><button className="primary" onClick={() => begin(performanceDate)}>{alreadyStarted ? 'Use this date and continue' : 'Start the DJ challenge'} <Icon name="arrow" /></button><div className="challenge-principles"><span>{leadUp.length} lead-up Missions</span><span>30 challenge days</span><span>Performance-day Boss Mission</span></div></div><div className="leadup-card"><div><small>LEAD-UP · SEPTEMBER 22</small><h2>Get ready before Day 1.</h2></div>{leadUp.map((mission) => <div className="challenge-day" key={mission.id}><span><b>{mission.scheduledDate && formatMissionDate(mission.scheduledDate)}</b>LEAD-UP</span><strong>{mission.title}</strong></div>)}</div><div className="challenge-levels">{djChallengeLevels.map((level, index) => <article key={level.id}><div className="challenge-level-heading"><b>LEVEL {index + 1}</b><h2>{level.name}</h2><p>{level.description}</p></div><div>{missions.filter((mission) => mission.phase === 'challenge' && mission.levelId === level.id).map((mission) => <div className="challenge-day" key={mission.id}><span><b>DAY {String(mission.day).padStart(2, '0')}</b>{mission.scheduledDate && formatMissionDate(mission.scheduledDate)}</span><strong>{mission.title}</strong>{mission.type === 'BOSS' && <b>RECORD</b>}</div>)}</div></article>)}</div><p className="challenge-source">The 30 challenge Missions follow the Your Shot course sequence reviewed in the earlier course-research chat. Tutorial links open topic-specific YouTube searches.</p></section>
}

function JourneyForm({ input, setInput, submit }: { input: JourneyInput; setInput: (value: JourneyInput) => void; submit: (event: FormEvent) => void }) {
  const fields: Array<[keyof JourneyInput, string, string]> = [
    ['goal', 'What do you want to become?', 'A DJ, a 5K finisher, an app builder…'],
    ['startingPoint', 'Where are you starting?', 'Be honest. Complete beginner is a great starting point.'],
    ['hero', 'What does Hero look like?', 'Describe a specific outcome you can demonstrate.'],
    ['commitment', 'What can you realistically commit?', 'Example: 4 focused sessions each week'],
    ['deadline', 'Is there a deadline?', 'Example: 5 weeks or October 24'],
    ['resources', 'What do you already have?', 'Equipment, tools, people, or experience'],
  ]
  return <section className="flow-page"><div className="flow-kicker">CREATE A JOURNEY <span>01 / 03</span></div><h1>Establish your <em>Zero.</em></h1><p>Give us enough context to propose a path you can actually finish.</p>
    <form className="journey-form" onSubmit={submit}>{fields.map(([key, label, placeholder], index) => <label key={key}><span><b>{String(index + 1).padStart(2, '0')}</b>{label}</span>{key === 'startingPoint' || key === 'hero' ? <textarea required value={input[key]} placeholder={placeholder} onChange={(event) => setInput({ ...input, [key]: event.target.value })} /> : <input required={index < 4} value={input[key]} placeholder={placeholder} onChange={(event) => setInput({ ...input, [key]: event.target.value })} />}</label>)}
      <button className="primary full" type="submit">Generate my path <Icon name="spark" /></button></form>
  </section>
}

function Plan({ input, levels, setLevels, approve, back }: { input: JourneyInput; levels: JourneyLevel[]; setLevels: (value: JourneyLevel[]) => void; approve: () => void; back: () => void }) {
  const move = (index: number, direction: -1 | 1) => { const next = [...levels]; const target = index + direction; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; setLevels(next) }
  return <section className="flow-page plan-page"><div className="flow-kicker">PROPOSED PATH <span>02 / 03</span></div><h1>Your path to <em>Hero.</em></h1><p>We built a realistic first draft from your starting point. Edit it before the Journey begins.</p>
    <div className="goal-summary"><small>ZERO</small><strong>{input.startingPoint}</strong><i>→</i><small>HERO</small><strong>{input.hero}</strong></div>
    <div className="level-path">{levels.map((level, index) => <article key={level.id}><div className="level-node"><span>{index + 1}</span></div><div><small>LEVEL {String(index + 1).padStart(2, '0')}</small><input aria-label={`Level ${index + 1} name`} value={level.name} onChange={(event) => setLevels(levels.map((item) => item.id === level.id ? { ...item, name: event.target.value } : item))} /><textarea aria-label={`Level ${index + 1} description`} value={level.description} onChange={(event) => setLevels(levels.map((item) => item.id === level.id ? { ...item, description: event.target.value } : item))} /></div><div className="reorder"><button onClick={() => move(index, -1)} aria-label="Move level up">↑</button><button onClick={() => move(index, 1)} aria-label="Move level down">↓</button></div></article>)}</div>
    <div className="flow-actions"><button className="secondary" onClick={back}>Back</button><button className="primary" onClick={approve}>Approve journey <Icon name="arrow" /></button></div>
  </section>
}

function Dashboard({ journey, update, wallet, connect, publicView, notify }: { journey: Journey; update: (j: Journey) => void; wallet: WalletState; connect: () => void; publicView: () => void; notify: (s: string) => void }) {
  const [proofMission, setProofMission] = useState<Mission | null>(null)
  const [showReward, setShowReward] = useState(false)
  const progress = journeyProgress(journey.missions), level = currentJourneyLevel(journey)
  const nextMission = journey.missions.find((mission) => !mission.completed)
  return <section className="dashboard"><div className="dash-head"><div>{journey.templateId === DJ_CHALLENGE_ID && <DjBadge />}<div className="eyebrow"><span /> ACTIVE JOURNEY</div><h1>ZERO <em>→</em> {journey.input.goal.toUpperCase()}</h1><p>{journey.input.hero}</p></div><button className="share-button" onClick={publicView}><Icon name="share" /> Public page</button></div>
    <div className="stat-grid"><article className="progress-card"><div className="progress-ring" style={{ '--progress': `${progress * 3.6}deg` } as React.CSSProperties}><div><strong>{progress}%</strong><small>COMPLETE</small></div></div><div><small>CURRENT LEVEL</small><strong>{level} / {journey.levels.length}</strong><p>{journey.levels[level - 1]?.name}</p></div></article><article><small>JOURNEY XP</small><strong className="big-stat">{journey.xp}</strong><div className="xp-bar"><i style={{ width: `${Math.min(100, journey.xp % 100)}%` }} /></div><p>{100 - (journey.xp % 100)} XP until the next progression mark</p></article><article><small>PROOF SUBMITTED</small><strong className="big-stat">{journey.proofs.length}</strong><p>{journey.proofs.filter((proof) => proof.type === 'video').length} video · {journey.proofs.filter((proof) => proof.type === 'photo').length} photo</p></article></div>
    {nextMission ? <article className="next-mission"><div className="mission-label"><span>{nextMission.phase === 'lead-up' ? `LEAD-UP${nextMission.scheduledDate ? ` · ${formatMissionDate(nextMission.scheduledDate).toUpperCase()}` : ''}` : nextMission.day ? `DAY ${String(nextMission.day).padStart(2, '0')}${nextMission.scheduledDate ? ` · ${formatMissionDate(nextMission.scheduledDate).toUpperCase()}` : ''} · YOUR NEXT MISSION` : 'YOUR NEXT MISSION'}</span><b>{nextMission.type === 'BOSS' ? 'BOSS MISSION' : nextMission.type}</b></div><h2>{nextMission.title}</h2><p>{nextMission.description}</p><div className="mission-meta"><span>+{nextMission.xp} base XP</span><span>{nextMission.proofRequired} proof</span></div>{nextMission.resourceQuery && <a className="resource-link" href={djResourceUrl(nextMission.resourceQuery)} target="_blank" rel="noopener noreferrer">Find a tutorial for this Mission ↗</a>}<div className="mission-actions"><button className="primary" onClick={() => setProofMission(nextMission)}>Submit proof <Icon name="proof" /></button><button className="secondary" onClick={() => setShowReward(true)}>Attach NIM</button></div></article> : <article className="completion"><Icon name="spark" /><p>JOURNEY COMPLETE</p><h2>You reached your Hero outcome.</h2></article>}
    <div className="dash-columns"><section><div className="list-head"><h2>Journey path</h2><span>{journey.missions.filter((m) => m.completed).length}/{journey.missions.length} cleared</span></div><div className="mission-list">{journey.missions.map((mission, index) => <article className={mission.completed ? 'done' : mission.id === nextMission?.id ? 'current' : ''} key={mission.id}><span className="mission-index">{mission.completed ? <Icon name="check" /> : mission.phase === 'lead-up' ? 'PRE' : String(mission.day ?? index + 1).padStart(2, '0')}</span><div><small>{mission.phase === 'lead-up' ? 'LEAD-UP' : mission.day ? `DAY ${String(mission.day).padStart(2, '0')}` : ''}{mission.scheduledDate ? ` · ${formatMissionDate(mission.scheduledDate).toUpperCase()}` : ''} · {mission.type === 'BOSS' ? 'BOSS MISSION' : mission.type}</small><h3>{mission.title}</h3></div><b>{mission.completed ? 'CLEARED' : mission.id === nextMission?.id ? 'ACTIVE' : 'LOCKED'}</b></article>)}</div></section><WalletPanel wallet={wallet} connect={connect} events={journey.rewardEvents} /></div>
    {proofMission && <ProofModal mission={proofMission} close={() => setProofMission(null)} submit={(type, note, fileName) => { const bonus = XP_RULES[type]; const missions = journey.missions.map((m) => m.id === proofMission.id ? { ...m, completed: true } : m); update({ ...journey, missions, xp: journey.xp + proofMission.xp + bonus, proofs: [...journey.proofs, { id: crypto.randomUUID(), missionId: proofMission.id, type, note, fileName, createdAt: new Date().toISOString() }] }); setProofMission(null); notify(`Mission complete · +${proofMission.xp + bonus} XP`) }} />}
    {showReward && <RewardModal wallet={wallet} close={() => setShowReward(false)} connect={connect} add={(event) => { update({ ...journey, rewardEvents: [...journey.rewardEvents, event] }); setShowReward(false); notify('NIM commitment saved as planned') }} />}
  </section>
}

function WalletPanel({ wallet, connect, events }: { wallet: WalletState; connect: () => void; events: RewardEvent[] }) {
  return <aside className="wallet-panel"><small>NIMIQ LAYER</small><h2>Commitment, with real weight.</h2><p>Attach an optional NIM reward to a Mission. Journey progress remains free.</p>{wallet.status === 'connected' ? <div className="wallet-state connected"><span /><div><small>CONNECTED</small><strong>{wallet.label}</strong><code>{wallet.address}</code></div></div> : <><button className="secondary full" onClick={connect}><Icon name="wallet" /> Connect in Nimiq Pay</button>{wallet.message && <p className="wallet-note">{wallet.message}</p>}</>}<div className="reward-history"><h3>Reward history</h3>{events.length ? events.slice().reverse().map((event) => <div key={event.id}><span>{event.type}</span><strong>{event.amount ? `${event.amount} NIM` : event.status}</strong><small>{event.status}</small></div>) : <p>No commitments yet. Your first one will appear here.</p>}</div></aside>
}

function ProofModal({ mission, close, submit }: { mission: Mission; close: () => void; submit: (type: ProofType, note: string, fileName?: string) => void }) {
  const [type, setType] = useState<ProofType>(mission.proofRequired)
  const [note, setNote] = useState('')
  const [fileName, setFileName] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null)
  const needsFile = type !== 'basic'
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && close()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="proof-title"><button className="modal-close" onClick={close}>×</button><small>PROOF OF WORK</small><h2 id="proof-title">Show what you did.</h2><p>{mission.title}</p><div className="proof-choices">{(['basic', 'photo', 'video'] as ProofType[]).filter((choice) => mission.proofRequired !== 'video' || choice === 'video').map((choice) => <button className={type === choice ? 'selected' : ''} key={choice} onClick={() => { setType(choice); setFileName(undefined) }}><b>{choice}</b><span>+{XP_RULES[choice]} XP</span></button>)}</div>{needsFile && <><input ref={inputRef} className="sr-only" type="file" accept={type === 'photo' ? 'image/*' : 'video/*'} onChange={(event) => setFileName(event.target.files?.[0]?.name)} /><button className="upload-zone" onClick={() => inputRef.current?.click()}><Icon name="proof" /><strong>{fileName || `Choose ${type}`}</strong><span>{fileName ? 'Ready to submit' : 'Only the filename is saved in this browser; keep your recording separately.'}</span></button></>}<label className="note-field"><span>Reflection <i>optional</i></span><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="What changed? What did you learn?" /></label><button className="primary full" disabled={needsFile && !fileName} onClick={() => submit(type, note, fileName)}>Complete mission <Icon name="check" /></button></section></div>
}

function RewardModal({ wallet, close, connect, add }: { wallet: WalletState; close: () => void; connect: () => void; add: (event: RewardEvent) => void }) {
  const [amount, setAmount] = useState('1')
  const connected = wallet.status === 'connected'
  return <div className="modal-backdrop"><section className="modal" role="dialog" aria-modal="true"><button className="modal-close" onClick={close}>×</button><small>NIM COMMITMENT</small><h2>Put something behind it.</h2><p>This creates a transparent planned commitment. A real transfer only occurs after a Nimiq Pay wallet approval flow is configured.</p><label className="amount-field"><span>NIM</span><input type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} /></label>{connected ? <div className="honest-state"><Icon name="wallet" /><div><strong>Wallet connected</strong><span>No recipient escrow address is configured, so no transaction will be requested.</span></div></div> : <button className="secondary full" onClick={connect}>Connect wallet first</button>}<button className="primary full" disabled={!Number(amount)} onClick={() => add({ id: crypto.randomUUID(), type: 'commitment', amount: Number(amount), status: 'planned', detail: 'Optional Mission commitment', createdAt: new Date().toISOString() })}>Save planned commitment</button></section></div>
}

function PublicJourney({ journey, start, notify }: { journey: Journey; start: () => void; notify: (s: string) => void }) {
  const progress = journeyProgress(journey.missions), current = journey.missions.find((m) => !m.completed)
  const share = async () => { const data = { title: `${journey.owner}'s Zero 2 Hero Journey`, text: `Follow my ZERO → ${journey.input.goal} journey.`, url: location.href }; if (navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(location.href); notify('Journey link copied') } }
  return <section className="public-page"><div className="public-top"><div>{journey.templateId === DJ_CHALLENGE_ID && <DjBadge />}<div className="eyebrow"><span /> JOURNEY PREVIEW</div><p>{journey.owner.toUpperCase()}'S</p><h1>ZERO <em>→</em> {journey.input.goal.toUpperCase()}</h1><blockquote>“{journey.input.hero}”</blockquote></div><div className="public-progress"><strong>{progress}%</strong><span>COMPLETE</span></div></div><div className="public-actions"><button className="primary" onClick={share}><Icon name="share" /> Copy preview link</button><button className="secondary" onClick={start}>Start your own</button></div><p className="local-share-note">This preview is stored only in this browser. Others cannot see it from the link until hosted Journey storage is added.</p><div className="public-grid"><section><small>THE PATH</small>{journey.missions.map((mission, index) => <article className={mission.completed ? 'done' : mission.id === current?.id ? 'current' : ''} key={mission.id}><span>{mission.completed ? <Icon name="check" /> : index + 1}</span><div><small>{mission.day ? `DAY ${String(mission.day).padStart(2, '0')} · ` : ''}{mission.type}</small><h3>{mission.title}</h3>{mission.id === current?.id && <p>Current Mission</p>}</div></article>)}</section><aside><small>PROOF OF WORK</small>{journey.proofs.length ? journey.proofs.slice().reverse().map((proof) => <article key={proof.id}><Icon name="proof" /><div><strong>{proof.type} proof</strong><p>{proof.note || proof.fileName || 'Mission completed'}</p><small>{new Date(proof.createdAt).toLocaleDateString()}</small></div></article>) : <div className="empty-proof"><Icon name="proof" /><p>Proof entries will appear as Missions are completed.</p></div>}</aside></div><section className="public-cta"><span>YOUR TURN</span><h2>What could you become<br />if you made the next move?</h2><button className="primary" onClick={start}>Start your journey <Icon name="arrow" /></button></section></section>
}

export default App
