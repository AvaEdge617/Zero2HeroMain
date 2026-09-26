export type MissionType = 'PRACTICE' | 'DEMONSTRATE' | 'CREATE' | 'BOSS'
export type ProofType = 'basic' | 'photo' | 'video'

export interface JourneyInput {
  goal: string
  startingPoint: string
  hero: string
  commitment: string
  deadline: string
  resources: string
}

export interface JourneyLevel {
  id: string
  name: string
  description: string
}

export interface Mission {
  id: string
  levelId: string
  type: MissionType
  title: string
  description: string
  xp: number
  proofRequired: ProofType
  completed: boolean
  day?: number
  scheduledDate?: string
  phase?: 'lead-up' | 'challenge'
  resourceQuery?: string
}

export interface Proof {
  id: string
  missionId: string
  type: ProofType
  note: string
  fileName?: string
  createdAt: string
}

export interface RewardEvent {
  id: string
  type: 'commitment' | 'completed' | 'transaction'
  amount?: number
  status: 'planned' | 'ready' | 'sent' | 'cancelled'
  detail: string
  createdAt: string
  txHash?: string
}

export interface Journey {
  id: string
  templateId?: 'your-shot-dj-30'
  templateVersion?: number
  owner: string
  input: JourneyInput
  levels: JourneyLevel[]
  missions: Mission[]
  proofs: Proof[]
  rewardEvents: RewardEvent[]
  xp: number
  public: boolean
  createdAt: string
}
