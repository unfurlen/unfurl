import { SIZE } from './grid';
import { Player } from './player';

export class InvalidMoveError extends Error {
  constructor(row: number, col: number) {
    super(`Invalid grid position: (${row}, ${col})`);
    this.name = 'InvalidMoveError';
  }
}

export class Move {
  constructor(
    readonly row: number,
    readonly col: number,
    readonly player: Player
  ) {
    if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) {
      throw new InvalidMoveError(row, col);
    }
  }
}
