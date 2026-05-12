import { Tile } from './tile.ts';
import { Biome } from './biome.ts';
import { Player } from './player.ts';

export const MAX_SIZE = 10;

export const Direction = { N: 'N', S: 'S', E: 'E', W: 'W' } as const;
export type Direction = (typeof Direction)[keyof typeof Direction];

const DIRECTION_DELTA: Record<Direction, [number, number]> = {
  [Direction.N]: [-1, 0],
  [Direction.S]: [1, 0],
  [Direction.E]: [0, 1],
  [Direction.W]: [0, -1],
};

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
  player: Player;

  constructor(
    readonly width: number,
    readonly height: number,
    startRow: number,
    startCol: number,
  ) {
    if (width < 1 || width > MAX_SIZE || height < 1 || height > MAX_SIZE) {
      throw new InvalidMapSizeError(width, height);
    }
    if (startRow < 0 || startRow >= height || startCol < 0 || startCol >= width) {
      throw new InvalidPositionError(startRow, startCol);
    }
    this.tiles = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => new Tile(Biome.Field))
    );
    this.tiles[startRow][startCol] = this.tiles[startRow][startCol].visit();
    this.player = new Player(startRow, startCol);
  }

  getTile(row: number, col: number): Tile {
    if (row < 0 || row >= this.height || col < 0 || col >= this.width) {
      throw new InvalidPositionError(row, col);
    }
    return this.tiles[row][col];
  }

  applyMove(direction: Direction): void {
    const [dr, dc] = DIRECTION_DELTA[direction];
    const newRow = this.player.row + dr;
    const newCol = this.player.col + dc;

    if (newRow < 0 || newRow >= this.height || newCol < 0 || newCol >= this.width) {
      throw new InvalidPositionError(newRow, newCol);
    }

    this.tiles[newRow][newCol] = this.tiles[newRow][newCol].visit();
    this.player = new Player(newRow, newCol);
  }
}
