import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MainLayout } from './components/layout/MainLayout';
import { CryptoCraftFeatures } from './@features/CryptoCraftFeatures';
// Reown removed; using Phantom direct connector in wallet component
import * as buffer from "buffer";
import { toast } from 'sonner';
import { useNetwork } from '@/components/navbar/networkContext';

if (typeof window !== "undefined") {
  window.Buffer = buffer.Buffer;
}

// Define types for blockchain and network
type Blockchain = 'solana' | 'ton' | 'tron';
type NetworkType = 'mainnet' | 'devnet';

export default function App(): JSX.Element {
  // State management
  const [selectedBlockchain, setSelectedBlockchain] = useState<Blockchain>('solana');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const setNotification = (n: { message: string; type: 'success' | 'error' } | null) => {
    if (!n) return;
    if (n.type === 'success') toast.success(n.message)
    else toast.error(n.message)
  };
  const [networkType, setNetworkType] = useState<NetworkType>((typeof window !== 'undefined' ? (window.location.hostname.endsWith('.local') || window.location.hostname === 'localhost') : process.env.NODE_ENV !== 'production') ? 'devnet' : 'mainnet');
  const { network, setNetwork } = useNetwork();
  
  // Get the wallet connection status from ReOwn AppKit only
  const isConnected = walletConnected;
  const address = walletAddress;
  
  // Update wallet connection status when it changes
  useEffect(() => {
    if (selectedBlockchain === 'solana') {
      setWalletConnected(isConnected);
      setWalletAddress(address || '');
    } else {
      // For other blockchains, the connection will be managed by their own providers
      setWalletConnected(false);
      setWalletAddress('');
    }
  }, [selectedBlockchain, isConnected, address]);

  // Handle network change
  const handleNetworkChange = (newNetwork: NetworkType) => {
    setNetworkType(newNetwork);
    setNetwork(newNetwork);
    toast.success(`Switched to ${newNetwork}`)
  };

  // Keep local state in sync if context changes elsewhere (e.g., Navbar select)
  useEffect(() => {
    if (networkType !== network) {
      setNetworkType(network as NetworkType);
    }
  }, [network]);

  // Notification handler
  // notifications temporarily disabled

  return (
    <div className="min-h-screen bg-background">
      <Header 
        selectedBlockchain={selectedBlockchain}
        setSelectedBlockchain={setSelectedBlockchain}
        networkType={networkType}
        setNetworkType={handleNetworkChange}
        walletConnected={walletConnected}
        walletAddress={walletAddress}
      />
      <MainLayout>
        <CryptoCraftFeatures
          blockchain={selectedBlockchain}
          networkType={networkType}
          setNotification={setNotification}
        />
      </MainLayout>
    </div>
  );
}