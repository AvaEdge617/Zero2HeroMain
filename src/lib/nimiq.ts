export interface WalletState {
  status: 'idle' | 'connecting' | 'connected' | 'unavailable' | 'error'
  address?: string
  label?: string
  message?: string
}

type ErrorResponse = { error: unknown }
type TransactionResult = string | ErrorResponse

interface NimiqProvider {
  listAccounts(): Promise<string[] | ErrorResponse>
  sendBasicTransaction(request: { recipient: string; value: number; fee?: number }): Promise<TransactionResult>
}

let provider: NimiqProvider | null = null

export async function connectWallet(): Promise<WalletState> {
  try {
    const sdk = await import('@nimiq/mini-app-sdk')
    provider = await sdk.init({ timeout: 2500 }) as unknown as NimiqProvider
    const result = await provider.listAccounts()
    if (!Array.isArray(result) || result.length === 0) {
      return { status: 'unavailable', message: 'Open this app inside Nimiq Pay and approve an account.' }
    }
    return { status: 'connected', address: result[0], label: 'Nimiq account' }
  } catch {
    return { status: 'unavailable', message: 'Wallet connection is available when this Mini App runs inside Nimiq Pay.' }
  }
}

export async function sendCommitment(recipient: string, nim: number): Promise<{ reference: string }> {
  if (!provider) throw new Error('Connect a Nimiq wallet first.')
  if (!recipient.trim()) throw new Error('Enter a Nimiq recipient address.')
  if (!Number.isFinite(nim) || nim <= 0) throw new Error('Enter a valid NIM amount.')
  const result = await provider.sendBasicTransaction({ recipient: recipient.trim(), value: Math.round(nim * 100_000) })
  if (typeof result !== 'string') throw new Error(readProviderError(result.error))
  if (!result) throw new Error('The wallet did not return a transaction reference.')
  return { reference: result }
}

function readProviderError(error: unknown) {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') return error.message
  return 'The wallet declined or could not complete the transaction.'
}
