import { describe, it, expect } from 'vitest';
import { Move, InvalidMoveError } from './move';
import { SIZE } from './grid';
import { Player } from './player';

describe('Move', () => {
  it('creates a move with valid coordinates and player X', () => {
    const move = new Move(0, 0, Player.X);
    expect(move.row).toBe(0);
    expect(move.col).toBe(0);
    expect(move.player).toBe(Player.X);
  });

  it('creates a move with valid coordinates and player O', () => {
    const move = new Move(2, 2, Player.O);
    expect(move.row).toBe(2);
    expect(move.col).toBe(2);
    expect(move.player).toBe(Player.O);
  });

  it('throws InvalidMoveError for negative row', () => {
    expect(() => new Move(-1, 0, Player.X)).toThrow(InvalidMoveError);
  });

  it('throws InvalidMoveError for row >= SIZE', () => {
    expect(() => new Move(SIZE, 0, Player.X)).toThrow(InvalidMoveError);
  });

  it('throws InvalidMoveError for negative col', () => {
    expect(() => new Move(0, -1, Player.X)).toThrow(InvalidMoveError);
  });

  it('throws InvalidMoveError for col >= SIZE', () => {
    expect(() => new Move(0, SIZE, Player.X)).toThrow(InvalidMoveError);
  });
});
