import { Map } from './map.ts';

export function renderMap(map: Map): HTMLElement {
  const container = document.createElement('div');
  container.className = 'grid';
  container.style.gridTemplateColumns = `repeat(${map.width}, 1fr)`;

  for (let row = 0; row < map.height; row++) {
    for (let col = 0; col < map.width; col++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.textContent = 'field';
      if (row === map.player.row && col === map.player.col) {
        tile.classList.add('player');
      }
      container.appendChild(tile);
    }
  }

  return container;
}
