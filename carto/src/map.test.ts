import { describe, it, expect } from 'vitest';
import { Map, Direction, InvalidPositionError, InvalidMapSizeError } from './map.ts';
import { Biome } from './biome.ts';

describe('Map', () => {
  it('creates a grid of unvisited Field tiles', () => {
    const map = new Map(5, 5, 0, 0);
    expect(map.tiles.length).toBe(5);
    expect(map.tiles[0].length).toBe(5);
    expect(map.getTile(0, 0).biome).toBe(Biome.Field);
    expect(map.getTile(1, 1).visited).toBe(false);
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

  it('marks start tile as visited', () => {
    const map = new Map(3, 3, 1, 2);
    expect(map.getTile(1, 2).visited).toBe(true);
    expect(map.getTile(0, 0).visited).toBe(false);
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

describe('applyMove', () => {
  it.each([
    [Direction.E, 0, 0, 0, 1],
    [Direction.S, 0, 0, 1, 0],
    [Direction.N, 1, 0, 0, 0],
    [Direction.W, 0, 1, 0, 0],
  ])('%s moves player to (%i, %i)', (dir, sr, sc, er, ec) => {
    const map = new Map(3, 3, sr, sc);
    map.applyMove(dir);
    expect(map.player.row).toBe(er);
    expect(map.player.col).toBe(ec);
  });

  it('marks destination tile as visited', () => {
    const map = new Map(3, 3, 0, 0);
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
    const map = new Map(3, 3, r, c);
    expect(() => map.applyMove(dir)).toThrow(InvalidPositionError);
  });
});

describe('isComplete', () => {
  it('returns false when only start tile is visited', () => {
    const map = new Map(2, 2, 0, 0);
    expect(map.isComplete()).toBe(false);
  });

  it('returns true when all tiles are visited', () => {
    const map = new Map(2, 2, 0, 0);
    map.applyMove(Direction.E);
    map.applyMove(Direction.S);
    map.applyMove(Direction.W);
    expect(map.isComplete()).toBe(true);
  });

  it('returns false when partially visited', () => {
    const map = new Map(2, 2, 0, 0);
    map.applyMove(Direction.E);
    expect(map.isComplete()).toBe(false);
  });
});
