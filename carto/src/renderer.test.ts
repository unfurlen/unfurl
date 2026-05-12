import { describe, it, expect } from 'vitest';
import { Map } from './map.ts';
import { renderMap } from './renderer.ts';

describe('renderMap', () => {
  it('renders correct number of tiles', () => {
    const map = new Map(3, 3, 0, 0);
    const el = renderMap(map);
    expect(el.querySelectorAll('.tile').length).toBe(9);
  });

  it('renders correct number of tiles for non-square', () => {
    const map = new Map(4, 6, 0, 0);
    const el = renderMap(map);
    expect(el.querySelectorAll('.tile').length).toBe(24);
  });

  it('each tile shows biome text', () => {
    const map = new Map(2, 2, 0, 0);
    const el = renderMap(map);
    const tiles = el.querySelectorAll('.tile');
    tiles.forEach(tile => {
      expect(tile.textContent).toBe('field');
    });
  });
});
