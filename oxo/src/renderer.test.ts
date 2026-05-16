import { describe, it, expect, vi } from 'vitest';
import { Cell } from './cell';
import { Grid } from './grid';
import { Player } from './player';
import { renderCell, renderGrid, renderResult, renderControls } from './renderer';

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
  it('returns empty element when there is no winner', () => {
    const el = renderResult(null);
    expect(el.textContent).toBe('');
  });

  it('returns element with winner text', () => {
    const el = renderResult(Player.X);
    expect(el!.textContent).toBe('X wins!');
  });
});

describe('renderControls', () => {
  it('renders back, forward, and share buttons', () => {
    const el = renderControls('#0', '#01', vi.fn());
    expect(el.querySelector('.back')).toBeTruthy();
    expect(el.querySelector('.forward')).toBeTruthy();
    expect(el.querySelector('.share')).toBeTruthy();
  });

  it('clicking back sets location.hash to backUrl', () => {
    location.hash = '';
    const el = renderControls('#0', null, vi.fn());
    const back = el.querySelector('.back') as HTMLButtonElement;
    back.click();
    expect(location.hash).toBe('#0');
  });

  it('clicking forward sets location.hash to forwardUrl', () => {
    location.hash = '';
    const el = renderControls(null, '#01', vi.fn());
    const forward = el.querySelector('.forward') as HTMLButtonElement;
    forward.click();
    expect(location.hash).toBe('#01');
  });

  it('disables back when backUrl is null', () => {
    const el = renderControls(null, '#01', vi.fn());
    const back = el.querySelector('.back') as HTMLButtonElement;
    expect(back.disabled).toBe(true);
  });

  it('disables forward when forwardUrl is null', () => {
    const el = renderControls('#0', null, vi.fn());
    const forward = el.querySelector('.forward') as HTMLButtonElement;
    expect(forward.disabled).toBe(true);
  });
});
