import React, { useMemo } from 'react';
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NetworkProvider } from "@/components/navbar/networkContext.tsx";
import { useNetwork } from "@/components/navbar/networkContext.tsx";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import '@solana/wallet-adapter-react-ui/styles.css';

function SolanaConnection({ children, wallets }: { children: React.ReactNode; wallets: any[] }) {
  const { network } = useNetwork();
  const envEndpoint = (import.meta as any).env?.VITE_SOLANA_RPC as string | undefined;
  const endpoint = envEndpoint || (network === 'devnet' ? 'https://api.devnet.solana.com' : 'https://api.mainnet-beta.solana.com');
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <Toaster position="top-center" richColors />
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const wallets = useMemo(() => [], []);
  return (
    <NetworkProvider>
      <ThemeProvider>
        <SolanaConnection wallets={wallets}>
          {children}
        </SolanaConnection>
      </ThemeProvider>
    </NetworkProvider>
  );
}