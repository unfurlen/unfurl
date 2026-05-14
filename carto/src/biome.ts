import { Weather } from './weather.ts';

type BiomeState = {
  traversable: boolean;
  cost: number;
};

type BiomeDef = {
  [Weather.Clear]: BiomeState;
};

export const Biome = {
  Field: {
    [Weather.Clear]: { traversable: true, cost: 1 },
  },
  Water: {
    [Weather.Clear]: { traversable: false, cost: Infinity },
    [Weather.Snow]: { traversable: true, cost: 1 },
  },
} as const satisfies Record<string, BiomeDef>;

export type Biome = (typeof Biome)[keyof typeof Biome];
