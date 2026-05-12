import { describe, it, expect } from 'vitest';
import { Map, Direction } from './map.ts';
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

  it('marks player tile with player class', () => {
    const map = new Map(3, 3, 1, 1);
    const el = renderMap(map);
    expect(el.querySelectorAll('.tile.player').length).toBe(1);
  });

  it('adds visited class to visited tiles', () => {
    const map = new Map(3, 3, 0, 0);
    map.applyMove(Direction.E);
    const el = renderMap(map);
    const tiles = el.querySelectorAll('.tile');
    expect(tiles[0].classList.contains('visited')).toBe(true);
    expect(tiles[1].classList.contains('visited')).toBe(true);
  });

  it('unvisited tiles have no visited class', () => {
    const map = new Map(3, 3, 0, 0);
    const el = renderMap(map);
    const tiles = el.querySelectorAll('.tile');
    expect(tiles[1].classList.contains('visited')).toBe(false);
  });

  describe('tile clicks', () => {
    it('clicking north tile updates hash', () => {
      location.hash = '#3x3:1,1';
      const map = new Map(3, 3, 1, 1);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      tiles[1].click();
      expect(location.hash).toBe('#3x3:1,1:N');
    });

    it('clicking south tile updates hash', () => {
      location.hash = '#3x3:1,1';
      const map = new Map(3, 3, 1, 1);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      tiles[7].click();
      expect(location.hash).toBe('#3x3:1,1:S');
    });

    it('clicking east tile updates hash', () => {
      location.hash = '#3x3:1,1';
      const map = new Map(3, 3, 1, 1);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      tiles[5].click();
      expect(location.hash).toBe('#3x3:1,1:E');
    });

    it('clicking west tile updates hash', () => {
      location.hash = '#3x3:1,1';
      const map = new Map(3, 3, 1, 1);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      tiles[3].click();
      expect(location.hash).toBe('#3x3:1,1:W');
    });

    it('clicking player tile does not change hash', () => {
      location.hash = '#3x3:1,1';
      const map = new Map(3, 3, 1, 1);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      tiles[4].click();
      expect(location.hash).toBe('#3x3:1,1');
    });

    it('clicking non-adjacent tile does not change hash', () => {
      location.hash = '#3x3:1,1';
      const map = new Map(3, 3, 1, 1);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      tiles[0].click();
      expect(location.hash).toBe('#3x3:1,1');
    });
  });
});
