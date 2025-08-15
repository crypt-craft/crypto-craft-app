import { motion } from 'framer-motion';
import { BlockchainType } from '@/layouts/AppLayout';
import { SolanaIcon, TonIcon, TronIcon } from './BlockchainIcons';

interface BlockchainBarProps {
  activeBlockchain: BlockchainType;
  setActiveBlockchain: (blockchain: BlockchainType) => void;
}

export function BlockchainBar({ activeBlockchain, setActiveBlockchain }: BlockchainBarProps) {
  const blockchains = [
    {
      id: 'solana',
      name: 'Solana',
      icon: <SolanaIcon className="w-5 h-5" />,
      color: 'from-purple-500 to-blue-500',
      hoverColor: 'group-hover:from-purple-600 group-hover:to-blue-600',
    },
    {
      id: 'ton',
      name: 'TON',
      icon: <TonIcon className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'group-hover:from-blue-600 group-hover:to-cyan-600',
    },
    {
      id: 'tron',
      name: 'Tron',
      icon: <TronIcon className="w-5 h-5" />,
      color: 'from-red-500 to-orange-500',
      hoverColor: 'group-hover:from-red-600 group-hover:to-orange-600',
    },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md">
      <h3 className="text-sm font-semibold mb-4 text-white/70">Select Blockchain</h3>
      <div className="space-y-2">
        {blockchains.map((blockchain) => {
          const isActive = activeBlockchain === blockchain.id;
          
          return (
            <button
              key={blockchain.id}
              onClick={() => setActiveBlockchain(blockchain.id as BlockchainType)}
              className={`
                relative w-full px-4 py-3 rounded-lg flex items-center gap-3 
                group transition-all
                ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="blockchainHighlight"
                  className={`absolute inset-0 rounded-lg bg-gradient-to-r ${blockchain.color} opacity-10`}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                bg-gradient-to-r ${blockchain.color} ${blockchain.hoverColor} transition-all
              `}>
                {blockchain.icon}
              </div>
              <span className="font-medium">{blockchain.name}</span>
              {isActive && (
                <motion.div
                  layoutId="blockchainIndicator"
                  className="ml-auto w-2 h-2 rounded-full bg-blue-400"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
