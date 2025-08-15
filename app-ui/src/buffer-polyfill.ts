// Import the real Buffer implementation
import { Buffer as BufferOriginal } from 'buffer';

// Make sure Buffer is globally available
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || BufferOriginal;
  globalThis.Buffer = window.Buffer;
}

// Export a proper Buffer for direct import
export const Buffer = BufferOriginal; 