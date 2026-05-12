import { describe, it, expect } from 'vitest';
import { Direction } from './map.ts';
import { parseMapUrl, buildMapUrl, URLParseError } from './url.ts';

describe('parseMapUrl', () => {
  it('parses square map dimensions', () => {
    const { map } = parseMapUrl('#5x5');
    expect(map.width).toBe(5);
    expect(map.height).toBe(5);
  });

  it('parses non-square map dimensions', () => {
    const { map } = parseMapUrl('#4x6');
    expect(map.width).toBe(4);
    expect(map.height).toBe(6);
  });

  it('parses start position', () => {
    const { map } = parseMapUrl('#5x5:1,2');
    expect(map.player.row).toBe(1);
    expect(map.player.col).toBe(2);
  });

  it('defaults to (0,0) when no start given', () => {
    const { map } = parseMapUrl('#5x5');
    expect(map.player.row).toBe(0);
    expect(map.player.col).toBe(0);
  });

  it('throws for empty hash', () => {
    expect(() => parseMapUrl('')).toThrow(URLParseError);
  });

  it('throws for hash with only #', () => {
    expect(() => parseMapUrl('#')).toThrow(URLParseError);
  });

  it.each([
    ['#axb'],
    ['#-1x5'],
    ['#2.5x3'],
    ['#x5'],
    ['#5x'],
    ['#5'],
  ])('throws for invalid dimensions: %s', (hash) => {
    expect(() => parseMapUrl(hash)).toThrow(URLParseError);
  });

  it.each([
    ['#5x5:1'],
    ['#5x5:a,b'],
    ['#5x5:-1,0'],
    ['#5x5:0,-1'],
    ['#5x5:1.5,2'],
    ['#5x5:1,2.5'],
  ])('throws for invalid start: %s', (hash) => {
    expect(() => parseMapUrl(hash)).toThrow(URLParseError);
  });
});

describe('parseMapUrl path', () => {
  it('parses path from URL', () => {
    const { path } = parseMapUrl('#5x5:0,0:NESE');
    expect(path).toEqual([Direction.N, Direction.E, Direction.S, Direction.E]);
  });

  it('defaults to empty path when no colon after start', () => {
    const { path } = parseMapUrl('#5x5:0,0');
    expect(path).toEqual([]);
  });

  it('defaults to empty path when path segment is empty', () => {
    const { path } = parseMapUrl('#5x5:0,0:');
    expect(path).toEqual([]);
  });

  it.each([
    '#5x5:0,0:X',
    '#5x5:0,0:NE1W',
    '#5x5:0,0:nesw',
  ])('throws for invalid char in path: %s', (hash) => {
    expect(() => parseMapUrl(hash)).toThrow(URLParseError);
  });
});

describe('buildMapUrl', () => {
  it('appends direction to hash with start but no path', () => {
    expect(buildMapUrl('#5x5:0,0', Direction.N)).toBe('#5x5:0,0:N');
  });

  it('appends direction to existing path', () => {
    expect(buildMapUrl('#5x5:0,0:NE', Direction.S)).toBe('#5x5:0,0:NES');
  });

  it('appends direction to hash with just dimensions', () => {
    expect(buildMapUrl('#5x5', Direction.E)).toBe('#5x5:0,0:E');
  });

  it('appends direction to hash with trailing colon', () => {
    expect(buildMapUrl('#5x5:0,0:', Direction.W)).toBe('#5x5:0,0:W');
  });
});
