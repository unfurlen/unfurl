export const Biome = { Field: 'field' } as const;
export type Biome = typeof Biome[keyof typeof Biome];
