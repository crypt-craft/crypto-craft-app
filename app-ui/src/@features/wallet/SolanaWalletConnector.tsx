import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';
// Reown removed. Use Phantom directly for connect/sign & raw RPC for balances.
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import * as splToken from '@solana/spl-token';
import { Wallet, Coins, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
// import { toast } from 'sonner';
import { usePhantomWallet } from '@/hooks/usePhantom';

interface SolanaWalletConnectorProps {
    networkType: 'mainnet' | 'devnet';
    setNotification: (notification: { message: string; type: 'success' | 'error' } | null) => void;
}

interface TokenBalance {
    mint: string;
    amount: number;
    decimals: number;
    symbol?: string;
    name?: string;
}

export const SolanaWalletConnector = React.memo(function SolanaWalletConnector({
                                                                                   networkType,
                                                                                   setNotification,
                                                                               }: SolanaWalletConnectorProps) {
    const { /* ready,*/ connected: isConnected, connecting: isConnecting, address, connect } = usePhantomWallet()
    const [connection, setConnection] = useState<Connection | null>(null)

    useEffect(() => {
        const envRpc = (import.meta as any).env?.VITE_SOLANA_RPC as string | undefined
        const isLocal = typeof window !== 'undefined' ? (window.location.hostname.endsWith('.local') || window.location.hostname === 'localhost') : import.meta.env.DEV
        const fallbackRpc = (networkType === 'mainnet' && !isLocal) ? clusterApiUrl('mainnet-beta') : clusterApiUrl('devnet')
        const rpc = envRpc || fallbackRpc
        setConnection(new Connection(rpc, 'confirmed'))
    }, [networkType])

    // Provider lifecycle handled in usePhantomWallet
    const { token, authenticate, loading } = useAuth();

    // Respect explicit user action for auth: connect first, then user clicks "Sign In"
    // Removed auto sign-in to enforce correct flow

    const publicKey = useMemo(() => (address ? new PublicKey(address) : null), [address]);

    const [balance, setBalance] = useState<number | null>(null);
    const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
    const [isLoadingTokens, setIsLoadingTokens] = useState(false);
    const [tokensLoaded, setTokensLoaded] = useState(false);

    const updateBalance = useCallback(async (walletAddress: string) => {
        if (!connection) return;
        try {
            const pubkey = new PublicKey(walletAddress);
            const balance = await connection.getBalance(pubkey);
            setBalance(balance / 1e9);
        } catch (error) {
            console.error('Failed to fetch balance:', error);
            // show concise error; RPCs may 403 when misconfigured
            setNotification({ message: 'Failed to fetch wallet balance', type: 'error' });
        }
    }, [connection, setNotification]);

    const fetchTokenBalances = useCallback(async (walletAddress: string) => {
        if (!connection) return;
        try {
            setIsLoadingTokens(true);
            const pubkey = new PublicKey(walletAddress);
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey, {
                programId: splToken.TOKEN_PROGRAM_ID,
            });

            const balances: TokenBalance[] = tokenAccounts.value
                .map((account) => {
                    try {
                        const parsedInfo = account.account.data.parsed.info;
                        const amount = parsedInfo.tokenAmount.uiAmount ?? 0;
                        return {
                            mint: parsedInfo.mint,
                            amount,
                            decimals: parsedInfo.tokenAmount.decimals,
                        };
                    } catch {
                        return null;
                    }
                })
                .filter((token): token is TokenBalance => token !== null && token.amount > 0);

            setTokenBalances(balances);
            setTokensLoaded(true);
        } catch (error) {
            console.error('Failed to fetch token balances:', error);
            setNotification({ message: 'Failed to fetch token balances', type: 'error' });
        } finally {
            setIsLoadingTokens(false);
        }
    }, [connection, setNotification]);

    useEffect(() => {
        if (isConnected && address && publicKey) {
            updateBalance(publicKey.toBase58());
            fetchTokenBalances(publicKey.toBase58());
        } else {
            setBalance(null);
            setTokenBalances([]);
            setTokensLoaded(false);
        }
    }, [isConnected, address, publicKey, updateBalance, fetchTokenBalances]);

    const handleLoadTokens = useCallback(() => {
        if (publicKey && !isLoadingTokens) {
            fetchTokenBalances(publicKey.toBase58());
        }
    }, [publicKey, isLoadingTokens, fetchTokenBalances]);

    return (
        <div className="p-6 border border-gray-700 rounded-lg bg-gray-800/50 backdrop-blur-sm">
            <div className="flex flex-row gap-6">
            <div className="flex flex-col items-center space-y-2">
                    <Button onClick={async () => {
                        if (isConnected || isConnecting) return;
                        await connect();
                    }} disabled={isConnected || isConnecting}> {isConnected ? 'Connected' : (isConnecting ? 'Connecting…' : 'Connect Phantom')} </Button>
                    {isConnected && address && (
                        <Button
                            size="sm"
                            variant={token ? 'secondary' : 'default'}
                            className="mt-2"
                            onClick={async () => {
                                try {
                                    await authenticate(address)
                                    setNotification({ message: 'Signed in successfully', type: 'success' })
                                } catch (e: any) {
                                    setNotification({ message: e?.message || 'Auth failed', type: 'error' })
                                }
                            }}
                            disabled={!!token || loading}
                        >
                            {token ? 'Signed In' : loading ? 'Signing…' : 'Sign In'}
                        </Button>
                    )}
                    {isConnected && publicKey && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-center"
                        >
                            <div className="text-sm text-gray-400">Connected to {networkType}</div>
                            <div className="text-xs text-gray-500 font-mono">
                                {address?.slice(0, 6)}...{address?.slice(-6)}
                            </div>
                            {balance !== null ? (
                                <div className="text-sm font-medium text-emerald-400 mt-1">
                                    {balance.toFixed(4)} SOL
                                </div>
                            ) : (
                                <div className="text-sm text-gray-400 mt-1">Loading balance...</div>
                            )}
                        </motion.div>
                    )}
                </div>

                {isConnected && publicKey && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h5 className="text-md font-medium text-gray-300 flex items-center">
                                <Coins className="w-4 h-4 mr-2" />
                                Your Assets
                            </h5>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLoadTokens}
                                disabled={isLoadingTokens}
                                className="h-8 w-8 p-0"
                            >
                                <RefreshCw className={`h-4 w-4 ${isLoadingTokens ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>

                        {isLoadingTokens ? (
                            <div className="text-center py-4 text-gray-400">Loading tokens...</div>
                        ) : tokenBalances.length > 0 ? (
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {tokenBalances.map((token, index) => (
                                    <div
                                        key={`${token.mint}-${index}`}
                                        className="flex items-center justify-between p-2 rounded-md bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">
                                                <Wallet className="w-4 h-4 text-blue-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-200">
                                                    {token.symbol || 'Unknown Token'}
                                                </div>
                                                <div className="text-xs text-gray-400 font-mono truncate max-w-[120px]">
                                                    {token.mint.slice(0, 4)}...{token.mint.slice(-4)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium text-emerald-400">
                                            {token.amount.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : tokensLoaded ? (
                            <div className="text-center py-4 text-gray-400">No tokens found</div>
                        ) : (
                            <div className="text-center py-4 text-gray-400">Click refresh to load tokens</div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
});
