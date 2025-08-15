/// <reference types="vite/client" />

import BN from 'bn.js';

// Global declarations for Buffer and other Node.js APIs
interface Window {
  Buffer: typeof Buffer;
  BN: typeof BN;
  global: typeof globalThis;
  process: {
    env: Record<string, string | undefined>;
    browser?: boolean;
  };
}

declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
  const src: string;
  export default src;
}

declare module '*.jpg';
declare module '*.png';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';

export {}; 