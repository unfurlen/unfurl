import './style.css';
import { renderMap, renderControls, renderResult, renderWeather } from './renderer.ts';
import { parseMapUrl, getFullHistory, getBackUrl, getForwardUrl } from './url.ts';
import { Direction } from './map.ts';

let fullHistory: Direction[] = [];

function render() {
  const { map, path } = parseMapUrl(location.hash);
  for (const dir of path) {
    if (map.isGameOver()) break;
    map.applyMove(dir);
  }

  fullHistory = getFullHistory(fullHistory, path);

  const backUrl = getBackUrl(location.hash, path);
  const forwardUrl = getForwardUrl(location.hash, path, fullHistory);

  const steps = path.length;

  const app = document.getElementById('app')!;
  app.replaceChildren(renderWeather(map.weatherCycle, path.length), renderResult(steps, map.supplies), renderMap(map));
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
