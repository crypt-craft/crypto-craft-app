import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface TrustWalletConnectorProps {
    setNotification: (notification: { message: string; type: 'success' | 'error' } | null) => void;
}

// Minimal EVM Trust Wallet connector for local dev and basic EVM actions
export const TrustWalletConnector = React.memo(function TrustWalletConnector({ setNotification }: TrustWalletConnectorProps) {
    const [address, setAddress] = useState<string | null>(null)
    const [chainId, setChainId] = useState<string | null>(null)
    const [isConnecting, setIsConnecting] = useState(false)

    const getInjectedTrustProvider = useCallback((): any | null => {
        if (typeof window === 'undefined') return null
        const anyWindow = window as any
        const { ethereum } = anyWindow
        if (!ethereum) return null
        if (ethereum.providers && Array.isArray(ethereum.providers)) {
            const trust = ethereum.providers.find((p: any) => p?.isTrust)
            if (trust) return trust
        }
        if (ethereum.isTrust) return ethereum
        return null
    }, [])

    const provider = useMemo(() => getInjectedTrustProvider(), [getInjectedTrustProvider])

    useEffect(() => {
        if (!provider) return
        const handleAccountsChanged = (accs: string[]) => {
            setAddress(accs && accs.length > 0 ? accs[0] : null)
        }
        const handleChainChanged = (cid: string) => {
            setChainId(cid)
        }
        const handleDisconnect = () => {
            setAddress(null)
            setChainId(null)
        }
        try {
            provider.on?.('accountsChanged', handleAccountsChanged)
            provider.on?.('chainChanged', handleChainChanged)
            provider.on?.('disconnect', handleDisconnect)
        } catch {}
        return () => {
            try {
                provider.removeListener?.('accountsChanged', handleAccountsChanged)
                provider.removeListener?.('chainChanged', handleChainChanged)
                provider.removeListener?.('disconnect', handleDisconnect)
            } catch {}
        }
    }, [provider])

    const connect = useCallback(async () => {
        if (!provider) {
            const isSecure = window.location.protocol === 'https:' || ['localhost','127.0.0.1'].includes(window.location.hostname)
            const reason = isSecure ? 'Trust Wallet not found. Install the extension and refresh.' : 'Use HTTPS or localhost for wallet connections.'
            toast.error(reason)
            setNotification && setNotification({ message: 'Trust Wallet not found. Please install the extension and refresh.', type: 'error' })
            return
        }
        try {
            setIsConnecting(true)
            const accs: string[] = await provider.request({ method: 'eth_requestAccounts' })
            const cid: string = await provider.request({ method: 'eth_chainId' })
            setAddress(accs && accs.length > 0 ? accs[0] : null)
            setChainId(cid || null)
            toast.success('Trust Wallet connected')
        } catch (e: any) {
            if (e?.code === 4001) {
                toast.error('Connection rejected in wallet')
            } else {
                toast.error(e?.message || 'Wallet connection failed')
            }
            setNotification && setNotification({ message: 'Wallet connection failed', type: 'error' })
        } finally {
            setIsConnecting(false)
        }
    }, [provider, setNotification])

    const shortAddress = useMemo(() => address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '', [address])

    return (
        <div className="p-4 border border-gray-700 rounded-lg bg-gray-800/50">
            <div className="flex flex-col items-center space-y-2">
                <Button onClick={connect} disabled={!!address || isConnecting}>
                    {address ? 'Connected (Trust Wallet)' : (isConnecting ? 'Connecting…' : 'Connect Trust Wallet')}
                </Button>
                {address && (
                    <div className="text-center text-xs text-gray-400">
                        <div>{shortAddress}</div>
                        {chainId && <div>Chain: {chainId}</div>}
                    </div>
                )}
            </div>
        </div>
    )
})


