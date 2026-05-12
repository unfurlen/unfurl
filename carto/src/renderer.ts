import { Map, Direction } from './map.ts';
import { buildMapUrl } from './url.ts';

export function renderMap(map: Map): HTMLElement {
  const container = document.createElement('div');
  container.className = 'grid';
  container.style.gridTemplateColumns = `repeat(${map.width}, 1fr)`;

  for (let row = 0; row < map.height; row++) {
    for (let col = 0; col < map.width; col++) {
      const tileEl = document.createElement('div');
      tileEl.className = 'tile';
      tileEl.textContent = 'field';
      if (row === map.player.row && col === map.player.col) {
        tileEl.classList.add('player');
      }
      if (map.tiles[row][col].visited) {
        tileEl.classList.add('visited');
      }

      const dRow = Math.abs(row - map.player.row);
      const dCol = Math.abs(col - map.player.col);
      if (dRow + dCol === 1) {
        let dir: Direction;
        if (row === map.player.row - 1) dir = Direction.N;
        else if (row === map.player.row + 1) dir = Direction.S;
        else if (col === map.player.col + 1) dir = Direction.E;
        else dir = Direction.W;

        tileEl.addEventListener('click', () => {
          location.hash = buildMapUrl(location.hash, dir);
        });
      }

      container.appendChild(tileEl);
    }
  }

  return container;
}
