import { Map, Direction } from './map';
import { Biome } from './biome';
import { Weather } from './weather';
import { buildMapUrl } from './url';
import { toggleEditMode, cycleTileBiome, setPlayerStart, setSupplies, setWidth, setHeight, setCycle, cycleTileWeather } from './edit';
import { showOverlay } from './overlay';

let selectedPlayer = false;

export function renderMap(map: Map, mode: 'play' | 'edit' = 'play'): HTMLElement {
  const container = document.createElement('div');
  container.className = 'grid';
  if (map.isComplete()) {
    container.classList.add('complete');
  } else if (map.supplies <= 0) {
    container.classList.add('expired');
  }
  container.style.gridTemplateColumns = `repeat(${map.width}, 60px)`;
  selectedPlayer = false;

  for (let row = 0; row < map.height; row++) {
    for (let col = 0; col < map.width; col++) {
      const tileEl = document.createElement('div');
      tileEl.className = 'tile';
      if (map.tiles[row][col].biome === Biome.Water) {
        tileEl.classList.add('water');
        if (map.getWeather() === Weather.Snow) {
          tileEl.classList.add('frozen');
        }
      } else if (map.tiles[row][col].biome === Biome.Marsh) {
        tileEl.classList.add('marsh');
        if (map.getWeather() === Weather.Snow) {
          tileEl.classList.add('frozen');
        }
      }
      if (row === map.player.row && col === map.player.col) {
        tileEl.classList.add('player');
      }
      if (map.tiles[row][col].biome !== Biome.Water && !map.tiles[row][col].visited) {
        tileEl.classList.add('unvisited');
      }

      if (mode === 'edit') {
        tileEl.addEventListener('click', () => {
          if (selectedPlayer) {
            selectedPlayer = false;
            location.hash = setPlayerStart(location.hash, row, col);
          } else if (row === map.player.row && col === map.player.col) {
            selectedPlayer = true;
            tileEl.classList.add('selected');
          } else {
            location.hash = cycleTileBiome(location.hash, row, col);
          }
        });
      } else {
        const dRow = Math.abs(row - map.player.row);
        const dCol = Math.abs(col - map.player.col);
        const nextWeather = map.weatherCycle[(map.stepCount + 1) % map.weatherCycle.length];
        const biome = map.tiles[row][col].biome;
        const state = biome[nextWeather] ?? biome[Weather.Clear];
        const canAfford = map.supplies >= state.cost;
        if (dRow + dCol === 1 && state.traversable && canAfford && !map.isGameOver()) {
          let dir: Direction;
          if (row === map.player.row - 1) dir = Direction.N;
          else if (row === map.player.row + 1) dir = Direction.S;
          else if (col === map.player.col + 1) dir = Direction.E;
          else dir = Direction.W;

          tileEl.addEventListener('click', () => {
            location.hash = buildMapUrl(location.hash, dir);
          });
        }
      }

      container.appendChild(tileEl);
    }
  }

  if (mode === 'edit') {
    const wrapper = document.createElement('div');
    wrapper.className = 'grid-wrapper';
    wrapper.style.position = 'relative';
    const col = document.createElement('div');
    col.className = 'grid-col';
    const widthBtn = document.createElement('button');
    widthBtn.className = 'resize-btn';
    widthBtn.textContent = '↔';
    widthBtn.addEventListener('click', () => {
      showOverlay({
        title: 'Grid Width',
        field: { value: `${map.width}` },
        onSubmit: (val) => {
          const n = parseInt(val, 10);
          if (!isNaN(n) && n >= 1 && n <= 99) location.hash = setWidth(location.hash, n);
        }
      });
    });
    const heightBtn = document.createElement('button');
    heightBtn.className = 'resize-btn';
    heightBtn.style.position = 'absolute';
    heightBtn.style.right = '-36px';
    heightBtn.style.top = '50%';
    heightBtn.style.transform = 'translateY(-50%)';
    heightBtn.textContent = '↕';
    heightBtn.addEventListener('click', () => {
      showOverlay({
        title: 'Grid Height',
        field: { value: `${map.height}` },
        onSubmit: (val) => {
          const n = parseInt(val, 10);
          if (!isNaN(n) && n >= 1 && n <= 99) location.hash = setHeight(location.hash, n);
        }
      });
    });
    col.append(container, widthBtn);
    wrapper.append(col, heightBtn);
    return wrapper;
  }

  return container;
}

export function renderControls(
  backUrl: string | null,
  forwardUrl: string | null,
  onShare: () => void,
  mode: 'play' | 'edit' = 'play'
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'controls';

  if (mode === 'edit') return container;

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

export function renderInfoButton(): HTMLElement {
  const btn = document.createElement('button');
  btn.className = 'info-button';
  btn.textContent = 'ℹ️';
  btn.addEventListener('click', showInfoModal);
  return btn;
}

export function renderEditButton(mode: 'play' | 'edit' = 'play'): HTMLElement {
  const btn = document.createElement('button');
  btn.className = 'edit-button';
  if (mode === 'edit') {
    btn.classList.add('edit-mode');
  }
  btn.textContent = '✏️';
  btn.addEventListener('click', () => {
    location.hash = toggleEditMode(location.hash);
  });
  return btn;
}

export function renderResetButton(): HTMLElement {
  const btn = document.createElement('button');
  btn.className = 'reset-button';
  btn.textContent = '🔄';
  btn.addEventListener('click', () => {
    const parts = location.hash.replace(/^#/, '').split(':');
    location.hash = '#' + parts.slice(0, 4).join(':');
  });
  return btn;
}

let infoModal: HTMLElement | null = null;

function showInfoModal() {
  if (!infoModal) {
    infoModal = document.createElement('div');
    infoModal.className = 'modal-overlay';
    infoModal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">✕</button>
        <h2>How to Play</h2>
        <p>🌿 <b>Field</b> — open terrain, costs 1 supply.</p>
        <p>💧 <b>Water</b> — only passable when frozen ❄️, costs 1 supply.</p>
        <p>🟫 <b>Marsh</b> — heavy ground, costs 2 supplies (1 when frozen ❄️).</p>
        <p>☀️❄️ Weather cycles determine what's frozen.</p>
        <p>🎒 Complete the map by visiting all non-water tiles.</p>
        <p>🔗 Share your URL to challenge others.</p>
      </div>
    `;
    infoModal.addEventListener('click', (e) => {
      if (e.target === infoModal) hideInfoModal();
    });
    infoModal.querySelector('.modal-close')!.addEventListener('click', hideInfoModal);
    document.body.appendChild(infoModal);
  }
  infoModal.classList.add('visible');
}

function hideInfoModal() {
  if (infoModal) infoModal.classList.remove('visible');
}

export function applyEditMode(mode: 'play' | 'edit'): void {
  document.body.classList.toggle('edit-mode', mode === 'edit');
}

export function renderResult(steps: number, supplies: number, mode: 'play' | 'edit' = 'play'): HTMLElement {
  const el = document.createElement('div');
  el.className = 'result';
  el.innerHTML = `👣 <span class="num">${steps}</span>  <span class="supplies-area">🎒 <span class="num">${supplies}</span></span>`;

  if (mode === 'edit') {
    const suppliesArea = el.querySelector('.supplies-area') as HTMLElement;
    suppliesArea.addEventListener('click', () => {
      showOverlay({
        title: 'Starting Supplies',
        field: { value: `${supplies}` },
        onSubmit: (val) => {
          const n = parseInt(val, 10);
          if (!isNaN(n) && n >= 0) {
            location.hash = setSupplies(location.hash, n);
          }
        }
      });
    });
  }

  return el;
}

export function renderWeather(cycle: string[], currentStep: number, mode: 'play' | 'edit' = 'play'): HTMLElement {
  const container = document.createElement('div');
  container.className = 'weather';
  cycle.forEach((weather, i) => {
    const el = document.createElement('span');
    el.className = 'weather-icon';
    el.classList.add(weather === Weather.Clear ? 'weather-clear' : 'weather-snow');
    el.textContent = weather === Weather.Clear ? '☀️' : '❄️';
    if (i === currentStep % cycle.length) {
      el.classList.add('current');
    }
    if (mode === 'edit') {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        location.hash = cycleTileWeather(location.hash, i);
      });
    }
    container.appendChild(el);
  });

  if (mode === 'edit') {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '4px';
    const btn = document.createElement('button');
    btn.className = 'resize-btn';
    btn.textContent = '↔';
    btn.addEventListener('click', () => {
      showOverlay({
        title: 'Weather Cycle Length',
        field: { value: `${cycle.length}` },
        onSubmit: (val) => {
          const n = parseInt(val, 10);
          if (!isNaN(n) && n >= 1 && n <= 99) location.hash = setCycle(location.hash, n);
        }
      });
    });
    wrapper.append(btn, container);
    return wrapper;
  }

  return container;
}
