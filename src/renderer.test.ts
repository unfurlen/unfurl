import { describe, it, expect } from 'vitest';
import { Cell } from './cell.ts';
import { Grid } from './grid.ts';
import { renderCell, renderGrid } from './renderer.ts';

describe('renderCell', () => {
  it('renders an empty cell', () => {
    const cell = new Cell();
    const result = renderCell(cell);
    expect(result.classList.contains('cell')).toBe(true);
  });
});

describe('renderGrid', () => {
  it('renders a grid with 9 cells', () => {
    const grid = new Grid();
    const result = renderGrid(grid);
    expect(result.classList.contains('grid')).toBe(true);
    expect(result.querySelectorAll('.cell').length).toBe(9);
  });
});
