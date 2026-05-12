import { describe, it, expect } from 'vitest';
import { Map, InvalidPositionError } from './map.ts';
import { Biome } from './biome.ts';

describe('Map', () => {
  it('creates a grid of unvisited Field tiles', () => {
    const map = new Map(5, 5);
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
    const map = new Map(3, 3);
    expect(() => map.getTile(row, col)).toThrow(InvalidPositionError);
  });
});
