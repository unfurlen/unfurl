import { Weather } from './weather';

type BiomeState = {
  traversable: boolean;
  cost: number;
};

type BiomeDef = {
  [Weather.Clear]: BiomeState;
  [Weather.Snow]?: BiomeState;
};

export const Biome = {
  Field: {
    [Weather.Clear]: { traversable: true, cost: 1 },
  },
  Water: {
    [Weather.Clear]: { traversable: false, cost: Infinity },
    [Weather.Snow]: { traversable: true, cost: 1 },
  },
  Marsh: {
    [Weather.Clear]: { traversable: true, cost: 2 },
    [Weather.Snow]: { traversable: true, cost: 1 },
  },
} as const satisfies Record<string, BiomeDef>;

export type Biome = {
  [Weather.Clear]: BiomeState;
  [Weather.Snow]?: BiomeState;
};
