import { SIZE } from './grid.ts';
import { Move, Player, InvalidMoveError } from './move.ts';

export function parseHash(hash: string): Move[] {
  if (!hash || hash === '#') {
    return [];
  }

  const chars = hash.slice(1).split('');
  const totalCells = SIZE * SIZE;

  return chars.map((char, i) => {
    const index = Number(char);
    if (isNaN(index) || index >= totalCells) {
      throw new InvalidMoveError(NaN, NaN, char);
    }
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const player: Player = i % 2 === 0 ? 'X' : 'O';
    return new Move(row, col, player);
  });
}
