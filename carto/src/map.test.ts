import { describe, it, expect } from 'vitest';
import { Map, InvalidPositionError, InvalidMapSizeError } from './map.ts';
import { Biome } from './biome.ts';

describe('Map', () => {
  it('creates a grid of unvisited Field tiles', () => {
    const map = new Map(5, 5, 0, 0);
    expect(map.tiles.length).toBe(5);
    expect(map.tiles[0].length).toBe(5);
    expect(map.getTile(0, 0).biome).toBe(Biome.Field);
    expect(map.getTile(0, 0).visited).toBe(false);
  });

  it.each([
    [-1, 0],
    [3, 0],
    [0, -1],
    [0, 3],
  ])('throws for position (%i, %i)', (row, col) => {
    const map = new Map(3, 3, 0, 0);
    expect(() => map.getTile(row, col)).toThrow(InvalidPositionError);
  });

  it.each([
    [0, 5],
    [5, 0],
    [11, 5],
    [5, 11],
  ])('throws for invalid size %i x %i', (w, h) => {
    expect(() => new Map(w, h, 0, 0)).toThrow(InvalidMapSizeError);
  });

  it('stores player at start position', () => {
    const map = new Map(3, 3, 1, 2);
    expect(map.player.row).toBe(1);
    expect(map.player.col).toBe(2);
  });

  it.each([
    [-1, 0],
    [3, 0],
    [0, -1],
    [0, 3],
  ])('throws for player out of bounds at (%i, %i)', (row, col) => {
    expect(() => new Map(3, 3, row, col)).toThrow(InvalidPositionError);
  });
});
