import { Tile } from './tile.ts';
import { Biome } from './biome.ts';

export const MAX_SIZE = 10;

export class InvalidPositionError extends Error {
  constructor(row: number, col: number) {
    super(`Invalid map position: (${row}, ${col})`);
    this.name = 'InvalidPositionError';
  }
}

export class InvalidMapSizeError extends Error {
  constructor(width: number, height: number) {
    super(`Invalid map size: ${width}x${height}. Must be 1-${MAX_SIZE}.`);
    this.name = 'InvalidMapSizeError';
  }
}

export class Map {
  readonly tiles: Tile[][];

  constructor(readonly width: number, readonly height: number) {
    if (width < 1 || width > MAX_SIZE || height < 1 || height > MAX_SIZE) {
      throw new InvalidMapSizeError(width, height);
    }
    this.tiles = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => new Tile(Biome.Field))
    );
  }

  getTile(row: number, col: number): Tile {
    if (row < 0 || row >= this.height || col < 0 || col >= this.width) {
      throw new InvalidPositionError(row, col);
    }
    return this.tiles[row][col];
  }
}
