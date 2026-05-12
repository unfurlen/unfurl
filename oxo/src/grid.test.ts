import { describe, it, expect } from 'vitest';
import { Grid, InvalidPositionError } from './grid.ts';
import { Cell } from './cell.ts';
import { Move } from './move.ts';
import { Player } from './player.ts';

describe('Grid', () => {
  it.each([
    [0, 0],
    [2, 0],
    [0, 2],
    [2, 2],
  ])('returns a cell at position (%i, %i)', (row, col) => {
    const grid = new Grid();
    expect(grid.getCell(row, col)).toBeInstanceOf(Cell);
  });

  it.each([
    [-1, 0],
    [0, -1],
    [3, 0],
    [0, 3],
  ])('throws InvalidPositionError for (%i, %i)', (row, col) => {
    const grid = new Grid();
    expect(() => grid.getCell(row, col)).toThrow(InvalidPositionError);
  });

  it('applies a move and marks the cell', () => {
    const grid = new Grid();
    grid.applyMove(new Move(0, 0, Player.X));
    expect(grid.getCell(0, 0).player).toBe(Player.X);
  });

  it('returns null for empty grid winner', () => {
    const grid = new Grid();
    expect(grid.winner()).toBeNull();
  });

  it('detects X winning on top row', () => {
    const grid = new Grid();
    grid.applyMove(new Move(0, 0, Player.X));
    grid.applyMove(new Move(0, 1, Player.X));
    grid.applyMove(new Move(0, 2, Player.X));
    expect(grid.winner()).toBe(Player.X);
  });
});
