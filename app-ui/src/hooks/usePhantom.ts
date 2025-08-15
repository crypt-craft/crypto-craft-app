import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

type PhantomLikeProvider = any

export function usePhantomWallet() {
  const [provider, setProvider] = useState<PhantomLikeProvider | null>(null)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const timeoutRef = useRef<number | null>(null)

  const isSecure = typeof window !== 'undefined' && (window.location.protocol === 'https:' || ['localhost','127.0.0.1'].includes(window.location.hostname))

  const detectProvider = useCallback((): PhantomLikeProvider | null => {
    if (typeof window === 'undefined') return null
    const anyWindow = window as any
    const prov = anyWindow.phantom?.solana ?? anyWindow.solana
    if (prov?.isPhantom) return prov
    return null
  }, [])

  useEffect(() => {
    const p = detectProvider()
    setProvider(p)
    if (!p && !isSecure) {
      toast.error('Wallet requires HTTPS or localhost')
    }
  }, [detectProvider, isSecure])

  useEffect(() => {
    if (!provider) return
    const onConnect = (pubkey: any) => {
      try {
        const pk = pubkey?.toString?.() || provider.publicKey?.toString?.() || null
        setAddress(pk)
        setConnected(!!pk)
      } catch {}
    }
    const onDisconnect = () => {
      setConnected(false)
      setAddress(null)
    }
    try {
      provider.on?.('connect', onConnect)
      provider.on?.('disconnect', onDisconnect)
      // Attempt silent connect if already trusted
      provider.connect?.({ onlyIfTrusted: true }).then((res: any) => {
        const pk = res?.publicKey?.toString?.() || provider.publicKey?.toString?.() || null
        if (pk) { setAddress(pk); setConnected(true) }
      }).catch(() => {})
    } catch {}
    return () => {
      try {
        provider.off?.('connect', onConnect)
        provider.off?.('disconnect', onDisconnect)
      } catch {}
    }
  }, [provider])

  const connect = useCallback(async () => {
    if (connecting || connected) return
    if (!provider) {
      const reason = isSecure ? 'Phantom not found. Install the extension and refresh.' : 'Use HTTPS or localhost for wallet connections.'
      toast.error(reason)
      setError('Provider not found')
      return
    }
    setConnecting(true)
    setError(null)
    try {
      // Race event vs. method; some providers emit only the event.
      const onEvent = new Promise<string | null>((resolve) => {
        const handler = (pubkey: any) => {
          try {
            const pk = pubkey?.toString?.() || provider.publicKey?.toString?.() || null
            resolve(pk)
          } catch { resolve(null) }
        }
        provider.once?.('connect', handler)
      })
      const onMethod = (async () => {
        const method = typeof provider.connect === 'function' ? () => provider.connect({ onlyIfTrusted: false }) : () => provider.request?.({ method: 'connect' })
        const res = await method()
        const pk = res?.publicKey?.toString?.() || provider.publicKey?.toString?.() || null
        return pk
      })()

      const onTimeout = new Promise<null>((resolve) => {
        timeoutRef.current = window.setTimeout(() => resolve(null), 12000)
      })

      const pk = await Promise.race([onEvent, onMethod, onTimeout])
      if (!pk) throw new Error('Connection timed out or was cancelled')
      setAddress(pk)
      setConnected(true)
      toast.success('Wallet connected')
    } catch (e: any) {
      const code = e?.code
      if (code === 4001) toast.error('Connection rejected in wallet')
      else toast.error(e?.message || 'Wallet connection failed')
      setError(e?.message || 'connect_failed')
    } finally {
      if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }
      setConnecting(false)
    }
  }, [provider, connected, connecting, isSecure])

  const disconnect = useCallback(async () => {
    if (!provider) return
    try {
      await provider.disconnect?.()
    } catch {}
    setConnected(false)
    setAddress(null)
  }, [provider])

  return useMemo(() => ({
    provider,
    ready: !!provider,
    connected,
    connecting,
    address,
    error,
    connect,
    disconnect,
  }), [provider, connected, connecting, address, error, connect, disconnect])
}


