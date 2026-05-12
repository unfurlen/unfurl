import { Map, Direction } from './map.ts';
import { Biome } from './biome.ts';

export class URLParseError extends Error {
  constructor(input: string) {
    super(`Failed to parse carto URL: '${input}'`);
    this.name = 'URLParseError';
  }
}

function parseNonNegativeInt(input: string): number {
  const n = Number(input);
  if (!Number.isInteger(n) || n < 0) {
    throw new URLParseError(input);
  }
  return n;
}

function parseBiomes(input: string): Biome[][] {
  const rows = input.split(',');
  if (rows.length === 0 || rows[0].length === 0) throw new URLParseError(input);

  const width = rows[0].length;
  const biomes: Biome[][] = [];

  for (const row of rows) {
    if (row.length !== width) throw new URLParseError(input);
    const biomeRow: Biome[] = [];
    for (const ch of row) {
      if (ch === 'F') biomeRow.push(Biome.Field);
      else if (ch === 'W') biomeRow.push(Biome.Water);
      else throw new URLParseError(input);
    }
    biomes.push(biomeRow);
  }
  return biomes;
}

const VALID_DIRECTIONS = new Set<string>([Direction.N, Direction.S, Direction.E, Direction.W]);

function parsePath(input: string): Direction[] {
  for (const ch of input) {
    if (!VALID_DIRECTIONS.has(ch)) {
      throw new URLParseError(input);
    }
  }
  return input.split('') as Direction[];
}

export function parseMapUrl(hash: string): { map: Map; path: Direction[] } {
  const cleaned = hash.replace(/^#/, '');
  if (!cleaned) throw new URLParseError(hash);

  const parts = cleaned.split(':');
  if (parts.length < 3 || !parts[1] || !parts[2]) throw new URLParseError(hash);

  const biomes = parseBiomes(parts[0]);

  const startParts = parts[1].split(',');
  if (startParts.length !== 2) throw new URLParseError(hash);
  const startRow = parseNonNegativeInt(startParts[0]);
  const startCol = parseNonNegativeInt(startParts[1]);

  const stepLimit = Number(parts[2]);
  if (!Number.isInteger(stepLimit) || stepLimit < 1) throw new URLParseError(hash);

  const path = parts[3] ? parsePath(parts[3]) : [];

  return { map: new Map(startRow, startCol, biomes, stepLimit), path };
}

export function buildMapUrl(hash: string, direction: Direction): string {
  const cleaned = hash.replace(/^#/, '');
  const parts = cleaned.split(':');
  const base = parts.slice(0, 3).join(':');
  const currPath = parts.slice(3).join('') || '';
  return `#${base}:${currPath}${direction}`;
}

function getBase(hash: string): string {
  const cleaned = hash.replace(/^#/, '');
  const parts = cleaned.split(':');
  return parts.slice(0, 3).join(':');
}

function isPrefix(shorter: Direction[], longer: Direction[]): boolean {
  return shorter.every((val, i) => val === longer[i]);
}

export function getFullHistory(fullHistory: Direction[], path: Direction[]): Direction[] {
  if (isPrefix(path, fullHistory)) return fullHistory;
  return [...path];
}

export function getBackUrl(hash: string, path: Direction[]): string | null {
  if (path.length === 0) return null;
  return `#${getBase(hash)}:${path.slice(0, -1).join('')}`;
}

export function getForwardUrl(hash: string, path: Direction[], fullHistory: Direction[]): string | null {
  if (path.length >= fullHistory.length) return null;
  return `#${getBase(hash)}:${fullHistory.slice(0, path.length + 1).join('')}`;
}
