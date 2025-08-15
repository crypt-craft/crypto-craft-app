import React from 'react';
import { SolanaIcon, TonIcon, TronIcon } from '../blockchain/BlockchainIcons';
import { FeatureIcons } from '../ui/feature-icons';

// Define the TabItem interface
export interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// Create blockchain tabs using JSX
export const blockchainTabs: TabItem[] = [
  {
    id: 'solana',
    label: 'Solana',
    icon: <SolanaIcon className="w-4 h-4" />
  },
  {
    id: 'ton',
    label: 'TON',
    icon: <TonIcon className="w-4 h-4" />
  },
  {
    id: 'tron',
    label: 'Tron',
    icon: <TronIcon className="w-4 h-4" />
  }
];

// Create feature tabs using JSX
export const featureTabs: TabItem[] = [
  {
    id: 'token',
    label: 'Token',
    icon: <FeatureIcons.Token />
  },
  {
    id: 'liquidity',
    label: 'Liquidity',
    icon: <FeatureIcons.Liquidity />
  },
  {
    id: 'airdrop',
    label: 'Airdrop',
    icon: <FeatureIcons.Airdrop />
  },
  {
    id: 'pool',
    label: 'Pool',
    icon: <FeatureIcons.Pool />
  }
];
