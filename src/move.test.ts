import { describe, it, expect } from 'vitest';
import { Move, InvalidMoveError } from './move.ts';
import { SIZE } from './grid.ts';

describe('Move', () => {
  it('creates a move with valid coordinates and player', () => {
    const move = new Move(0, 0, 'X');
    expect(move.row).toBe(0);
    expect(move.col).toBe(0);
    expect(move.player).toBe('X');
  });

  it('creates a move for O player', () => {
    const move = new Move(2, 2, 'O');
    expect(move.player).toBe('O');
  });

  it('throws InvalidMoveError for negative row', () => {
    expect(() => new Move(-1, 0, 'X')).toThrow(InvalidMoveError);
  });

  it('throws InvalidMoveError for row >= SIZE', () => {
    expect(() => new Move(SIZE, 0, 'X')).toThrow(InvalidMoveError);
  });

  it('throws InvalidMoveError for negative col', () => {
    expect(() => new Move(0, -1, 'X')).toThrow(InvalidMoveError);
  });

  it('throws InvalidMoveError for col >= SIZE', () => {
    expect(() => new Move(0, SIZE, 'X')).toThrow(InvalidMoveError);
  });

  it('throws InvalidMoveError for invalid player', () => {
    expect(() => new Move(1, 1, 'Z' as any)).toThrow(InvalidMoveError);
  });
});
