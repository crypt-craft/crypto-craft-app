// Global polyfills to fix common issues in the browser environment

// Fix for EventEmitter conflict
if (typeof window !== 'undefined') {
  // Create a global EventEmitter if it doesn't exist
  if (!window.EventEmitter) {
    try {
      // Import the original EventEmitter
      const EventEmitterModule = require('eventemitter3');
      
      // Define it in the global scope
      window.EventEmitter = EventEmitterModule;
      
      // Also define it as a global variable
      globalThis.EventEmitter = EventEmitterModule;
    } catch (e) {
      console.warn('Failed to load EventEmitter:', e);
    }
  }
}

// Fix for Buffer if needed
if (typeof window !== 'undefined' && !window.Buffer) {
  try {
    const BufferModule = require('buffer').Buffer;
    window.Buffer = BufferModule;
    globalThis.Buffer = BufferModule;
  } catch (e) {
    console.warn('Failed to load Buffer:', e);
  }
}

// Fix for process if needed
if (typeof window !== 'undefined' && !window.process) {
  window.process = { env: {} };
  globalThis.process = window.process;
}

// Export the polyfills
export default {
  EventEmitter: typeof window !== 'undefined' ? window.EventEmitter : null,
  Buffer: typeof window !== 'undefined' ? window.Buffer : null,
  process: typeof window !== 'undefined' ? window.process : null
}; 