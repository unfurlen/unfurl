import { describe, it, expect } from 'vitest';
import { Tile } from './tile.ts';
import { Biome } from './biome.ts';

describe('Tile', () => {
  it('creates unvisited tile', () => {
    const tile = new Tile(Biome.Field);
    expect(tile.biome).toBe(Biome.Field);
    expect(tile.visited).toBe(false);
  });

  it('creates visited tile', () => {
    const tile = new Tile(Biome.Field, true);
    expect(tile.visited).toBe(true);
  });

  it('returns a new visited tile on visit()', () => {
    const tile = new Tile(Biome.Field);
    const visited = tile.visit();
    expect(tile.visited).toBe(false);
    expect(visited.visited).toBe(true);
  });
});
