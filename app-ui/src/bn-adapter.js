// This file is a direct adapter for bn.js - using ESM imports
// It provides a BN implementation that works with Solana libraries

// BN implementation for browsers
class BN {
  constructor(value, base) {
    // Handle BN instances by copying their value
    if (value instanceof BN) {
      this.value = value.value;
      this._bytes = new Uint8Array(value._bytes);
      return;
    }
    
    // Convert input to string representation
    this.value = typeof value === 'number' ? String(value) : 
                 typeof value === 'string' ? value :
                 Array.isArray(value) ? Array.from(value).join('') :
                 value?.toString() || '0';
    
    // Handle base conversion for string inputs
    if (typeof value === 'string' && base) {
      try {
        this.value = parseInt(value, base).toString();
      } catch (e) {
        this.value = '0';
      }
    }
    
    // Add byte representation for PublicKey
    this._bytes = this._toBytes();
  }
  
  // Convert to byte array
  _toBytes() {
    const num = parseInt(this.value);
    if (isNaN(num)) return new Uint8Array(0);
    
    let hex = num.toString(16);
    if (hex.length % 2) hex = '0' + hex;
    
    const len = hex.length / 2;
    const bytes = new Uint8Array(len);
    
    for (let i = 0; i < len; i++) {
      bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    
    return bytes;
  }
  
  // Methods needed by Solana PublicKey
  get byteLength() {
    return this._bytes.length;
  }
  
  toBuffer() {
    return Buffer.from(this._bytes);
  }
  
  toArrayLike(ArrayType) {
    if (ArrayType === Buffer) {
      return this.toBuffer();
    } else if (ArrayType === Array) {
      return Array.from(this._bytes);
    } else if (ArrayType === Uint8Array) {
      return this._bytes;
    }
    return new ArrayType(this._bytes);
  }
  
  fromTwos(width) {
    // Simple implementation for two's complement
    const value = parseInt(this.value);
    if (value & (1 << (width - 1))) {
      return new BN(value - (1 << width));
    }
    return new BN(value);
  }
  
  toTwos(width) {
    // Simple implementation for two's complement
    const value = parseInt(this.value);
    if (value < 0) {
      return new BN((1 << width) + value);
    }
    return new BN(value);
  }
  
  // Basic methods needed by Solana libraries
  toString(base = 10) {
    if (base === 10) return this.value;
    try {
      return parseInt(this.value).toString(base);
    } catch (e) {
      return '0';
    }
  }
  
  toNumber() {
    try {
      return Number(this.value);
    } catch (e) {
      return 0;
    }
  }
  
  toJSON() {
    return this.toString();
  }
  
  toArray(endian, length) {
    // Simple implementation for compatibility
    if (endian === 'le') {
      return Array.from(this._bytes).reverse();
    }
    return Array.from(this._bytes);
  }
  
  add(num) {
    const other = num instanceof BN ? num.toNumber() : Number(num);
    const result = this.toNumber() + other;
    return new BN(result);
  }
  
  sub(num) {
    const other = num instanceof BN ? num.toNumber() : Number(num);
    const result = this.toNumber() - other;
    return new BN(result);
  }
  
  mul(num) {
    const other = num instanceof BN ? num.toNumber() : Number(num);
    const result = this.toNumber() * other;
    return new BN(result);
  }
  
  div(num) {
    const other = num instanceof BN ? num.toNumber() : Number(num);
    const result = Math.floor(this.toNumber() / other);
    return new BN(result);
  }
  
  // Static methods
  static isBN(obj) {
    return obj instanceof BN;
  }
  
  static min(a, b) {
    return a.toNumber() <= b.toNumber() ? a : b;
  }
  
  static max(a, b) {
    return a.toNumber() >= b.toNumber() ? a : b;
  }
}

// Export BN for use
export default BN; 