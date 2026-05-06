import { describe, it, expect } from 'vitest';
import { parseHash, Move } from './url.ts';

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
});
