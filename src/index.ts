import { Cell } from './cell.ts';
import { render } from './renderer.ts';

const cell = new Cell();
const app = document.getElementById('app')!;
app.replaceChildren(render(cell));
