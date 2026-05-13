export const Weather = { Clear: 'C', Snow: 'S' } as const;
export type Weather = (typeof Weather)[keyof typeof Weather];
