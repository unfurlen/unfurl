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
  ])('throws for invalid URL: %s', (hash) => {
    expect(() => parseMapUrl(hash)).toThrow(URLParseError);
  });
});
