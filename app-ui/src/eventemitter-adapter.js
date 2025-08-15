// This file provides a custom adapter for EventEmitter to prevent conflicts
// between different libraries that might be using it

// Check if EventEmitter is already defined in the global scope
if (typeof window !== 'undefined' && window.EventEmitter) {
  // If it is, export the existing one
  module.exports = window.EventEmitter;
} else {
  // If not, import the original EventEmitter
  const originalEventEmitter = require('eventemitter3');
  
  // Define it in the global scope
  if (typeof window !== 'undefined') {
    window.EventEmitter = originalEventEmitter;
  }
  
  // Export it
  module.exports = originalEventEmitter;
}

// Also export as ES module
export default module.exports;
export const EventEmitter = module.exports; 