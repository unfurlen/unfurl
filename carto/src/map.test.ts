import { describe, it, expect } from 'vitest';
import { Map, Direction, InvalidPositionError, InvalidMapSizeError, InvalidStepLimitError } from './map.ts';
import { Biome } from './biome.ts';

function fieldGrid(w: number, h: number): Biome[][] {
  return Array.from({ length: h }, () => Array(w).fill(Biome.Field));
}

function waterGrid(w: number, h: number): Biome[][] {
  return Array.from({ length: h }, () => Array(w).fill(Biome.Water));
}

describe('Map', () => {
  it('creates a grid of unvisited Field tiles', () => {
    const map = new Map(0, 0, fieldGrid(5, 5), 25);
    expect(map.tiles.length).toBe(5);
    expect(map.tiles[0].length).toBe(5);
    expect(map.getTile(0, 0).biome).toBe(Biome.Field);
    expect(map.getTile(1, 1).visited).toBe(false);
  });

  it('stores player at start position', () => {
    const map = new Map(1, 2, fieldGrid(3, 3), 9);
    expect(map.player.row).toBe(1);
    expect(map.player.col).toBe(2);
  });

  it('marks start tile as visited', () => {
    const map = new Map(1, 2, fieldGrid(3, 3), 9);
    expect(map.getTile(1, 2).visited).toBe(true);
    expect(map.getTile(0, 0).visited).toBe(false);
  });

  it.each([
    [-1, 0],
    [3, 0],
    [0, -1],
    [0, 3],
  ])('throws for player out of bounds at (%i, %i)', (row, col) => {
    expect(() => new Map(row, col, fieldGrid(3, 3), 9)).toThrow(InvalidPositionError);
  });

  it('throws for empty biome grid', () => {
    expect(() => new Map(0, 0, [], 9)).toThrow(InvalidMapSizeError);
  });

  it('throws for jagged biome rows', () => {
    const biomes: Biome[][] = [[Biome.Field], [Biome.Field, Biome.Field]];
    expect(() => new Map(0, 0, biomes, 9)).toThrow(InvalidMapSizeError);
  });

  it('throws when start tile is water', () => {
    expect(() => new Map(0, 0, waterGrid(2, 2), 9)).toThrow(InvalidPositionError);
  });
});

describe('stepLimit', () => {
  it('stores step limit', () => {
    const map = new Map(0, 0, fieldGrid(3, 3), 99);
    expect(map.stepLimit).toBe(99);
  });

  it.each([0, -1])('throws for invalid step limit: %i', (limit) => {
    expect(() => new Map(0, 0, fieldGrid(3, 3), limit)).toThrow(InvalidStepLimitError);
  });
});

describe('applyMove', () => {
  it.each([
    [Direction.E, 0, 0, 0, 1],
    [Direction.S, 0, 0, 1, 0],
    [Direction.N, 1, 0, 0, 0],
    [Direction.W, 0, 1, 0, 0],
  ])('%s moves player to (%i, %i)', (dir, sr, sc, er, ec) => {
    const map = new Map(sr, sc, fieldGrid(3, 3), 9);
    map.applyMove(dir);
    expect(map.player.row).toBe(er);
    expect(map.player.col).toBe(ec);
  });

  it('marks destination tile as visited', () => {
    const map = new Map(0, 0, fieldGrid(3, 3), 9);
    expect(map.getTile(0, 1).visited).toBe(false);
    map.applyMove(Direction.E);
    expect(map.getTile(0, 1).visited).toBe(true);
  });

  it.each([
    [Direction.N, 0, 0],
    [Direction.W, 0, 0],
    [Direction.S, 2, 0],
    [Direction.E, 0, 2],
  ])('throws for OOB %s from (%i, %i)', (dir, r, c) => {
    const map = new Map(r, c, fieldGrid(3, 3), 9);
    expect(() => map.applyMove(dir)).toThrow(InvalidPositionError);
  });

  it('throws when moving into water', () => {
    const biomes = fieldGrid(3, 3);
    biomes[0][1] = Biome.Water;
    const map = new Map(0, 0, biomes, 9);
    expect(() => map.applyMove(Direction.E)).toThrow(InvalidPositionError);
  });
});

describe('isComplete', () => {
  it('returns false when only start tile is visited', () => {
    const map = new Map(0, 0, fieldGrid(2, 2), 4);
    expect(map.isComplete()).toBe(false);
  });

  it('returns true when all field tiles are visited', () => {
    const map = new Map(0, 0, fieldGrid(2, 2), 4);
    map.applyMove(Direction.E);
    map.applyMove(Direction.S);
    map.applyMove(Direction.W);
    expect(map.isComplete()).toBe(true);
  });

  it('returns false when partially visited', () => {
    const map = new Map(0, 0, fieldGrid(2, 2), 4);
    map.applyMove(Direction.E);
    expect(map.isComplete()).toBe(false);
  });

  it('returns true when water tiles remain unvisited', () => {
    const map = new Map(0, 0, [[Biome.Field, Biome.Water]], 4);
    expect(map.isComplete()).toBe(true);
  });
});

describe('isGameOver', () => {
  it('returns false when game is in progress', () => {
    const map = new Map(0, 0, fieldGrid(3, 3), 9);
    expect(map.isGameOver()).toBe(false);
  });

  it('returns true when step limit reached', () => {
    const map = new Map(0, 0, fieldGrid(3, 3), 1);
    map.applyMove(Direction.E);
    expect(map.isGameOver()).toBe(true);
  });

  it('returns true when map is complete', () => {
    const map = new Map(0, 0, fieldGrid(2, 2), 4);
    map.applyMove(Direction.E);
    map.applyMove(Direction.S);
    map.applyMove(Direction.W);
    expect(map.isGameOver()).toBe(true);
  });
});
