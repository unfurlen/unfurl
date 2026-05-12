import { describe, it, expect } from 'vitest';
import { parseMapUrl, URLParseError } from './url.ts';

describe('parseMapUrl', () => {
  it('parses square map dimensions', () => {
    const map = parseMapUrl('#5x5');
    expect(map.width).toBe(5);
    expect(map.height).toBe(5);
  });

  it('parses non-square map dimensions', () => {
    const map = parseMapUrl('#4x6');
    expect(map.width).toBe(4);
    expect(map.height).toBe(6);
  });

  it('parses start position', () => {
    const map = parseMapUrl('#5x5:1,2');
    expect(map.player.row).toBe(1);
    expect(map.player.col).toBe(2);
  });

  it('defaults to (0,0) when no start given', () => {
    const map = parseMapUrl('#5x5');
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
