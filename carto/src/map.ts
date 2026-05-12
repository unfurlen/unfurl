import { Tile } from './tile.ts';
import { Biome } from './biome.ts';
import { Player } from './player.ts';

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
    super(`Invalid map size: ${width}x${height}.`);
    this.name = 'InvalidMapSizeError';
  }
}

export class Map {
  readonly tiles: Tile[][];
  player: Player;
  readonly width: number;
  readonly height: number;

  constructor(
    startRow: number,
    startCol: number,
    biomes: Biome[][],
  ) {
    this.height = biomes.length;
    if (this.height === 0) throw new InvalidMapSizeError(0, 0);
    this.width = biomes[0].length;
    if (this.width === 0) throw new InvalidMapSizeError(this.width, this.height);

    if (biomes.some(row => row.length !== this.width)) {
      throw new InvalidMapSizeError(this.width, this.height);
    }

    if (startRow < 0 || startRow >= this.height || startCol < 0 || startCol >= this.width) {
      throw new InvalidPositionError(startRow, startCol);
    }

    if (biomes[startRow][startCol] === Biome.Water) {
      throw new InvalidPositionError(startRow, startCol);
    }

    this.tiles = Array.from({ length: this.height }, (_, row) =>
      Array.from({ length: this.width }, (_, col) => new Tile(biomes[row][col]))
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

    if (this.tiles[newRow][newCol].biome === Biome.Water) {
      throw new InvalidPositionError(newRow, newCol);
    }

    this.tiles[newRow][newCol] = this.tiles[newRow][newCol].visit();
    this.player = new Player(newRow, newCol);
  }

  isComplete(): boolean {
    return this.tiles.every(row =>
      row.every(tile => tile.biome === Biome.Water || tile.visited)
    );
  }
}
