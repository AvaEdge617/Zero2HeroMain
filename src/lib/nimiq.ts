export interface WalletState {
  status: 'idle' | 'connecting' | 'connected' | 'unavailable' | 'error'
  address?: string
  label?: string
  message?: string
}

type NimiqAccount = { address: string; label?: string }
type TransactionResult = { hash?: string } | { error: string }

interface NimiqProvider {
  listAccounts(): Promise<NimiqAccount[] | { error: string }>
  sendBasicTransaction(request: { sender: string; recipient: string; value: number; fee?: number }): Promise<TransactionResult>
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
    return { status: 'connected', address: result[0].address, label: result[0].label || 'Nimiq account' }
  } catch {
    return { status: 'unavailable', message: 'Wallet connection is available when this Mini App runs inside Nimiq Pay.' }
  }
}

export async function sendCommitment(sender: string, recipient: string, nim: number): Promise<{ hash: string }> {
  if (!provider) throw new Error('Connect a Nimiq wallet first.')
  const result = await provider.sendBasicTransaction({ sender, recipient, value: Math.round(nim * 100_000) })
  if ('error' in result) throw new Error(result.error)
  if (!result.hash) throw new Error('The wallet did not return a transaction hash.')
  return { hash: result.hash }
}
