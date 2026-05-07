import './style.css';
import { Grid } from './grid.ts';
import { renderGrid } from './renderer.ts';
import { parseHash } from './url.ts';

const grid = new Grid();
const moves = parseHash(location.hash);
for (const move of moves) {
  grid.applyMove(move);
}

const app = document.getElementById('app')!;
app.replaceChildren(renderGrid(grid));
