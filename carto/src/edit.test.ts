import { describe, it, expect } from 'vitest';
import { toggleEditMode, cycleTileBiome, setPlayerStart, setSupplies, setWidth, setHeight, setCycle } from './edit';

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

describe('setPlayerStart', () => {
  it('sets start position', () => {
    expect(setPlayerStart('#FFF:0,0:9:C::e', 0, 2)).toBe('#FFF:0,2:9:C::e');
  });

  it('throws RangeError for OOB row', () => {
    expect(() => setPlayerStart('#FFF:0,0:9:C::e', 5, 0)).toThrow(RangeError);
  });

  it('throws RangeError for OOB col', () => {
    expect(() => setPlayerStart('#FFF:0,0:9:C::e', 0, 5)).toThrow(RangeError);
  });
});

describe('setSupplies', () => {
  it('sets supplies value', () => {
    expect(setSupplies('#FFF:0,0:9:C::e', 15)).toBe('#FFF:0,0:15:C::e');
  });

  it('throws RangeError for n < 1', () => {
    expect(() => setSupplies('#FFF:0,0:9:C::e', 0)).toThrow(RangeError);
    expect(() => setSupplies('#FFF:0,0:9:C::e', -5)).toThrow(RangeError);
  });
});

describe('setWidth', () => {
  it('pads each row with F when increasing width', () => {
    expect(setWidth('#FFF,FFF:0,0:9:C::e', 5)).toBe('#FFFFF,FFFFF:0,0:9:C::e');
  });
  it('truncates each row when decreasing width', () => {
    expect(setWidth('#FFFFF:2,3:9:C::e', 3)).toBe('#FFF:0,0:9:C::e');
  });
  it('resets player to 0,0', () => {
    expect(setWidth('#FFF:2,3:9:C::e', 4)).toBe('#FFFF:0,0:9:C::e');
  });
  it('throws for n < 1', () => {
    expect(() => setWidth('#FFF:0,0:9:C::e', 0)).toThrow(RangeError);
  });
  it('throws for n > 99', () => {
    expect(() => setWidth('#FFF:0,0:9:C::e', 100)).toThrow(RangeError);
  });
});

describe('setHeight', () => {
  it('appends a row of F when increasing height', () => {
    expect(setHeight('#FFF:0,0:9:C::e', 2)).toBe('#FFF,FFF:0,0:9:C::e');
  });
  it('removes bottom row when decreasing height', () => {
    expect(setHeight('#FFF,FFF,FFF:0,0:9:C::e', 2)).toBe('#FFF,FFF:0,0:9:C::e');
  });
  it('resets player to 0,0', () => {
    expect(setHeight('#FFF,FFF:1,0:9:C::e', 3)).toBe('#FFF,FFF,FFF:0,0:9:C::e');
  });
  it('throws for n < 1', () => {
    expect(() => setHeight('#FFF:0,0:9:C::e', 0)).toThrow(RangeError);
  });
  it('throws for n > 99', () => {
    expect(() => setHeight('#FFF:0,0:9:C::e', 100)).toThrow(RangeError);
  });
});

describe('setCycle', () => {
  it('truncates cycle when shorter', () => {
    expect(setCycle('#FFF:0,0:9:CSCSC::e', 3)).toBe('#FFF:0,0:9:CSC::e');
  });
  it('pads with C when longer', () => {
    expect(setCycle('#FFF:0,0:9:CS::e', 4)).toBe('#FFF:0,0:9:CSCC::e');
  });
  it('throws for n < 1', () => {
    expect(() => setCycle('#FFF:0,0:9:C::e', 0)).toThrow(RangeError);
  });
  it('throws for n > 99', () => {
    expect(() => setCycle('#FFF:0,0:9:C::e', 100)).toThrow(RangeError);
  });
});
