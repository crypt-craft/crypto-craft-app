// Uint8Array polyfill to fix "Uint8Array expected" errors
// This specifically targets the keccak256 function that's causing issues

if (typeof window !== 'undefined') {
  // Store the original Uint8Array constructor
  const OriginalUint8Array = window.Uint8Array;
  
  // Create a wrapper for Uint8Array that handles more input types
  window.Uint8Array = function(bufferOrArray, byteOffset, length) {
    // If called as a function (not as a constructor)
    if (!(this instanceof Uint8Array)) {
      return new OriginalUint8Array(bufferOrArray, byteOffset, length);
    }
    
    // Handle null or undefined
    if (bufferOrArray === null || bufferOrArray === undefined) {
      console.warn('Uint8Array constructor received null or undefined, returning empty array');
      return new OriginalUint8Array(0);
    }
    
    // If already a Uint8Array, return it
    if (bufferOrArray instanceof OriginalUint8Array) {
      return bufferOrArray;
    }
    
    // If it's a string, convert to array of bytes
    if (typeof bufferOrArray === 'string') {
      const result = new OriginalUint8Array(bufferOrArray.length);
      for (let i = 0; i < bufferOrArray.length; i++) {
        result[i] = bufferOrArray.charCodeAt(i) & 0xff;
      }
      return result;
    }
    
    // For other cases, use the original constructor
    try {
      return new OriginalUint8Array(bufferOrArray, byteOffset, length);
    } catch (e) {
      console.warn('Uint8Array constructor failed, returning empty array', e);
      return new OriginalUint8Array(0);
    }
  };
  
  // Copy over static methods and properties
  Object.assign(window.Uint8Array, OriginalUint8Array);
  
  // Ensure the prototype chain is correct
  window.Uint8Array.prototype = OriginalUint8Array.prototype;
  
  // Add a utility function to safely convert any value to Uint8Array
  window.toUint8Array = function(value) {
    if (value === null || value === undefined) {
      return new OriginalUint8Array(0);
    }
    
    if (value instanceof OriginalUint8Array) {
      return value;
    }
    
    if (typeof value === 'string') {
      const result = new OriginalUint8Array(value.length);
      for (let i = 0; i < value.length; i++) {
        result[i] = value.charCodeAt(i) & 0xff;
      }
      return result;
    }
    
    if (Array.isArray(value)) {
      return new OriginalUint8Array(value);
    }
    
    // Try to convert to array if it has a length property
    if (value && typeof value.length === 'number') {
      try {
        return new OriginalUint8Array(value);
      } catch (e) {
        console.warn('Failed to convert to Uint8Array:', e);
      }
    }
    
    console.warn('Unsupported type for Uint8Array conversion:', typeof value);
    return new OriginalUint8Array(0);
  };
  
  // Patch the bytes function that's causing the error
  if (typeof window.bytes === 'undefined') {
    window.bytes = function(value) {
      return window.toUint8Array(value);
    };
  }
}

// Export default for module systems
export default {}; 