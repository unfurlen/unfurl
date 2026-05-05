import { Grid } from './grid.ts';
import { renderGrid } from './renderer.ts';

const grid = new Grid();
const app = document.getElementById('app')!;
app.replaceChildren(renderGrid(grid));
