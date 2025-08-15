import { http } from '@/shared/api/http'

export interface BuildUnsignedReq {
  name: string
  symbol: string
  decimals: number
  supply: string
}

export const TokenApi = {
  async buildUnsignedTx(payload: BuildUnsignedReq) {
    const { data } = await http.post('/api/token/build-unsigned', payload)
    return data as { transaction: string }
  },
  async submitSignedTx(signed: string) {
    const { data } = await http.post('/api/token/submit', { signed })
    return data as { txid: string }
  },
}
