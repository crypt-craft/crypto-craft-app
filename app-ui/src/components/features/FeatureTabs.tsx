import { useState } from 'react';
import { TabSwitcher } from '@/components/ui/tab-switcher';
import { FeatureIcons } from '@/components/ui/feature-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { TokenCreator } from './TokenCreator';
import LiquidityManagement from '../features/LiquidityManagement';
import { AirdropFeature } from '../features/AirdropFeature';

const featureTabs = [
  {
    id: 'token',
    label: 'Create Token',
    icon: <FeatureIcons.Token />,
  },
  {
    id: 'liquidity',
    label: 'Liquidity',
    icon: <FeatureIcons.Pool />,
  },
  {
    id: 'airdrop',
    label: 'Airdrop',
    icon: <FeatureIcons.Airdrop />,
  },
];

export default function FeatureTabs() {
  const [activeTab, setActiveTab] = useState('token');
  const [walletConnected, setWalletConnected] = useState(false);

  const connectWallet = () => {
    setWalletConnected(true);
    // Add your actual wallet connection logic here
  };

  const handleNotification = (notification: { message: string; type: "success" | "error"; } | null) => {
    if (notification) {
      console.log(`${notification.type}: ${notification.message}`);
      // Add your notification display logic
    }
  };

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto px-4">
      <TabSwitcher 
        tabs={featureTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        variant="neon" // Choose from: "default", "glass", "neon", "gradient"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="min-h-[500px]"
        >
          {activeTab === 'token' && 
            <TokenCreator 
              blockchain={'solana'} 
              walletConnected={walletConnected}
              connectWallet={connectWallet}
              setNotification={handleNotification}
            />
          }
          {activeTab === 'liquidity' && <LiquidityManagement />}
          {activeTab === 'airdrop' && <AirdropFeature blockchain="solana" />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}