import { SIZE } from './grid.ts';
import { Move } from './move.ts';
import { Player } from './player.ts';

export class URLParseError extends Error {
  constructor(input: string) {
    super(`Failed to parse URL hash: '${input}'`);
    this.name = 'URLParseError';
  }
}

export function parseHash(hash: string): Move[] {
  if (!hash || hash === '#') {
    return [];
  }

  const chars = hash.slice(1).split('');
  const totalCells = SIZE * SIZE;

  return chars.map((char, i) => {
    const index = Number(char);
    if (isNaN(index) || index >= totalCells) {
      throw new URLParseError(char);
    }
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const player: Player = i % 2 === 0 ? Player.X : Player.O;
    return new Move(row, col, player);
  });
}

export function buildHash(hash: string, cellIndex: number): string {
  return '#' + (hash.replace(/^#/, '') || '') + cellIndex;
}

export function getCurrHistory(moves: Move[]): number[] {
  return moves.map(move => move.row * SIZE + move.col);
}

function isPrefix(shorter: number[], longer: number[]): boolean {
  return shorter.every((val, i) => val === longer[i]);
}

export function getFullHistory(fullHistory: number[], currHistory: number[]): number[] {
  if (isPrefix(currHistory, fullHistory)) return fullHistory;
  return [...currHistory];
}

export function getBackUrl(currHistory: number[]): string | null {
  if (currHistory.length === 0) return null;
  return '#' + currHistory.slice(0, -1).join('');
}

export function getForwardUrl(currHistory: number[], fullHistory: number[]): string | null {
  if (currHistory.length >= fullHistory.length) return null;
  return '#' + fullHistory.slice(0, currHistory.length + 1).join('');
}
