export const Biome = { Field: 'field', Water: 'water' } as const;
export type Biome = (typeof Biome)[keyof typeof Biome];
