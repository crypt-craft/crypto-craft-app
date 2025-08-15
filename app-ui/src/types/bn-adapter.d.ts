declare module '*/bn-adapter.js' {
  class BN {
    constructor(value: string | number | number[] | Uint8Array | BN | null | undefined, base?: number);
    value: string;
    _bytes: Uint8Array;
    readonly byteLength: number;
    toBuffer(): Buffer;
    toArrayLike(ArrayType: typeof Buffer | typeof Array | typeof Uint8Array): Buffer | number[] | Uint8Array;
    fromTwos(width: number): BN;
    toTwos(width: number): BN;
    toString(base?: number): string;
    toNumber(): number;
    toJSON(): string;
    toArray(endian?: 'le' | 'be', length?: number): number[];
    add(num: BN | number): BN;
    sub(num: BN | number): BN;
    mul(num: BN | number): BN;
    div(num: BN | number): BN;
    static isBN(obj: any): boolean;
    static min(a: BN, b: BN): BN;
    static max(a: BN, b: BN): BN;
  }
  export default BN;
} 