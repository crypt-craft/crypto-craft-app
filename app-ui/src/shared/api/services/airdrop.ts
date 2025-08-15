import { http } from '@/shared/api/http'

export const AirdropApi = {
  async preview(input: { blockchain: string; tokenAddress: string; recipients: string[]; amountPerRecipient: number }) {
    // Placeholder for backend integration; returns quick aggregate for UI
    const count = input.recipients.length
    const total = String(count * input.amountPerRecipient)
    return { total, count }
  },
  async execute(campaignId: string) {
    const { data } = await http.post('/api/airdrop/execute', { campaignId })
    return data as { ok: boolean }
  },
}
