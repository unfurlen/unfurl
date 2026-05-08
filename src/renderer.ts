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

export function renderResult(winner: Player | null): HTMLElement {
  const div = document.createElement('div');
  div.className = 'result';
  if (winner) {
    div.textContent = `${winner} wins!`;
  }
  return div;
}

export function renderControls(onShare: () => void): HTMLElement {
  const container = document.createElement('div');
  container.className = 'controls';

  const back = document.createElement('button');
  back.className = 'back';
  back.innerHTML = '◀';
  back.addEventListener('click', () => history.back());

  const forward = document.createElement('button');
  forward.className = 'forward';
  forward.innerHTML = '▶';
  forward.addEventListener('click', () => history.forward());

  const share = document.createElement('button');
  share.className = 'share';
  share.innerHTML = '🔗';
  share.addEventListener('click', onShare);

  container.append(back, share, forward);
  return container;
}
