import { Biome } from './biome.ts';

export class Tile {
  constructor(
    readonly biome: Biome,
    readonly visited: boolean = false
  ) {}

  visit(): Tile {
    return new Tile(this.biome, true);
  }
}
