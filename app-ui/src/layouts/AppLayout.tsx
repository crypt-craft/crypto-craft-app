import { useState } from 'react';
import { BlockchainBar } from '@/components/blockchain/BlockchainBar';
import { FeatureCards } from '@/components/features/FeatureCards';
import { AppFooter } from '@/components/AppFooter';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { motion } from 'framer-motion';

export type BlockchainType = 'solana' | 'ton' | 'tron';
export type FeatureType = 'token' | 'liquidity' | 'airdrop';

export default function AppLayout() {
  const [activeBlockchain, setActiveBlockchain] = useState<BlockchainType>('solana');
  const [activeFeature, setActiveFeature] = useState<FeatureType>('token');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <header className="border-b border-white/10 backdrop-blur-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-xl font-bold">CC</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              CryptoCraft
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8"
        >
          <div className="space-y-6">
            <BlockchainBar 
              activeBlockchain={activeBlockchain}
              setActiveBlockchain={setActiveBlockchain}
            />
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md">
              <h3 className="text-sm font-semibold mb-3 text-white/70">Documentation</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Getting Started</a>
                </li>
                <li>
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">API References</a>
                </li>
                <li>
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Blockchain Guides</a>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <FeatureCards
              activeFeature={activeFeature}
              setActiveFeature={setActiveFeature}
              activeBlockchain={activeBlockchain}
            />
          </div>
        </motion.div>
      </main>

      <AppFooter />
    </div>
  );
}
