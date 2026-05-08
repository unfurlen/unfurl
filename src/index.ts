import './style.css';
import { Grid } from './grid.ts';
import { renderGrid, renderResult, renderShareButton } from './renderer.ts';
import { parseHash } from './url.ts';

function render() {
  const grid = new Grid();
  const moves = parseHash(location.hash);
  for (const move of moves) {
    grid.applyMove(move);
  }
  const app = document.getElementById('app')!;
  app.replaceChildren(renderGrid(grid));

  app.appendChild(renderShareButton());

  const result = renderResult(grid.winner());
  if (result) {
    app.appendChild(result);
  }
}

render();
window.addEventListener('hashchange', render);
