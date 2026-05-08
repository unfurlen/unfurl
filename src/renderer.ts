import { Cell } from './cell.ts';
import { Grid, SIZE } from './grid.ts';
import { Player } from './player.ts';
import { buildHash } from './url.ts';

export function renderCell(cell: Cell): HTMLElement {
  const div = document.createElement('div');
  div.className = 'cell';
  if (cell.player) {
    div.textContent = cell.player;
  }
  return div;
}

export function renderGrid(grid: Grid): HTMLElement {
  const container = document.createElement('div');
  container.className = 'grid';

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const index = row * SIZE + col;
      const cell = grid.getCell(row, col);
      const cellEl = renderCell(cell);
      if (!cell.player && !grid.winner()) {
        cellEl.addEventListener('click', () => {
          location.hash = buildHash(location.hash, index);
        });
      }
      container.appendChild(cellEl);
    }
  }

  return container;
}

export function renderResult(winner: Player | null): HTMLElement | null {
  if (!winner) return null;
  const div = document.createElement('div');
  div.className = 'result';
  div.textContent = `${winner} wins!`;
  return div;
}

export function renderShareButton(): HTMLElement {
  const button = document.createElement('button');
  button.className = 'share';
  button.textContent = 'Share';
  button.addEventListener('click', async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  });
  return button;
}
