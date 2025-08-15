// This script fixes the EventEmitter conflict by ensuring only one instance exists

// Check if EventEmitter is already defined in the global scope
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

// Export the EventEmitter
export default window?.EventEmitter; 