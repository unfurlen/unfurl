import { describe, it, expect, vi } from 'vitest';
import { Cell } from './cell.ts';
import { Grid } from './grid.ts';
import { Player } from './player.ts';
import { renderCell, renderGrid, renderResult, renderControls } from './renderer.ts';

describe('renderCell', () => {
  it('renders an empty cell', () => {
    const cell = new Cell();
    const result = renderCell(cell);
    expect(result.classList.contains('cell')).toBe(true);
    expect(result.textContent).toBe('');
  });

  it('renders a cell with the player symbol', () => {
    const cell = new Cell(Player.X);
    const result = renderCell(cell);
    expect(result.textContent).toBe(Player.X);
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

describe('renderResult', () => {
  it('returns null when there is no winner', () => {
    expect(renderResult(null)).toBeNull();
  });

  it('returns element with winner text', () => {
    const el = renderResult(Player.X);
    expect(el!.textContent).toBe('X wins!');
  });
});

describe('renderControls', () => {
  it('renders back, forward, and share buttons', () => {
    const el = renderControls(vi.fn());
    expect(el.querySelector('.back')).toBeTruthy();
    expect(el.querySelector('.forward')).toBeTruthy();
    expect(el.querySelector('.share')).toBeTruthy();
  });
});
