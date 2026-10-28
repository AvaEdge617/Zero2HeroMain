import { beforeEach, describe, expect, it, vi } from 'vitest'
import { init } from '@nimiq/mini-app-sdk'
import { connectWallet, sendCommitment } from './nimiq'

vi.mock('@nimiq/mini-app-sdk', () => ({ init: vi.fn() }))

const mockedInit = vi.mocked(init)

describe('Nimiq Pay adapter', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses the address string returned by the official account API', async () => {
    mockedInit.mockResolvedValue({ listAccounts: vi.fn().mockResolvedValue(['NQ12 TEST ADDRESS']) } as never)

    await expect(connectWallet()).resolves.toMatchObject({ status: 'connected', address: 'NQ12 TEST ADDRESS' })
  })

  it('requests a wallet-approved direct NIM transfer in luna', async () => {
    const sendBasicTransaction = vi.fn().mockResolvedValue('serialized-transaction-reference')
    mockedInit.mockResolvedValue({ listAccounts: vi.fn().mockResolvedValue(['NQ12 SENDER']), sendBasicTransaction } as never)
    await connectWallet()

    await expect(sendCommitment('NQ34 RECIPIENT', 1.25)).resolves.toEqual({ reference: 'serialized-transaction-reference' })
    expect(sendBasicTransaction).toHaveBeenCalledWith({ recipient: 'NQ34 RECIPIENT', value: 125_000 })
  })

  it('does not report a provider error as a successful transfer', async () => {
    mockedInit.mockResolvedValue({
      listAccounts: vi.fn().mockResolvedValue(['NQ12 SENDER']),
      sendBasicTransaction: vi.fn().mockResolvedValue({ error: { message: 'User declined' } }),
    } as never)
    await connectWallet()

    await expect(sendCommitment('NQ34 RECIPIENT', 1)).rejects.toThrow('User declined')
  })
})
