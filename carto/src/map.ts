import { Tile } from './tile.ts';
import { Biome } from './biome.ts';
import { Player } from './player.ts';
import { Weather } from './weather.ts';
type WeatherType = (typeof Weather)[keyof typeof Weather];

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

export class InvalidSuppliesError extends Error {
  constructor(limit: number) {
    super(`Invalid supplies: ${limit}`);
    this.name = 'InvalidSuppliesError';
  }
}

export class InvalidWeatherCycleError extends Error {
  constructor() {
    super('Invalid weather cycle');
    this.name = 'InvalidWeatherCycleError';
  }
}

export class Map {
  readonly tiles: Tile[][];
  player: Player;
  readonly width: number;
  readonly height: number;
  supplies: number;
  readonly weatherCycle: WeatherType[];
  stepCount: number = 0;

  constructor(
    startRow: number,
    startCol: number,
    biomes: Biome[][],
    supplies: number,
    weatherCycle: WeatherType[],
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

    if (!biomes[startRow][startCol][Weather.Clear].traversable) {
      throw new InvalidPositionError(startRow, startCol);
    }

    this.supplies = supplies;
    if (!Number.isInteger(supplies) || supplies < 1) {
      throw new InvalidSuppliesError(supplies);
    }

    if (weatherCycle.length === 0) {
      throw new InvalidWeatherCycleError();
    }
    this.weatherCycle = weatherCycle;

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

    const biome = this.tiles[newRow][newCol].biome;
    const nextWeather = this.weatherCycle[(this.stepCount + 1) % this.weatherCycle.length];
    const state = biome[nextWeather] ?? biome[Weather.Clear];
    if (!state.traversable) {
      throw new InvalidPositionError(newRow, newCol);
    }
    if (this.supplies < state.cost) {
      throw new InvalidPositionError(newRow, newCol);
    }

    this.tiles[newRow][newCol] = this.tiles[newRow][newCol].visit();
    this.player = new Player(newRow, newCol);
    this.supplies -= state.cost;
    this.stepCount++;
  }

  getWeather(): WeatherType {
    return this.weatherCycle[this.stepCount % this.weatherCycle.length];
  }

  isComplete(): boolean {
    return this.tiles.every(row =>
      row.every(tile => !tile.biome[Weather.Clear].traversable || tile.visited)
    );
  }

  isGameOver(): boolean {
    return this.isComplete() || this.supplies <= 0;
  }
}
