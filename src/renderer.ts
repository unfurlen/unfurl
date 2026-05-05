import { Cell } from './cell.ts';
import { Grid } from './grid.ts';

export function renderCell(cell: Cell): HTMLElement {
  const div = document.createElement('div');
  div.className = 'cell';
  return div;
}

export function renderGrid(grid: Grid): HTMLElement {
  const container = document.createElement('div');
  container.className = 'grid';

  for (let row = 0; row < grid.height; row++) {
    for (let col = 0; col < grid.width; col++) {
      container.appendChild(renderCell(grid.getCell(row, col)));
    }
  }

  return container;
}
