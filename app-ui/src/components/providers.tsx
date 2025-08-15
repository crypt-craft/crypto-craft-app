import React, { useMemo } from 'react';
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NetworkProvider } from "@/components/navbar/networkContext.tsx";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function Providers({ children }: { children: React.ReactNode }) {
  const wallets = useMemo(() => [], []);
  const isLocal = typeof window !== 'undefined' ? window.location.hostname.endsWith('.local') || window.location.hostname === 'localhost' : process.env.NODE_ENV !== 'production';
  const endpoint = isLocal ? 'https://api.devnet.solana.com' : 'https://api.mainnet-beta.solana.com';
  return (
    <NetworkProvider>
      <ThemeProvider>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <Toaster position="top-center" richColors />
            {children}
          </WalletProvider>
        </ConnectionProvider>
      </ThemeProvider>
    </NetworkProvider>
  );
}