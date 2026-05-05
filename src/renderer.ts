import { Cell } from './cell.ts';

export function render(cell: Cell): HTMLElement {
  const div = document.createElement('div');
  div.className = 'cell';
  return div;
}
