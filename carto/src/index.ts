import './style.css';
import { renderMap } from './renderer.ts';
import { parseMapUrl } from './url.ts';

function render() {
  const { map, path } = parseMapUrl(location.hash);
  for (const dir of path) {
    map.applyMove(dir);
  }
  const app = document.getElementById('app')!;
  app.replaceChildren(renderMap(map));
}

render();
window.addEventListener('hashchange', render);
