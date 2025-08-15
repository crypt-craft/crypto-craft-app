import { useCallback, useEffect, useState } from 'react'
import { api_uri } from '@/utils'

declare global {
  interface Window { solana?: any }
}

async function getAuthMessage(walletAddress: string) {
  const base = api_uri && api_uri !== '' ? api_uri : ''
  const res = await fetch(`${base}/api/auth/message?walletAddress=${walletAddress}&action=login`)
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || `Auth message request failed (${res.status})`)
  }
  return res.json() as Promise<{ success: boolean; message: string; timestamp: number }>
}

async function signMessagePhantom(message: string): Promise<string> {
  if (!window.solana?.isPhantom) throw new Error('Phantom wallet is required')
  const enc = new TextEncoder()
  const signed = await window.solana.signMessage(enc.encode(message), 'utf8')
  // Ensure base64 string
  return Buffer.from(signed.signature).toString('base64')
}

async function login(payload: { walletAddress: string; signature: string; message: string; timestamp: number }) {
  const base = api_uri && api_uri !== '' ? api_uri : ''
  const res = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  const data = await res.json()
  if (!res.ok || !data?.token) {
    throw new Error(data?.error || 'Login failed')
  }
  return data as { token: string }
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => {
    try { return localStorage.getItem('cc_jwt') } catch { return null }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      try { localStorage.setItem('cc_jwt', token) } catch {}
    }
  }, [token])

  const authenticate = useCallback(async (walletAddress: string) => {
    setLoading(true); setError(null)
    try {
      const { message, timestamp } = await getAuthMessage(walletAddress)
      const signature = await signMessagePhantom(message)
      const { token } = await login({ walletAddress, signature, message, timestamp })
      setToken(token)
      return token
    } catch (e: any) {
      setError(e?.message || 'Authentication failed')
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    try { localStorage.removeItem('cc_jwt') } catch {}
  }, [])

  return { token, loading, error, authenticate, logout }
}


