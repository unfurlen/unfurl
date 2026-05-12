import './style.css';
import { renderMap } from './renderer.ts';
import { parseMapUrl } from './url.ts';

function render() {
  const map = parseMapUrl(location.hash);
  const app = document.getElementById('app')!;
  app.replaceChildren(renderMap(map));
}

render();
window.addEventListener('hashchange', render);
