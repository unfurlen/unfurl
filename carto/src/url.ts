import { Map } from './map.ts';

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

export function parseMapUrl(hash: string): Map {
  const cleaned = hash.replace(/^#/, '');
  if (!cleaned) throw new URLParseError(hash);

  const parts = cleaned.split(':');
  const dimStr = parts[0];
  const xIndex = dimStr.indexOf('x');
  if (xIndex === -1) throw new URLParseError(hash);

  const wStr = dimStr.slice(0, xIndex);
  const hStr = dimStr.slice(xIndex + 1);
  if (!wStr || !hStr) throw new URLParseError(hash);

  const width = parseDimension(wStr, 'width');
  const height = parseDimension(hStr, 'height');

  return new Map(width, height);
}
