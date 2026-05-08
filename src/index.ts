import './style.css';
import { Grid } from './grid.ts';
import { renderGrid, renderResult, renderControls } from './renderer.ts';
import { parseHash } from './url.ts';

function render() {
  const grid = new Grid();
  const moves = parseHash(location.hash);
  for (const move of moves) {
    grid.applyMove(move);
  }
  const app = document.getElementById('app')!;
  app.replaceChildren(
    renderResult(grid.winner()),
    renderGrid(grid)
  );

  app.appendChild(renderControls(
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
