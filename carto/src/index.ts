import './style.css';
import { renderMap, renderControls, renderResult, renderWeather, renderInfoButton, renderResetButton, renderEditButton } from './renderer';
import { parseMapUrl, getFullHistory, getBackUrl, getForwardUrl } from './url';
import { Direction } from './map';

let fullHistory: Direction[] = [];

function render() {
  const { map, path, mode } = parseMapUrl(location.hash);

  if (mode === 'play') {
    for (const dir of path) {
      if (map.isGameOver()) break;
      map.applyMove(dir);
    }
  }

  fullHistory = getFullHistory(fullHistory, path);

  const backUrl = getBackUrl(location.hash, path);
  const forwardUrl = getForwardUrl(location.hash, path, fullHistory);

  const steps = path.length;

  const resultRow = document.createElement('div');
  resultRow.className = 'result-row';
  const rightGroup = document.createElement('div');
  rightGroup.className = 'right-group';
  rightGroup.appendChild(renderEditButton());
  rightGroup.appendChild(renderInfoButton());
  resultRow.appendChild(renderResetButton());
  resultRow.appendChild(renderResult(steps, map.supplies));
  resultRow.appendChild(rightGroup);

  const app = document.getElementById('app')!;
  app.replaceChildren(renderWeather(map.weatherCycle, path.length), resultRow, renderMap(map, mode));
  app.appendChild(renderControls(
    backUrl,
    forwardUrl,
    async () => {
      const url = window.location.href;
      if (navigator.share) {
        await navigator.share({ url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    }
  ));
}

render();
window.addEventListener('hashchange', render);
