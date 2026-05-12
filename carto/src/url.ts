import { Map, Direction } from './map.ts';

export class URLParseError extends Error {
  constructor(input: string) {
    super(`Failed to parse carto URL: '${input}'`);
    this.name = 'URLParseError';
  }
}

function parseDimension(input: string): number {
  const n = Number(input);
  if (!Number.isInteger(n) || n < 1) {
    throw new URLParseError(input);
  }
  return n;
}

function parseNonNegativeInt(input: string): number {
  const n = Number(input);
  if (!Number.isInteger(n) || n < 0) {
    throw new URLParseError(input);
  }
  return n;
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
  const dimStr = parts[0];
  const xIndex = dimStr.indexOf('x');
  if (xIndex === -1) throw new URLParseError(hash);

  const wStr = dimStr.slice(0, xIndex);
  const hStr = dimStr.slice(xIndex + 1);
  if (!wStr || !hStr) throw new URLParseError(hash);

  const width = parseDimension(wStr);
  const height = parseDimension(hStr);

  let startRow = 0;
  let startCol = 0;
  if (parts[1]) {
    const [sr, sc] = parts[1].split(',');
    startRow = parseNonNegativeInt(sr);
    startCol = parseNonNegativeInt(sc);
  }

  const path = parts[2] ? parsePath(parts[2]) : [];

  return { map: new Map(width, height, startRow, startCol), path };
}

export function buildMapUrl(hash: string, direction: Direction): string {
  const cleaned = hash.replace(/^#/, '');
  const parts = cleaned.split(':');
  const dims = parts[0];
  const start = parts[1] || '0,0';
  const currPath = parts.slice(2).join('') || '';
  return `#${dims}:${start}:${currPath}${direction}`;
}

function getBase(hash: string): string {
  const cleaned = hash.replace(/^#/, '');
  const parts = cleaned.split(':');
  const dims = parts[0];
  const start = parts[1] || '0,0';
  return `${dims}:${start}`;
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
