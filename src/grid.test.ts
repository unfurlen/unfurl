import { describe, it, expect } from 'vitest';
import { Grid, InvalidPositionError } from './grid.ts';
import { Cell } from './cell.ts';

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
});
