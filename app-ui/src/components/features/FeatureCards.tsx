import { useEffect } from "react";


import { useState } from 'react';
import { TokenFeature } from './TokenFeature';
import { LiquidityFeature } from './LiquidityFeature';
import { AirdropFeature } from './AirdropFeature';
import { FeatureNav } from './FeatureNav';
import { BlockchainType, FeatureType } from '@/layouts/AppLayout';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FeatureCardsProps {
  activeFeature: FeatureType;
  setActiveFeature: (feature: FeatureType) => void;
  activeBlockchain: BlockchainType;
}

export function FeatureCards({ activeFeature, setActiveFeature, activeBlockchain }: FeatureCardsProps) {
  const [rotation, setRotation] = useState(0);


  const features = [
    { id: 'token', component: <TokenFeature blockchain={activeBlockchain} />, rotation: 0 },
    { id: 'liquidity', component: <LiquidityFeature blockchain={activeBlockchain} />, rotation: 120 },
    { id: 'airdrop', component: <AirdropFeature blockchain={activeBlockchain} />, rotation: 240 },
  ];

  useEffect(() => {
    const currentFeature = features.find(f => f.id === activeFeature);
    if (currentFeature) {

      const currentRotation = rotation % 360;
      const targetRotation = currentFeature.rotation;
      
      let clockwiseDiff = (targetRotation - currentRotation + 360) % 360;
      let counterClockwiseDiff = (currentRotation - targetRotation + 360) % 360;
      
      if (clockwiseDiff < counterClockwiseDiff) {

        setRotation(prev => prev + clockwiseDiff);
      } else {

        setRotation(prev => prev - counterClockwiseDiff);
      }
    }
  }, [activeFeature]);

  const handleNext = () => {
    const currentIndex = features.findIndex(f => f.id === activeFeature);
    const nextIndex = (currentIndex + 1) % features.length;
    setActiveFeature(features[nextIndex].id as FeatureType);
  };

  const handlePrev = () => {
    const currentIndex = features.findIndex(f => f.id === activeFeature);
    const prevIndex = (currentIndex - 1 + features.length) % features.length;
    setActiveFeature(features[prevIndex].id as FeatureType);
  };

  return (
    <div className="relative">
      <FeatureNav 
        activeFeature={activeFeature} 
        setActiveFeature={setActiveFeature}
        className="mb-8" 
      />
      
      <div className="relative perspective-1000 w-full h-[600px]">
        <div 
          className="w-full h-full transform-style-3d transition-transform duration-1000"
          style={{ transform: `rotateY(${rotation}deg)` }}
        >
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`
                absolute inset-0 backface-hidden
                transform-style-3d rounded-xl
                border border-white/10 bg-white/5 backdrop-blur-md
                overflow-hidden
                transition-opacity duration-300
              `}
              style={{ 
                transform: `rotateY(${feature.rotation}deg) translateZ(400px)`,
                opacity: activeFeature === feature.id ? 1 : 0.6,
              }}
            >
              {feature.component}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <button 
          onClick={handlePrev}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
        <button 
          onClick={handleNext}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}