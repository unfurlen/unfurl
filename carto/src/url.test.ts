import { describe, it, expect } from 'vitest';
import { Direction } from './map.ts';
import { Biome } from './biome.ts';
import { parseMapUrl, buildMapUrl, getFullHistory, getBackUrl, getForwardUrl, URLParseError } from './url.ts';

describe('parseMapUrl', () => {
  it('parses biome grid', () => {
    const { map } = parseMapUrl('#FFF,FFF,FWF:1,1:9');
    expect(map.width).toBe(3);
    expect(map.height).toBe(3);
    expect(map.getTile(2, 1).biome).toBe(Biome.Water);
    expect(map.getTile(1, 2).biome).toBe(Biome.Field);
  });

  it('places player at start position', () => {
    const { map } = parseMapUrl('#FFF,FFF,FFF:1,2:9');
    expect(map.player.row).toBe(1);
    expect(map.player.col).toBe(2);
  });

  it('parses step limit', () => {
    const { map } = parseMapUrl('#FFF,FFF,FFF:0,0:7');
    expect(map.supplies).toBe(7);
  });

  it('throws for empty hash', () => {
    expect(() => parseMapUrl('')).toThrow(URLParseError);
  });

  it('throws for hash with only #', () => {
    expect(() => parseMapUrl('#')).toThrow(URLParseError);
  });

  it.each([
    '#FFF,FFF,FFX:0,0:9',
    '#FFF,FFF,FFx:0,0:9',
  ])('throws for invalid biome char: %s', (hash) => {
    expect(() => parseMapUrl(hash)).toThrow(URLParseError);
  });

  it('throws for jagged biome rows', () => {
    expect(() => parseMapUrl('#FFF,FF:0,0:9')).toThrow(URLParseError);
  });

  it('throws when no start position', () => {
    expect(() => parseMapUrl('#FFF,FFF,FFF:9')).toThrow(URLParseError);
  });

  it.each([
    '#FFF,FFF,FFF:',
    '#FFF,FFF,FFF:0,0',
    '#FFF,FFF,FFF:0,0:',
    '#FFF,FFF,FFF:0,0:a',
    '#FFF,FFF,FFF:0,0:-1',
    '#FFF,FFF,FFF:0,0:1.5',
    '#FFF,FFF,FFF:0,0:0',
  ])('throws for invalid/missing start or limit: %s', (hash) => {
    expect(() => parseMapUrl(hash)).toThrow(URLParseError);
  });
});

describe('parseMapUrl path', () => {
  it('parses path from URL', () => {
    const { path } = parseMapUrl('#FFF,FFF,FFF:0,0:9:NESE');
    expect(path).toEqual([Direction.N, Direction.E, Direction.S, Direction.E]);
  });

  it('defaults to empty path when no path segment', () => {
    const { path } = parseMapUrl('#FFF,FFF,FFF:0,0:9');
    expect(path).toEqual([]);
  });

  it('defaults to empty path when path segment is empty', () => {
    const { path } = parseMapUrl('#FFF,FFF,FFF:0,0:9:');
    expect(path).toEqual([]);
  });

  it.each([
    '#FFF,FFF,FFF:0,0:9:X',
    '#FFF,FFF,FFF:0,0:9:NE1W',
    '#FFF,FFF,FFF:0,0:9:nesw',
  ])('throws for invalid char in path: %s', (hash) => {
    expect(() => parseMapUrl(hash)).toThrow(URLParseError);
  });
});

describe('buildMapUrl', () => {
  it('appends direction to hash with start and limit but no path', () => {
    expect(buildMapUrl('#FFF,FFF,FFF:0,0:9', Direction.N)).toBe('#FFF,FFF,FFF:0,0:9:N');
  });

  it('appends direction to existing path', () => {
    expect(buildMapUrl('#FFF,FFF,FFF:0,0:9:NE', Direction.S)).toBe('#FFF,FFF,FFF:0,0:9:NES');
  });

  it('appends direction to hash with trailing colon', () => {
    expect(buildMapUrl('#FFF,FFF,FFF:0,0:9:', Direction.W)).toBe('#FFF,FFF,FFF:0,0:9:W');
  });
});

describe('getFullHistory', () => {
  it('returns fullHistory when currHistory is a prefix', () => {
    const full: Direction[] = [Direction.N, Direction.E, Direction.S];
    const curr: Direction[] = [Direction.N, Direction.E];
    expect(getFullHistory(full, curr)).toBe(full);
  });

  it('returns currHistory when divergent', () => {
    const full: Direction[] = [Direction.N, Direction.E, Direction.S];
    const curr: Direction[] = [Direction.N, Direction.W];
    expect(getFullHistory(full, curr)).toEqual([Direction.N, Direction.W]);
  });

  it('returns currHistory when fullHistory is empty', () => {
    const full: Direction[] = [];
    const curr: Direction[] = [Direction.N];
    expect(getFullHistory(full, curr)).toEqual([Direction.N]);
  });
});

describe('getBackUrl', () => {
  it('returns null when currHistory is empty', () => {
    expect(getBackUrl('#FFF,FFF,FFF:1,1', [])).toBeNull();
  });

  it('removes last direction from path', () => {
    expect(getBackUrl('#FFF,FFF,FFF:1,1', [Direction.N, Direction.E])).toBe('#FFF,FFF,FFF:1,1:N');
  });

  it('returns empty path after single move', () => {
    expect(getBackUrl('#FFF,FFF,FFF:1,1', [Direction.N])).toBe('#FFF,FFF,FFF:1,1:');
  });
});

describe('getForwardUrl', () => {
  it('returns null when currHistory equals fullHistory', () => {
    const full: Direction[] = [Direction.N, Direction.E];
    const curr: Direction[] = [Direction.N, Direction.E];
    expect(getForwardUrl('#FFF,FFF,FFF:1,1', curr, full)).toBeNull();
  });

  it('returns next direction from fullHistory', () => {
    const full: Direction[] = [Direction.N, Direction.E, Direction.S];
    const curr: Direction[] = [Direction.N, Direction.E];
    expect(getForwardUrl('#FFF,FFF,FFF:1,1', curr, full)).toBe('#FFF,FFF,FFF:1,1:NES');
  });

  it('returns first direction when currHistory is empty', () => {
    const full: Direction[] = [Direction.N];
    const curr: Direction[] = [];
    expect(getForwardUrl('#FFF,FFF,FFF:1,1', curr, full)).toBe('#FFF,FFF,FFF:1,1:N');
  });
});
