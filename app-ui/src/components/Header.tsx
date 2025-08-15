import { motion } from 'framer-motion';
import { SolanaIcon, TonIcon, TronIcon } from '@/components/blockchain/BlockchainIcons';
import { NetworkSelector } from './NetworkSelector';

type NetworkType = 'mainnet' | 'devnet';
type BlockchainType = 'solana' | 'ton' | 'tron';

interface HeaderProps {
  selectedBlockchain: BlockchainType;
  setSelectedBlockchain: React.Dispatch<React.SetStateAction<BlockchainType>>;
  networkType: NetworkType;
  setNetworkType: (network: NetworkType) => void;
  walletConnected: boolean;
  walletAddress: string;
}

export function Header({
  selectedBlockchain,
  setSelectedBlockchain,
  networkType,
  setNetworkType,
  walletConnected,
  walletAddress
}: HeaderProps): JSX.Element {
  const blockchainTabs = [
    { id: 'solana', label: 'Solana', icon: <SolanaIcon className="w-4 h-4" /> },
    { id: 'ton', label: 'TON', icon: <TonIcon className="w-4 h-4" /> },
    { id: 'tron', label: 'Tron', icon: <TronIcon className="w-4 h-4" /> },
  ];

  return (
    <header className="p-4 border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-20">
      <div className="container mx-auto max-w-3xl flex items-center justify-between">
        {/* Animated Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500"
        >
          Crypto Craft
        </motion.h1>

        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="flex items-center gap-2">
            {blockchainTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedBlockchain(tab.id as BlockchainType)}
                className={`px-3 py-1 rounded-md flex items-center gap-1 text-sm ${
                  selectedBlockchain === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <NetworkSelector 
            selectedNetwork={networkType}
            setSelectedNetwork={setNetworkType}
          />

          {walletConnected && (
            <div className="ml-2 px-3 py-1 bg-green-900/30 border border-green-700/30 rounded-md text-sm text-green-400">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}