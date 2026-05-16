import { describe, it, expect } from 'vitest';
import { parseHash, buildHash, URLParseError, getCurrHistory, getFullHistory, getBackUrl, getForwardUrl } from './url';
import { Move } from './move';
import { Player } from './player';

describe('parseHash', () => {
  it('returns empty array for empty hash', () => {
    expect(parseHash('')).toEqual([]);
  });

  it('parses a single move as X at (0, 0)', () => {
    const moves = parseHash('#0');
    expect(moves).toHaveLength(1);
    expect(moves[0]).toEqual(new Move(0, 0, 'X'));
  });

  it('parses multiple moves with alternating players', () => {
    const moves = parseHash('#0214');
    expect(moves).toEqual([
      new Move(0, 0, 'X'),
      new Move(0, 2, 'O'),
      new Move(0, 1, 'X'),
      new Move(1, 1, 'O'),
    ]);
  });

  it('throws URLParseError for non-numeric hash', () => {
    expect(() => parseHash('#abc')).toThrow(URLParseError);
  });

  it('throws URLParseError for out of bounds index', () => {
    expect(() => parseHash('#9')).toThrow(URLParseError);
  });

  it('throws URLParseError for mixed valid and invalid chars', () => {
    expect(() => parseHash('#0a')).toThrow(URLParseError);
  });
});

describe('buildHash', () => {
  it('returns hash with index from empty string', () => {
    expect(buildHash('', 0)).toBe('#0');
  });

  it('appends to existing hash', () => {
    expect(buildHash('#02', 1)).toBe('#021');
  });
});

describe('getCurrHistory', () => {
  it('returns empty array for empty moves', () => {
    expect(getCurrHistory([])).toEqual([]);
  });

  it('returns indices from moves', () => {
    expect(getCurrHistory([
      new Move(0, 0, Player.X),
      new Move(0, 2, Player.O),
      new Move(0, 1, Player.X),
      new Move(1, 1, Player.O),
    ])).toEqual([0, 2, 1, 4]);
  });
});

describe('getFullHistory', () => {
  it('preserves fullHistory when currHistory is a prefix', () => {
    expect(getFullHistory([0, 1, 2, 3], [0, 1])).toEqual([0, 1, 2, 3]);
  });

  it('resets when currHistory diverges', () => {
    expect(getFullHistory([0, 1, 2, 3], [0, 1, 4])).toEqual([0, 1, 4]);
  });

  it('preserves fullHistory when currHistory is equal', () => {
    expect(getFullHistory([0, 1, 2], [0, 1, 2])).toEqual([0, 1, 2]);
  });

  it('preserves fullHistory when currHistory is empty (back to root)', () => {
    expect(getFullHistory([0, 1, 2], [])).toEqual([0, 1, 2]);
  });

  it('resets when fullHistory is empty and currHistory is not', () => {
    expect(getFullHistory([], [0, 1])).toEqual([0, 1]);
  });
});

describe('getBackUrl', () => {
  it('returns null for empty history', () => {
    expect(getBackUrl([])).toBeNull();
  });

  it('returns hash without last move', () => {
    expect(getBackUrl([0, 1, 2])).toBe('#01');
  });

  it('returns # for single move', () => {
    expect(getBackUrl([0])).toBe('#');
  });
});

describe('getForwardUrl', () => {
  it('returns null when at tip of fullHistory', () => {
    expect(getForwardUrl([0, 1, 2], [0, 1, 2])).toBeNull();
  });

  it('returns next step from fullHistory', () => {
    expect(getForwardUrl([0, 1], [0, 1, 2, 3])).toBe('#012');
  });

  it('returns null when both empty', () => {
    expect(getForwardUrl([], [])).toBeNull();
  });

  it('returns null when fullHistory is shorter', () => {
    expect(getForwardUrl([0, 1, 2], [0])).toBeNull();
  });
});
