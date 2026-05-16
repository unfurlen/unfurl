import './style.css';
import { Grid } from './grid';
import { renderGrid, renderResult, renderControls } from './renderer';
import { parseHash, getCurrHistory, getFullHistory, getBackUrl, getForwardUrl } from './url';

let fullHistory: number[] = [];

function render() {
  const moves = parseHash(location.hash);
  const grid = new Grid();
  for (const move of moves) {
    grid.applyMove(move);
  }

  const currHistory = getCurrHistory(moves);
  fullHistory = getFullHistory(fullHistory, currHistory);

  const backUrl = getBackUrl(currHistory);
  const forwardUrl = getForwardUrl(currHistory, fullHistory);

  const app = document.getElementById('app')!;
  app.replaceChildren(
    renderResult(grid.winner()),
    renderGrid(grid)
  );

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
