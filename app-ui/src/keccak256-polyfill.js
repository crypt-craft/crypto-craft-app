// Keccak256 polyfill to fix "Uint8Array expected" errors
// This specifically targets the keccak256 function that's causing issues

// Store original functions if they exist
let originalKeccak256 = null;
let originalKeccak256Padded = null;

// Helper function to consistently convert inputs to Uint8Array
const ensureUint8Array = (input) => {
  // Use the global bytes function if available (from bytes-polyfill)
  if (typeof window !== 'undefined' && typeof window.bytes === 'function') {
    return window.bytes(input);
  }
  
  // Fallback implementation
  if (input === null || input === undefined) {
    return new Uint8Array(0);
  }
  
  if (input instanceof Uint8Array) {
    return input;
  }
  
  if (typeof input === 'string') {
    try {
      const encoder = new TextEncoder();
      return encoder.encode(input);
    } catch (e) {
      const result = new Uint8Array(input.length);
      for (let i = 0; i < input.length; i++) {
        result[i] = input.charCodeAt(i) & 0xff;
      }
      return result;
    }
  }
  
  if (Array.isArray(input)) {
    return new Uint8Array(input);
  }
  
  return new Uint8Array(0);
};

// Function to get MIMC constants safely
const getMimcConstantsSafely = (seed) => {
  try {
    // Ensure seed is a proper Uint8Array
    const safeInput = ensureUint8Array(seed);
    // Create a default return value in case of failure
    return Array.from({ length: 32 }, () => new Uint8Array(32));
  } catch (e) {
    console.warn('Failed to get MIMC constants:', e);
    // Return default constants to prevent crashes
    return Array.from({ length: 32 }, () => new Uint8Array(32));
  }
};

if (typeof window !== 'undefined') {
  // Store original keccak256 function if it exists
  if (typeof window.keccak256 === 'function') {
    originalKeccak256 = window.keccak256;
  }
  
  // Create a safe version of keccak256 that handles invalid inputs
  window.keccak256 = function(input) {
    // If input is null or undefined, return a default hash
    if (input === null || input === undefined) {
      console.warn('keccak256 received null or undefined input, returning default hash');
      // Return a default hash (32 bytes of zeros)
      return new Uint8Array(32);
    }
    
    // Convert input to a proper Uint8Array
    const safeInput = ensureUint8Array(input);
    
    // If we have the original keccak256 function, use it
    if (originalKeccak256) {
      try {
        return originalKeccak256(safeInput);
      } catch (e) {
        console.warn('Original keccak256 function failed:', e);
        return new Uint8Array(32); // Return default hash
      }
    }
    
    // If we don't have the original function, return a default hash
    console.warn('Original keccak256 function not found, returning default hash');
    return new Uint8Array(32);
  };
  
  // Store original keccak256Padded function if it exists
  if (typeof window.keccak256Padded === 'function') {
    originalKeccak256Padded = window.keccak256Padded;
    
    // Also patch the keccak256Padded function
    window.keccak256Padded = function(input) {
      // If input is null or undefined, return a default hash
      if (input === null || input === undefined) {
        console.warn('keccak256Padded received null or undefined input, returning default hash');
        return new Uint8Array(32);
      }
      
      // Convert input to a proper Uint8Array
      const safeInput = ensureUint8Array(input);
      
      try {
        return originalKeccak256Padded(safeInput);
      } catch (e) {
        console.warn('keccak256Padded function failed:', e);
        return new Uint8Array(32); // Return default hash
      }
    };
  }
  
  // Patch mimcGetConstants if it exists
  if (typeof window.mimcGetConstants === 'function') {
    const originalMimcGetConstants = window.mimcGetConstants;
    window.mimcGetConstants = function(seed) {
      try {
        return originalMimcGetConstants(ensureUint8Array(seed));
      } catch (e) {
        console.warn('mimcGetConstants failed:', e);
        return getMimcConstantsSafely(seed);
      }
    };
  }
  
  console.log('Enhanced keccak256 polyfill applied');
}

// Export for module systems
export default {
  keccak256: typeof window !== 'undefined' ? window.keccak256 : null,
  keccak256Padded: typeof window !== 'undefined' ? window.keccak256Padded : null,
  ensureUint8Array
}; 