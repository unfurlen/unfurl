import { describe, it, expect, vi } from 'vitest';
import { Map, Direction } from './map.ts';
import { Biome } from './biome.ts';
import { renderMap, renderControls, renderResult } from './renderer.ts';

function fieldGrid(w: number, h: number): Biome[][] {
  return Array.from({ length: h }, () => Array(w).fill(Biome.Field));
}

describe('renderMap', () => {
  it('renders correct number of tiles', () => {
    const map = new Map(0, 0, fieldGrid(3, 3), 9);
    const el = renderMap(map);
    expect(el.querySelectorAll('.tile').length).toBe(9);
  });

  it('renders correct number of tiles for non-square', () => {
    const map = new Map(0, 0, fieldGrid(4, 6), 24);
    const el = renderMap(map);
    expect(el.querySelectorAll('.tile').length).toBe(24);
  });

  it('each tile shows biome text', () => {
    const map = new Map(0, 0, fieldGrid(2, 2), 4);
    const el = renderMap(map);
    const tiles = el.querySelectorAll('.tile');
    tiles.forEach(tile => {
      expect(tile.textContent).toBe('field');
    });
  });

  it('shows water text for water tile', () => {
    const map = new Map(0, 0, [[Biome.Field, Biome.Water]], 4);
    const el = renderMap(map);
    const tiles = el.querySelectorAll('.tile');
    expect(tiles[0].textContent).toBe('field');
    expect(tiles[1].textContent).toBe('water');
  });

  it('marks player tile with player class', () => {
    const map = new Map(1, 1, fieldGrid(3, 3), 9);
    const el = renderMap(map);
    expect(el.querySelectorAll('.tile.player').length).toBe(1);
  });

  it('adds visited class to visited tiles', () => {
    const map = new Map(0, 0, fieldGrid(3, 3), 9);
    map.applyMove(Direction.E);
    const el = renderMap(map);
    const tiles = el.querySelectorAll('.tile');
    expect(tiles[0].classList.contains('visited')).toBe(true);
    expect(tiles[1].classList.contains('visited')).toBe(true);
  });

  it('unvisited tiles have no visited class', () => {
    const map = new Map(0, 0, fieldGrid(3, 3), 9);
    const el = renderMap(map);
    const tiles = el.querySelectorAll('.tile');
    expect(tiles[1].classList.contains('visited')).toBe(false);
  });

  describe('tile clicks', () => {
    it('clicking north tile updates hash', () => {
      location.hash = '#3x3:1,1';
      const map = new Map(1, 1, fieldGrid(3, 3), 9);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      tiles[1].click();
      expect(location.hash).toBe('#3x3:1,1:N');
    });

    it('clicking south tile updates hash', () => {
      location.hash = '#3x3:1,1';
      const map = new Map(1, 1, fieldGrid(3, 3), 9);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      tiles[7].click();
      expect(location.hash).toBe('#3x3:1,1:S');
    });

    it('clicking east tile updates hash', () => {
      location.hash = '#3x3:1,1';
      const map = new Map(1, 1, fieldGrid(3, 3), 9);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      tiles[5].click();
      expect(location.hash).toBe('#3x3:1,1:E');
    });

    it('clicking west tile updates hash', () => {
      location.hash = '#3x3:1,1';
      const map = new Map(1, 1, fieldGrid(3, 3), 9);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      tiles[3].click();
      expect(location.hash).toBe('#3x3:1,1:W');
    });

    it('clicking player tile does not change hash', () => {
      location.hash = '#3x3:1,1';
      const map = new Map(1, 1, fieldGrid(3, 3), 9);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      tiles[4].click();
      expect(location.hash).toBe('#3x3:1,1');
    });

    it('clicking non-adjacent tile does not change hash', () => {
      location.hash = '#3x3:1,1';
      const map = new Map(1, 1, fieldGrid(3, 3), 9);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      tiles[0].click();
      expect(location.hash).toBe('#3x3:1,1');
    });

    it('does not click into water', () => {
      location.hash = '#F,W:0,0';
      const map = new Map(0, 0, [[Biome.Field, Biome.Water]], 4);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      tiles[1].click();
      expect(location.hash).toBe('#F,W:0,0');
    });

    it('does not move when map is complete', () => {
      const map = new Map(0, 0, fieldGrid(2, 2), 4);
      map.applyMove(Direction.E);
      map.applyMove(Direction.S);
      map.applyMove(Direction.W);

      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      const hashBefore = location.hash;
      tiles[3].click();
      expect(location.hash).toBe(hashBefore);
    });

    it('does not move when expired', () => {
      const map = new Map(0, 0, fieldGrid(3, 3), 1);
      map.applyMove(Direction.E);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      const hashBefore = location.hash;
      tiles[4].click();
      expect(location.hash).toBe(hashBefore);
    });
  });
});

describe('renderControls', () => {
  it('renders back, forward, and share buttons', () => {
    const el = renderControls('#0', '#01', vi.fn());
    expect(el.querySelector('.back')).toBeTruthy();
    expect(el.querySelector('.forward')).toBeTruthy();
    expect(el.querySelector('.share')).toBeTruthy();
  });

  it('clicking back sets location.hash to backUrl', () => {
    location.hash = '';
    const el = renderControls('#0', null, vi.fn());
    const back = el.querySelector('.back') as HTMLButtonElement;
    back.click();
    expect(location.hash).toBe('#0');
  });

  it('clicking forward sets location.hash to forwardUrl', () => {
    location.hash = '';
    const el = renderControls(null, '#01', vi.fn());
    const forward = el.querySelector('.forward') as HTMLButtonElement;
    forward.click();
    expect(location.hash).toBe('#01');
  });

  it('disables back when backUrl is null', () => {
    const el = renderControls(null, '#01', vi.fn());
    const back = el.querySelector('.back') as HTMLButtonElement;
    expect(back.disabled).toBe(true);
  });

  it('disables forward when forwardUrl is null', () => {
    const el = renderControls('#0', null, vi.fn());
    const forward = el.querySelector('.forward') as HTMLButtonElement;
    expect(forward.disabled).toBe(true);
  });
});

describe('renderResult', () => {
  it('shows step count when not completed and not expired', () => {
    const el = renderResult(3, 9, false);
    expect(el.textContent).toBe('Steps: 3 / 9');
  });

  it('shows step count and completion message when completed', () => {
    const el = renderResult(7, 9, true);
    expect(el.textContent).toBe('Steps: 7 / 9 — Map completed!');
  });

  it('shows expired message when expired', () => {
    const el = renderResult(9, 9, false);
    expect(el.textContent).toBe('Steps: 9 / 9 — Expired!');
  });

  it('shows completed when both completed and at limit', () => {
    const el = renderResult(9, 9, true);
    expect(el.textContent).toBe('Steps: 9 / 9 — Map completed!');
  });

  it('shows correct class', () => {
    const el = renderResult(0, 9, false);
    expect(el.classList.contains('result')).toBe(true);
  });
});
