// Bytes polyfill to fix "Uint8Array expected" errors
// This specifically targets the bytes function that's causing issues

// Create bytes function for use in this module
const bytesFunction = function(value) {
  // If value is null or undefined, return an empty array
  if (value === null || value === undefined) {
    console.warn('bytes function received null or undefined, returning empty array');
    return new Uint8Array(0);
  }
  
  // If value is already a Uint8Array, return it
  if (value instanceof Uint8Array) {
    return value;
  }
  
  // If value is an ArrayBuffer, wrap it in a Uint8Array
  if (value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  }
  
  // If value is a string, convert it using TextEncoder for proper UTF-8 handling
  if (typeof value === 'string') {
    try {
      const encoder = new TextEncoder();
      return encoder.encode(value);
    } catch (e) {
      // Fallback for older browsers
      const result = new Uint8Array(value.length);
      for (let i = 0; i < value.length; i++) {
        result[i] = value.charCodeAt(i) & 0xff;
      }
      return result;
    }
  }
  
  // If value is an array, convert it to Uint8Array
  if (Array.isArray(value)) {
    return new Uint8Array(value);
  }
  
  // If value is a Buffer object
  if (value && typeof value === 'object' && value.constructor && value.constructor.name === 'Buffer') {
    try {
      return new Uint8Array(value.buffer || value);
    } catch (e) {
      console.warn('Failed to convert Buffer to Uint8Array:', e);
    }
  }
  
  // If value has a _bytes property (like BN objects), use that
  if (value && value._bytes && value._bytes instanceof Uint8Array) {
    return value._bytes;
  }
  
  // If value has a toArray or toBytes method, try to use it
  if (value && typeof value.toArray === 'function') {
    try {
      const array = value.toArray();
      if (Array.isArray(array)) {
        return new Uint8Array(array);
      }
    } catch (e) {
      console.warn('Failed to call toArray method:', e);
    }
  }
  
  if (value && typeof value.toBytes === 'function') {
    try {
      return value.toBytes();
    } catch (e) {
      console.warn('Failed to call toBytes method:', e);
    }
  }
  
  // If value has a valueOf method that returns a number, create a single-element Uint8Array
  if (value && typeof value.valueOf === 'function' && typeof value.valueOf() === 'number') {
    return new Uint8Array([value.valueOf() & 0xff]);
  }
  
  // If all else fails, log the type and return an empty array
  console.warn('Unsupported type for bytes function:', typeof value, value);
  return new Uint8Array(0);
};

if (typeof window !== 'undefined') {
  // Create a safe version of the bytes function
  window.bytes = bytesFunction;
  
  // Add to window.Object to make it globally available
  if (!Object.bytes) {
    Object.bytes = window.bytes;
  }
  
  console.log('Enhanced bytes polyfill applied');
}

// Export the bytes function for module imports
export default typeof window !== 'undefined' && window.bytes ? window.bytes : bytesFunction; 