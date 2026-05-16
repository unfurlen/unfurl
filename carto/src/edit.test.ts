import { describe, it, expect } from 'vitest';
import { toggleEditMode, cycleTileBiome } from './edit.ts';

describe('toggleEditMode', () => {
  it('adds edit mode to bare URL (4 parts)', () => {
    expect(toggleEditMode('#FFF:0,0:9:C')).toBe('#FFF:0,0:9:C::e');
  });

  it('adds edit mode stripping existing path', () => {
    expect(toggleEditMode('#FFF:0,0:9:C:NESE')).toBe('#FFF:0,0:9:C::e');
  });

  it('removes edit mode from ::e hash', () => {
    expect(toggleEditMode('#FFF:0,0:9:C::e')).toBe('#FFF:0,0:9:C');
  });

  it('removes edit mode preserving non-empty path', () => {
    expect(toggleEditMode('#FFF:0,0:9:C:NESE:e')).toBe('#FFF:0,0:9:C:NESE');
  });
});

describe('cycleTileBiome', () => {
  it('cycles F→W at tile (0,0)', () => {
    expect(cycleTileBiome('#FFF:0,0:9:C::e', 0, 0)).toBe('#WFF:0,0:9:C::e');
  });

  it('cycles W→M at tile (0,1)', () => {
    expect(cycleTileBiome('#FWF:0,0:9:C::e', 0, 1)).toBe('#FMF:0,0:9:C::e');
  });

  it('cycles M→F at tile (0,0)', () => {
    expect(cycleTileBiome('#MFF:0,0:9:C::e', 0, 0)).toBe('#FFF:0,0:9:C::e');
  });

  it('strips existing path', () => {
    expect(cycleTileBiome('#FFF:0,0:9:C:NESE', 0, 1)).toBe('#FWF:0,0:9:C::e');
  });

  it('works with multi-row grid', () => {
    expect(cycleTileBiome('#FFF,FFF:0,0:9:C::e', 1, 0)).toBe('#FFF,WFF:0,0:9:C::e');
  });

  it('throws RangeError for OOB row', () => {
    expect(() => cycleTileBiome('#FFF:0,0:9:C::e', 5, 0)).toThrow(RangeError);
  });

  it('throws RangeError for OOB col', () => {
    expect(() => cycleTileBiome('#FFF:0,0:9:C::e', 0, 5)).toThrow(RangeError);
  });
});
