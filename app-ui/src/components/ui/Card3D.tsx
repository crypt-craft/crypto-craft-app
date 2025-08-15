import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface Card3DProps {
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
  onClick: () => void;
  glowColor?: string;
}

export function Card3D({ icon, title, isActive, onClick, glowColor = "rgba(59, 130, 246, 0.5)" }: Card3DProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const rotateX = (y / rect.height) * 20;
    const rotateY = (x / rect.width) * -20;
    
    setRotate({ x: rotateX, y: rotateY });
  };

  const resetRotate = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative flex flex-col items-center justify-center p-6 rounded-xl backdrop-blur-md transition-all duration-200 cursor-pointer overflow-hidden
        ${isActive 
          ? 'bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border border-blue-400/30' 
          : 'bg-white/5 border border-white/10 hover:border-white/30'
        }`}
      style={{
        perspective: "1000px",
        boxShadow: isHovered || isActive 
          ? `0 0 25px ${glowColor}` 
          : 'none',
      }}
      animate={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={resetRotate}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated holographic effect */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer opacity-50" />
      
      <div className="relative flex flex-col items-center justify-center gap-3 z-10">
        <div className={`p-3 rounded-full 
          ${isActive 
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20' 
            : 'bg-black/20'
          }`}
        >
          {icon}
        </div>
        <span className="font-medium">{title}</span>
      </div>
      
      {/* Glowing active indicator */}
      {isActive && (
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
          layoutId="activeBlockchain"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.div>
  );
}
