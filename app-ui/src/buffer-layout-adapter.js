// This file is a direct adapter for @solana/buffer-layout
// It provides minimal implementations of the layout functions needed by Solana libraries

// Basic layout class that other layouts inherit from
export class Layout {
  constructor(span, property) {
    this.span = span;
    this.property = property;
  }
  
  decode(b, offset = 0) {
    // Basic implementation
    return null;
  }
  
  encode(src, b, offset = 0) {
    // Basic implementation
    return this.span;
  }
  
  getSpan(b, offset = 0) {
    return this.span;
  }
  
  replicate(name) {
    const copy = Object.create(Object.getPrototypeOf(this));
    Object.assign(copy, this);
    copy.property = name;
    return copy;
  }
}

// Structure for grouping layouts
export class Structure extends Layout {
  constructor(fields, property, decodePrefixes) {
    const span = fields.reduce((span, f) => span + f.span, 0);
    super(span, property);
    this.fields = fields;
    this.decodePrefixes = decodePrefixes;
  }
}

// Sequence for repeating layouts
export class Sequence extends Layout {
  constructor(elementLayout, count, property) {
    super(elementLayout.span * count, property);
    this.elementLayout = elementLayout;
    this.count = count;
  }
}

// Most commonly used layout functions
export function u8(property) {
  return new Layout(1, property);
}

export function u16(property) {
  return new Layout(2, property);
}

export function u32(property) {
  return new Layout(4, property);
}

export function u64(property) {
  return new Layout(8, property);
}

export function struct(fields, property, decodePrefixes = false) {
  return new Structure(fields, property, decodePrefixes);
}

export function seq(elementLayout, count, property) {
  return new Sequence(elementLayout, count, property);
}

export function blob(length, property) {
  return new Layout(length, property);
}

// Additional layout functions for compatibility
export const u24 = u8;
export const u40 = u8;
export const u48 = u8;
export const nu64 = u64;
export const s8 = u8;
export const s16 = u16;
export const s24 = u8;
export const s32 = u32;
export const s40 = u8;
export const s48 = u8;
export const ns64 = u64;
export const s64 = u64;
export const f32 = u32;
export const f64 = u64;
export function union(discr, fields, property) { return new Layout(8, property); }
export function unionLayoutDiscriminator(layout, property) { return layout; }
export function cstr(property) { return new Layout(1, property); }
export function utf8(span, property) { return new Layout(span, property); }
export function bits(word, msb, lsb, property) { return new Layout(word.span, property); }
export function greedy(elementLayout, property) { return new Sequence(elementLayout, Number.MAX_SAFE_INTEGER, property); }
export function offset(layout, offset, property) { return layout.replicate(property); }
export function constant(value, property) { return new Layout(0, property); }

// Additional layout classes for compatibility
export class Union extends Layout {}
export class OffsetLayout extends Layout {}
export class BitStructure extends Layout {}
export class GreedyCount extends Layout {}

// Export a default object for compatibility
const layoutModule = {
  Layout,
  Structure,
  Sequence,
  Union,
  OffsetLayout,
  BitStructure,
  GreedyCount,
  u8,
  u16,
  u24,
  u32,
  u40,
  u48,
  nu64,
  u64,
  s8,
  s16,
  s24,
  s32,
  s40,
  s48,
  ns64,
  s64,
  f32,
  f64,
  struct,
  seq,
  union,
  unionLayoutDiscriminator,
  blob,
  cstr,
  utf8,
  bits,
  greedy,
  offset,
  constant
};

export default layoutModule; 