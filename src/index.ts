import './style.css';
import { Grid } from './grid.ts';
import { renderGrid, renderResult } from './renderer.ts';
import { parseHash } from './url.ts';

function render() {
  const grid = new Grid();
  const moves = parseHash(location.hash);
  for (const move of moves) {
    grid.applyMove(move);
  }
  const app = document.getElementById('app')!;
  app.replaceChildren(renderGrid(grid));

  const result = renderResult(grid.winner());
  if (result) {
    app.appendChild(result);
  }
}

render();
window.addEventListener('hashchange', render);
