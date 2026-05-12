import './style.css';
import { renderMap, renderControls, renderResult } from './renderer.ts';
import { parseMapUrl, getFullHistory, getBackUrl, getForwardUrl } from './url.ts';
import { Direction } from './map.ts';

let fullHistory: Direction[] = [];

function render() {
  const { map, path } = parseMapUrl(location.hash);
  for (const dir of path) {
    map.applyMove(dir);
  }

  fullHistory = getFullHistory(fullHistory, path);

  const backUrl = getBackUrl(location.hash, path);
  const forwardUrl = getForwardUrl(location.hash, path, fullHistory);

  const completed = map.isComplete();
  const steps = path.length;

  const app = document.getElementById('app')!;
  app.replaceChildren(renderResult(steps, map.supplies, completed), renderMap(map));
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
