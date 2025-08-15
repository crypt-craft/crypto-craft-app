import { motion } from 'framer-motion';
import { FeatureType } from '@/layouts/AppLayout';
import { Coins, BarChart2, SendIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureNavProps {
  activeFeature: FeatureType;
  setActiveFeature: (feature: FeatureType) => void;
  className?: string;
}

export function FeatureNav({ activeFeature, setActiveFeature, className }: FeatureNavProps) {
  const features = [
    {
      id: 'token',
      label: 'Create Token',
      icon: <Coins className="w-4 h-4" />,
      color: 'from-blue-500 to-purple-500',
    },
    {
      id: 'liquidity',
      label: 'Manage Liquidity',
      icon: <BarChart2 className="w-4 h-4" />,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      id: 'airdrop',
      label: 'Airdrop Tokens',
      icon: <SendIcon className="w-4 h-4" />,
      color: 'from-pink-500 to-orange-500',
    },
  ];

  return (
    <div className={cn("bg-white/5 border border-white/10 rounded-lg backdrop-blur-md p-1 flex", className)}>
      {features.map((feature) => {
        const isActive = activeFeature === feature.id;
        
        return (
          <button
            key={feature.id}
            onClick={() => setActiveFeature(feature.id as FeatureType)}
            className={`
              relative flex-1 py-2 rounded-md flex items-center justify-center gap-2
              text-sm font-medium transition-all
              ${isActive ? 'text-white' : 'text-white/60 hover:text-white/80'}
            `}
          >
            {isActive && (
              <motion.div
                layoutId="featureHighlight"
                className={`absolute inset-0 rounded-md bg-gradient-to-r ${feature.color} opacity-20`}
                initial={false}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            {feature.icon}
            <span>{feature.label}</span>
          </button>
        );
      })}
    </div>
  );
}
