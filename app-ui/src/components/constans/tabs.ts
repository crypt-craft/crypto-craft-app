import React from 'react';
import { SolanaIcon, TonIcon, TronIcon } from '@/components/blockchain/BlockchainIcons';
import { FeatureIcons } from '@/components/ui/feature-icons';

// Define the TabItem interface
export interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// Create blockchain tabs using React.createElement instead of JSX
export const blockchainTabs: TabItem[] = [
  {
    id: 'solana',
    label: 'Solana',
    icon: React.createElement(SolanaIcon, { className: "w-4 h-4" })
  },
  {
    id: 'ton',
    label: 'TON',
    icon: React.createElement(TonIcon, { className: "w-4 h-4" })
  },
  {
    id: 'tron',
    label: 'Tron',
    icon: React.createElement(TronIcon, { className: "w-4 h-4" })
  }
];

// Create feature tabs using React.createElement
export const featureTabs: TabItem[] = [
  {
    id: 'token',
    label: 'Token',
    icon: React.createElement(FeatureIcons.Token)
  },
  {
    id: 'liquidity',
    label: 'Liquidity',
    icon: React.createElement(FeatureIcons.Liquidity)
  },
  {
    id: 'airdrop',
    label: 'Airdrop',
    icon: React.createElement(FeatureIcons.Airdrop)
  },
  {
    id: 'pool',
    label: 'Pool',
    icon: React.createElement(FeatureIcons.Pool)
  }
];