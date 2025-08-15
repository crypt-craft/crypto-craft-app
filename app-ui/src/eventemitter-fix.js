// This script fixes the EventEmitter conflict by ensuring only one instance exists

// Create a global EventEmitter if it doesn't exist
if (typeof window !== 'undefined' && !window.EventEmitter) {
  // Define a simple EventEmitter implementation
  window.EventEmitter = function() {
    this._events = {};
  };
  
  // Add basic EventEmitter methods
  window.EventEmitter.prototype.on = function(event, listener) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(listener);
    return this;
  };
  
  window.EventEmitter.prototype.emit = function(event, ...args) {
    if (this._events[event]) {
      this._events[event].forEach(listener => listener.apply(this, args));
    }
    return this;
  };
  
  window.EventEmitter.prototype.removeListener = function(event, listener) {
    if (this._events[event]) {
      this._events[event] = this._events[event].filter(l => l !== listener);
    }
    return this;
  };
  
  window.EventEmitter.prototype.removeAllListeners = function(event) {
    if (event) {
      this._events[event] = [];
    } else {
      this._events = {};
    }
    return this;
  };
}

// Also define it as a global variable
if (typeof globalThis !== 'undefined') {
  globalThis.EventEmitter = window?.EventEmitter;
} 