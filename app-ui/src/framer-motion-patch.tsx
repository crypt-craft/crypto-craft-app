// Patched version of framer-motion to avoid crypto-related errors
import React from 'react';

// Create a simple fallback for motion
const createFallbackMotion = () => {
  return new Proxy({}, {
    get: function(_, prop) {
      // Return a component that renders its children
      return ({ children, ...props }: {children?: React.ReactNode, [key: string]: any}) => {
        if (typeof prop === 'string') {
          const Component = prop as keyof JSX.IntrinsicElements;
          return React.createElement(Component, props, children);
        }
        return <>{children}</>;
      };
    }
  });
};

// Initialize exports with fallbacks
export let motion: any = createFallbackMotion();
export let AnimatePresence: any = ({children}: {children?: React.ReactNode}) => <>{children}</>;
export let useAnimation: any = () => ({});
export let useMotionValue: any = <T,>(initial: T) => ({ get: () => initial, set: (v: T) => {} });
export let useTransform: any = <I, O>(input: any, inputRange: any, outputRange: O[]) => ({ get: () => outputRange[0], set: (v: O) => {} });
export let useSpring: any = <T,>(source: T | any) => ({ get: () => source, set: (v: T) => {} });
export let useScroll: any = () => ({
  scrollX: { get: () => 0, set: (v: number) => {} },
  scrollY: { get: () => 0, set: (v: number) => {} },
  scrollXProgress: { get: () => 0, set: (v: number) => {} },
  scrollYProgress: { get: () => 0, set: (v: number) => {} }
});
export let useVelocity: any = (value: any) => ({ get: () => 0, set: (v: number) => {} });
export let useMotionTemplate: any = (fragments: any, ...values: any[]) => ({ get: () => '', set: (v: string) => {} });

// Dynamically import framer-motion in a try-catch block
try {
  // Use a dynamic import in an IIFE
  (async () => {
    try {
      const framerMotion = await import('framer-motion');
      
      // Update the exported variables with the actual implementations
      motion = framerMotion.motion;
      AnimatePresence = framerMotion.AnimatePresence;
      useAnimation = framerMotion.useAnimation;
      useMotionValue = framerMotion.useMotionValue;
      useTransform = framerMotion.useTransform;
      useSpring = framerMotion.useSpring;
      useScroll = framerMotion.useScroll;
      useVelocity = framerMotion.useVelocity;
      useMotionTemplate = framerMotion.useMotionTemplate;
      
      console.log('Framer Motion loaded successfully');
    } catch (error) {
      console.warn('Error dynamically loading framer-motion:', error);
    }
  })();
} catch (error) {
  console.warn('Error setting up framer-motion patching:', error);
}

// Default export
export default { 
  motion,
  AnimatePresence,
  useAnimation,
  useMotionValue,
  useTransform,
  useSpring,
  useScroll,
  useVelocity,
  useMotionTemplate
}; 