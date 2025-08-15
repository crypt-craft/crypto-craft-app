/**
 * BN.js polyfill/wrapper
 * This provides a minimal BN implementation for apps that depend on it
 */

// Export a simple BN implementation that works for basic use cases
export class BN {
  constructor(value: any, base?: number | 'hex') {
    // Support various input types
    if (typeof value === 'number') {
      this.value = String(value);
    } else if (typeof value === 'string') {
      if (base === 'hex' || (typeof base === 'number' && base === 16)) {
        // Remove '0x' prefix if present
        const hexValue = value.toLowerCase().replace('0x', '');
        this.value = BigInt('0x' + hexValue).toString();
      } else if (base) {
        try {
          this.value = parseInt(value, base).toString();
        } catch (e) {
          this.value = '0';
        }
      } else {
        this.value = value;
      }
    } else if (value instanceof BN) {
      this.value = value.value;
    } else if (Array.isArray(value)) {
      // Handle byte array input
      const hexString = Array.from(value)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
      this.value = BigInt('0x' + hexString).toString();
    } else {
      this.value = '0';
    }
  }
  
  value: string;
  
  // Basic methods needed by most applications
  toString(base = 10): string {
    if (base === 10) return this.value;
    try {
      const bigIntValue = BigInt(this.value);
      if (base === 16) {
        return bigIntValue.toString(16).padStart(2, '0');
      }
      return bigIntValue.toString(base);
    } catch (e) {
      return '0';
    }
  }
  
  toNumber(): number {
    try {
      return Number(this.value);
    } catch (e) {
      return 0;
    }
  }
  
  toJSON(): string {
    return this.value;
  }
  
  toArray(endian: 'le' | 'be' = 'be', length?: number): number[] {
    try {
      let hex = BigInt(this.value).toString(16);
      if (hex.length % 2) hex = '0' + hex;
      
      const bytes = new Array(hex.length / 2);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
      }
      
      if (length) {
        while (bytes.length < length) {
          bytes[endian === 'le' ? 'push' : 'unshift'](0);
        }
        if (bytes.length > length) {
          bytes.splice(endian === 'le' ? length : 0, bytes.length - length);
        }
      }
      
      return endian === 'le' ? bytes.reverse() : bytes;
    } catch (e) {
      return [0];
    }
  }
  
  byteLength(): number {
    return Math.ceil(BigInt(this.value).toString(16).length / 2);
  }
  
  // Static methods
  static isBN(obj: any): boolean {
    return obj instanceof BN;
  }
}

// Default export for compatibility
export default BN; 