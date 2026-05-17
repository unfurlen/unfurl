import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Map, Direction } from './map';
import { Biome } from './biome';
import { Weather } from './weather';
import { renderMap, renderControls, renderResult, renderWeather, renderInfoButton, renderEditButton, applyEditMode } from './renderer';

function fieldGrid(w: number, h: number): Biome[][] {
  return Array.from({ length: h }, () => Array(w).fill(Biome.Field));
}

describe('renderMap', () => {
  it('renders correct number of tiles', () => {
    const map = new Map(0, 0, fieldGrid(3, 3), 9, [Weather.Clear]);
    const el = renderMap(map);
    expect(el.querySelectorAll('.tile').length).toBe(9);
  });

  it('renders correct number of tiles for non-square', () => {
    const map = new Map(0, 0, fieldGrid(4, 6), 24, [Weather.Clear]);
    const el = renderMap(map);
    expect(el.querySelectorAll('.tile').length).toBe(24);
  });

  it('renders field tiles without water class', () => {
    const map = new Map(0, 0, fieldGrid(2, 2), 4, [Weather.Clear]);
    const el = renderMap(map);
    const tiles = el.querySelectorAll('.tile');
    tiles.forEach(tile => {
      expect(tile.classList.contains('water')).toBe(false);
    });
  });

  it('marks water tile with water class', () => {
    const map = new Map(0, 0, [[Biome.Field, Biome.Water]], 4, [Weather.Clear]);
    const el = renderMap(map);
    const tiles = el.querySelectorAll('.tile');
    expect(tiles[0].classList.contains('water')).toBe(false);
    expect(tiles[1].classList.contains('water')).toBe(true);
  });

  it('marks player tile with player class', () => {
    const map = new Map(1, 1, fieldGrid(3, 3), 9, [Weather.Clear]);
    const el = renderMap(map);
    expect(el.querySelectorAll('.tile.player').length).toBe(1);
  });

  it('visited tiles lose unvisited class', () => {
    const map = new Map(0, 0, fieldGrid(3, 3), 9, [Weather.Clear]);
    map.applyMove(Direction.E);
    const el = renderMap(map);
    const tiles = el.querySelectorAll('.tile');
    expect(tiles[0].classList.contains('unvisited')).toBe(false);
    expect(tiles[1].classList.contains('unvisited')).toBe(false);
    expect(tiles[2].classList.contains('unvisited')).toBe(true);
  });

  it('unvisited non-water tiles get unvisited class', () => {
    const map = new Map(0, 0, fieldGrid(3, 3), 9, [Weather.Clear]);
    const el = renderMap(map);
    const tiles = el.querySelectorAll('.tile');
    expect(tiles[0].classList.contains('unvisited')).toBe(false);
    expect(tiles[1].classList.contains('unvisited')).toBe(true);
  });

  it('water tiles never get unvisited class', () => {
    const map = new Map(0, 0, [[Biome.Field, Biome.Field, Biome.Water]], 9, [Weather.Clear]);
    const el = renderMap(map);
    const tiles = el.querySelectorAll('.tile');
    expect(tiles[1].classList.contains('unvisited')).toBe(true);
    expect(tiles[2].classList.contains('unvisited')).toBe(false);
  });

  it('adds frozen class to water tiles during snow', () => {
    const map = new Map(0, 1, [[Biome.Water, Biome.Field]], 9, [Weather.Snow]);
    const el = renderMap(map);
    const tiles = el.querySelectorAll('.tile');
    expect(tiles[0].classList.contains('frozen')).toBe(true);
    expect(tiles[1].classList.contains('frozen')).toBe(false);
  });

  it('does not add frozen class during clear', () => {
    const map = new Map(0, 1, [[Biome.Water, Biome.Field]], 9, [Weather.Clear]);
    const el = renderMap(map);
    const tiles = el.querySelectorAll('.tile');
    expect(tiles[0].classList.contains('frozen')).toBe(false);
  });

  it('marks marsh tile with marsh class', () => {
    const map = new Map(0, 0, [[Biome.Field, Biome.Marsh]], 9, [Weather.Clear]);
    const el = renderMap(map);
    const tiles = el.querySelectorAll('.tile');
    expect(tiles[0].classList.contains('marsh')).toBe(false);
    expect(tiles[1].classList.contains('marsh')).toBe(true);
  });

  it('adds frozen class to marsh during snow', () => {
    const map = new Map(0, 1, [[Biome.Marsh, Biome.Field]], 9, [Weather.Snow]);
    const el = renderMap(map);
    const tiles = el.querySelectorAll('.tile');
    expect(tiles[0].classList.contains('frozen')).toBe(true);
  });

  it('adds complete class to grid when map is complete', () => {
    const map = new Map(0, 0, fieldGrid(2, 2), 4, [Weather.Clear]);
    map.applyMove(Direction.E);
    map.applyMove(Direction.S);
    map.applyMove(Direction.W);
    const el = renderMap(map);
    expect(el.classList.contains('complete')).toBe(true);
    expect(el.classList.contains('expired')).toBe(false);
  });

  it('adds expired class to grid when out of supplies', () => {
    const map = new Map(0, 0, fieldGrid(2, 2), 1, [Weather.Clear]);
    map.applyMove(Direction.E);
    const el = renderMap(map);
    expect(el.classList.contains('expired')).toBe(true);
    expect(el.classList.contains('complete')).toBe(false);
  });

  describe('tile clicks', () => {
    it('clicking north tile updates hash', () => {
      location.hash = '#3x3:1,1';
      const map = new Map(1, 1, fieldGrid(3, 3), 9, [Weather.Clear]);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      (tiles[1] as HTMLElement).click();
      expect(location.hash).toBe('#3x3:1,1:N');
    });

    it('clicking south tile updates hash', () => {
      location.hash = '#3x3:1,1';
      const map = new Map(1, 1, fieldGrid(3, 3), 9, [Weather.Clear]);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      (tiles[7] as HTMLElement).click();
      expect(location.hash).toBe('#3x3:1,1:S');
    });

    it('clicking east tile updates hash', () => {
      location.hash = '#3x3:1,1';
      const map = new Map(1, 1, fieldGrid(3, 3), 9, [Weather.Clear]);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      (tiles[5] as HTMLElement).click();
      expect(location.hash).toBe('#3x3:1,1:E');
    });

    it('clicking west tile updates hash', () => {
      location.hash = '#3x3:1,1';
      const map = new Map(1, 1, fieldGrid(3, 3), 9, [Weather.Clear]);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      (tiles[3] as HTMLElement).click();
      expect(location.hash).toBe('#3x3:1,1:W');
    });

    it('clicking player tile does not change hash', () => {
      location.hash = '#3x3:1,1';
      const map = new Map(1, 1, fieldGrid(3, 3), 9, [Weather.Clear]);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      (tiles[4] as HTMLElement).click();
      expect(location.hash).toBe('#3x3:1,1');
    });

    it('clicking non-adjacent tile does not change hash', () => {
      location.hash = '#3x3:1,1';
      const map = new Map(1, 1, fieldGrid(3, 3), 9, [Weather.Clear]);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      (tiles[0] as HTMLElement).click();
      expect(location.hash).toBe('#3x3:1,1');
    });

    it('marks player on frozen water', () => {
      const map = new Map(0, 1, [[Biome.Water, Biome.Field, Biome.Field]], 9, [Weather.Snow]);
      map.applyMove(Direction.W);
      const el = renderMap(map);
      expect(el.querySelectorAll('.tile.player').length).toBe(1);
    });

    it('does not click into water', () => {
      location.hash = '#F,W:0,0';
      const map = new Map(0, 0, [[Biome.Field, Biome.Water]], 4, [Weather.Clear]);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      (tiles[1] as HTMLElement).click();
      expect(location.hash).toBe('#F,W:0,0');
    });

    it('clicks into water during snow', () => {
      location.hash = '#WF,F:0,1';
      const map = new Map(0, 1, [[Biome.Water, Biome.Field, Biome.Field]], 9, [Weather.Snow]);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      (tiles[0] as HTMLElement).click();
      expect(location.hash).toBe('#WF,F:0,1:W');
    });

    it('does not click into water during clear', () => {
      location.hash = '#WF,F:0,1';
      const map = new Map(0, 1, [[Biome.Water, Biome.Field, Biome.Field]], 9, [Weather.Clear]);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      const hashBefore = location.hash;
      (tiles[0] as HTMLElement).click();
      expect(location.hash).toBe(hashBefore);
    });

    it('does not click into water when next step is clear', () => {
      location.hash = '#WFF:0,1:9:SC';
      const map = new Map(0, 1, [[Biome.Water, Biome.Field, Biome.Field]], 9, [Weather.Snow, Weather.Clear]);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      const hashBefore = location.hash;
      (tiles[0] as HTMLElement).click();
      expect(location.hash).toBe(hashBefore);
    });

    it('does not click into frozen water when game over', () => {
      const map = new Map(0, 1, [[Biome.Water, Biome.Field, Biome.Field]], 1, [Weather.Snow]);
      map.applyMove(Direction.W); // one step onto water, supplies exhausted
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      const hashBefore = location.hash;
      (tiles[1] as HTMLElement).click();
      expect(location.hash).toBe(hashBefore);
    });

    it('does not move when map is complete', () => {
      const map = new Map(0, 0, fieldGrid(2, 2), 4, [Weather.Clear]);
      map.applyMove(Direction.E);
      map.applyMove(Direction.S);
      map.applyMove(Direction.W);

      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      const hashBefore = location.hash;
      (tiles[3] as HTMLElement).click();
      expect(location.hash).toBe(hashBefore);
    });

    it('clicking non-player tile in edit mode cycles biome', () => {
    location.hash = '#FFF:0,0:9:C::e';
    const map = new Map(0, 0, fieldGrid(2, 2), 9, [Weather.Clear]);
    const el = renderMap(map, 'edit');
    (el.querySelectorAll('.tile')[1] as HTMLElement).click();
    expect(location.hash).toBe('#FWF:0,0:9:C::e');
  });

  it('clicking other tile while selected moves player', () => {
    location.hash = '#FFF:0,0:9:C::e';
    const map = new Map(0, 0, fieldGrid(2, 2), 9, [Weather.Clear]);
    const el = renderMap(map, 'edit');
    const playerTile = el.querySelector('.tile.player') as HTMLElement;
    playerTile.click();
    (el.querySelectorAll('.tile')[1] as HTMLElement).click();
    expect(location.hash).toBe('#FFF:0,1:9:C::e');
  });

  it('clicking player tile adds selected class in edit mode', () => {
    location.hash = '#FFF:0,0:9:C::e';
    const map = new Map(0, 0, fieldGrid(2, 2), 9, [Weather.Clear]);
    const el = renderMap(map, 'edit');
    const playerTile = el.querySelector('.tile.player') as HTMLElement;

    playerTile.click();
    expect(playerTile.classList.contains('selected')).toBe(true);
  });

  it('clicking player tile in edit mode does not cycle biome', () => {
    location.hash = '#FWF:0,0:9:C::e';
    const map = new Map(0, 0, [[Biome.Field, Biome.Water, Biome.Field]], 9, [Weather.Clear]);
    const el = renderMap(map, 'edit');
    const playerTile = el.querySelector('.tile.player') as HTMLElement;

    playerTile.click();
    expect(location.hash).toBe('#FWF:0,0:9:C::e');
  });

  it('does not move when expired', () => {
      const map = new Map(0, 0, fieldGrid(3, 3), 1, [Weather.Clear]);
      map.applyMove(Direction.E);
      const el = renderMap(map);
      const tiles = el.querySelectorAll('.tile');
      const hashBefore = location.hash;
      (tiles[4] as HTMLElement).click();
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

  it('renders empty container in edit mode', () => {
    const el = renderControls(null, null, vi.fn(), 'edit');
    expect(el.children.length).toBe(0);
  });
});

describe('renderEditButton', () => {
  it('clicking enters edit mode', () => {
    location.hash = '#FFF:0,0:9:C';
    const btn = renderEditButton();
    btn.click();
    expect(location.hash).toBe('#FFF:0,0:9:C::e');
  });

  it('clicking exits edit mode', () => {
    location.hash = '#FFF:0,0:9:C::e';
    const btn = renderEditButton();
    btn.click();
    expect(location.hash).toBe('#FFF:0,0:9:C');
  });

  it('adds edit-mode class when in edit mode', () => {
    const btn = renderEditButton('edit');
    expect(btn.classList.contains('edit-mode')).toBe(true);
  });

  it('does not add edit-mode class in play mode', () => {
    const btn = renderEditButton('play');
    expect(btn.classList.contains('edit-mode')).toBe(false);
  });
});

describe('renderInfoButton', () => {
  it('clicking info shows modal', () => {
    const el = renderInfoButton();
    el.click();
    const modal = document.body.querySelector('.modal-overlay');
    expect(modal).toBeTruthy();
    expect(modal!.classList.contains('visible')).toBe(true);
  });

  it('clicking close hides modal', () => {
    const el = renderInfoButton();
    el.click();
    const modal = document.body.querySelector('.modal-overlay')!;
    const close = modal.querySelector('.modal-close') as HTMLButtonElement;
    close.click();
    expect(modal.classList.contains('visible')).toBe(false);
  });

  it('clicking backdrop hides modal', () => {
    const el = renderInfoButton();
    el.click();
    const modal = document.body.querySelector('.modal-overlay')!;
    modal.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(modal.classList.contains('visible')).toBe(false);
  });
});

describe('renderResult', () => {
  it('shows step count and supplies', () => {
    const el = renderResult(3, 9);
    expect(el.textContent).toBe('👣 3  🎒 9');
  });

  it('shows correct class', () => {
    const el = renderResult(0, 9);
    expect(el.classList.contains('result')).toBe(true);
  });
});

describe('renderWeather', () => {
  it('renders one icon per cycle entry', () => {
    const el = renderWeather([Weather.Clear, Weather.Snow, Weather.Clear], 0);
    expect(el.children.length).toBe(3);
  });

  it('highlights current weather', () => {
    const el = renderWeather([Weather.Clear, Weather.Snow], 1);
    expect(el.children[1].classList.contains('current')).toBe(true);
  });

  it('highlights weather at current step modulo cycle', () => {
    const el = renderWeather([Weather.Clear, Weather.Snow], 3);
    expect(el.children[1].classList.contains('current')).toBe(true);
  });
});

describe('applyEditMode', () => {
  beforeEach(() => {
    document.body.classList.remove('edit-mode');
  });

  it('adds edit-mode body class when mode is edit', () => {
    applyEditMode('edit');
    expect(document.body.classList.contains('edit-mode')).toBe(true);
  });

  it('removes edit-mode body class when mode is play', () => {
    document.body.classList.add('edit-mode');
    applyEditMode('play');
    expect(document.body.classList.contains('edit-mode')).toBe(false);
  });
});
