// Crypto polyfill for browser environment
// This fixes issues with libraries expecting Node.js crypto functionality

if (typeof window !== 'undefined') {
  // Ensure proper Uint8Array conversions
  const originalFrom = Uint8Array.from;
  const originalUint8Array = window.Uint8Array;
  
  // Safe conversion utility function
  const toBytes = function(value) {
    if (value === null || value === undefined) {
      return new Uint8Array(0);
    }
    
    if (value instanceof Uint8Array) {
      return value;
    }
    
    if (typeof value === 'string') {
      const encoder = new TextEncoder();
      return encoder.encode(value);
    }
    
    if (Array.isArray(value)) {
      return new Uint8Array(value);
    }
    
    // Try to handle BN.js objects
    if (value && typeof value.toArray === 'function') {
      try {
        return new Uint8Array(value.toArray());
      } catch (e) {
        console.warn('Failed to convert from toArray:', e);
      }
    }
    
    return new Uint8Array(0);
  };
  
  // Make toBytes available globally
  window.toBytes = toBytes;
  
  // Override Uint8Array.from to handle more input types
  Uint8Array.from = function(source, mapFn, thisArg) {
    // If source is null or undefined, create an empty array
    if (source === null || source === undefined) {
      console.warn('Uint8Array.from received null or undefined, returning empty array');
      return new Uint8Array(0);
    }
    
    // If source is already a Uint8Array, return it directly
    if (source instanceof Uint8Array) {
      return mapFn ? Array.from(source, mapFn, thisArg) : source;
    }
    
    // If source is a string, convert it using TextEncoder
    if (typeof source === 'string') {
      const encoder = new TextEncoder();
      const result = encoder.encode(source);
      return mapFn ? Array.from(result, mapFn, thisArg) : result;
    }
    
    // For other cases, use the original implementation
    try {
      return originalFrom.call(this, source, mapFn, thisArg);
    } catch (e) {
      console.warn('Uint8Array.from conversion failed, returning empty array', e);
      return new Uint8Array(0);
    }
  };
  
  // Add a global bytes function that handles any input type safely
  window.bytes = function(value) {
    return toBytes(value);
  };
  
  // Fix keccak256 related functions
  if (typeof window.keccak256 === 'function') {
    const originalKeccak256 = window.keccak256;
    window.keccak256 = function(input) {
      try {
        const bytes = toBytes(input);
        return originalKeccak256(bytes);
      } catch (e) {
        console.warn('keccak256 failed:', e);
        return new Uint8Array(32); // Return empty hash on failure
      }
    };
  }
  
  // Add a utility function for other crypto operations
  window.ensureUint8Array = function(value) {
    return toBytes(value);
  };
  
  console.log('Advanced crypto polyfill applied');
}

// Export default for module systems
export default {}; 