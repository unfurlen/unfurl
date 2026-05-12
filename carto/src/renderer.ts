import { Map, Direction } from './map.ts';
import { Biome } from './biome.ts';
import { buildMapUrl } from './url.ts';

export function renderMap(map: Map): HTMLElement {
  const container = document.createElement('div');
  container.className = 'grid';
  container.style.gridTemplateColumns = `repeat(${map.width}, 1fr)`;

  for (let row = 0; row < map.height; row++) {
    for (let col = 0; col < map.width; col++) {
      const tileEl = document.createElement('div');
      tileEl.className = 'tile';
      tileEl.textContent = map.tiles[row][col].biome;
      if (map.tiles[row][col].biome === Biome.Water) {
        tileEl.classList.add('water');
      }
      if (row === map.player.row && col === map.player.col) {
        tileEl.classList.add('player');
      }
      if (map.tiles[row][col].visited) {
        tileEl.classList.add('visited');
      }

      const dRow = Math.abs(row - map.player.row);
      const dCol = Math.abs(col - map.player.col);
      if (dRow + dCol === 1 && map.tiles[row][col].biome !== Biome.Water && !map.isGameOver()) {
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

export function renderControls(
  backUrl: string | null,
  forwardUrl: string | null,
  onShare: () => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'controls';

  const back = document.createElement('button');
  back.className = 'back';
  back.innerHTML = '◀';
  if (backUrl !== null) {
    back.addEventListener('click', () => { location.hash = backUrl; });
  } else {
    back.disabled = true;
  }

  const forward = document.createElement('button');
  forward.className = 'forward';
  forward.innerHTML = '▶';
  if (forwardUrl !== null) {
    forward.addEventListener('click', () => { location.hash = forwardUrl; });
  } else {
    forward.disabled = true;
  }

  const share = document.createElement('button');
  share.className = 'share';
  share.innerHTML = '🔗';
  share.addEventListener('click', onShare);

  container.append(back, share, forward);
  return container;
}

export function renderResult(steps: number, stepLimit: number, completed: boolean): HTMLElement {
  const el = document.createElement('div');
  el.className = 'result';
  const expired = steps >= stepLimit && !completed;
  let message = `Steps: ${steps} / ${stepLimit}`;
  if (completed) {
    message += ' — Map completed!';
  } else if (expired) {
    message += ' — Expired!';
  }
  el.textContent = message;
  return el;
}
