import React from 'react';
import { 
  Coins, 
  DropletsIcon, 
  BarChart2, 
  SendIcon, 
  CoinsIcon
} from 'lucide-react';

export const FeatureIcons = {
  Token: (props: React.ComponentProps<typeof Coins>) => (
    <Coins className="w-4 h-4" {...props} />
  ),
  Liquidity: (props: React.ComponentProps<typeof BarChart2>) => (
    <BarChart2 className="w-4 h-4" {...props} />
  ),
  Airdrop: (props: React.ComponentProps<typeof SendIcon>) => (
    <SendIcon className="w-4 h-4" {...props} />
  ),
  Coin: (props: React.ComponentProps<typeof CoinsIcon>) => (
    <CoinsIcon className="w-4 h-4" {...props} />
  ),
  Pool: (props: React.ComponentProps<typeof DropletsIcon>) => (
    <DropletsIcon className="w-4 h-4" {...props} />
  )
};