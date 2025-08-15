// Type declarations for global variables

import BN from 'bn.js';
import { Buffer } from 'buffer';
import EventEmitter from 'eventemitter3';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    BN: typeof BN;
    EventEmitter: typeof EventEmitter;
  }
}

export {}; 