import { describe, it, expect } from 'vitest';
import { Cell } from './cell.ts';
import { render } from './renderer.ts';

describe('render', () => {
  it('renders an empty cell', () => {
    const cell = new Cell();
    const result = render(cell);
    expect(result.classList.contains('cell')).toBe(true);
  });
});
