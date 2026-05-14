export const Biome = { Field: 'field', Water: 'water', Marsh: 'marsh' } as const;
export type Biome = (typeof Biome)[keyof typeof Biome];
