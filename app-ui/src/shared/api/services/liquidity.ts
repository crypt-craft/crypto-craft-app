import { http } from '@/shared/api/http'

export const LiquidityApi = {
  async add(params: { tokenMint: string; amount: string }) {
    const { data } = await http.post('/api/liquidity/add', params)
    return data as { ok: boolean }
  },
}
