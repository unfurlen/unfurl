import { SIZE } from './grid.ts';
import { Player } from './player.ts';

export class InvalidMoveError extends Error {
  constructor(row: number, col: number, player: string) {
    super(`Invalid move: (${row}, ${col}, ${player})`);
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
      throw new InvalidMoveError(row, col, player);
    }
    if (player !== Player.X && player !== Player.O) {
      throw new InvalidMoveError(row, col, player);
    }
  }
}
