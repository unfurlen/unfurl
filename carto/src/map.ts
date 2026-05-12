import { Tile } from './tile.ts';
import { Biome } from './biome.ts';

export class InvalidPositionError extends Error {
  constructor(row: number, col: number) {
    super(`Invalid map position: (${row}, ${col})`);
    this.name = 'InvalidPositionError';
  }
}

export class Map {
  readonly tiles: Tile[][];

  constructor(readonly width: number, readonly height: number) {
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
