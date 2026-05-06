export type Player = 'X' | 'O';

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
    if (row < 0 || row >= 3 || col < 0 || col >= 3) {
      throw new InvalidMoveError(row, col, player);
    }
    if (player !== 'X' && player !== 'O') {
      throw new InvalidMoveError(row, col, player);
    }
  }
}

const SIZE = 3;

export function parseHash(hash: string): Move[] {
  if (!hash || hash === '#') {
    return [];
  }

  const indices = hash.slice(1).split('').map(Number);

  return indices.map((index, i) => {
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const player: Player = i % 2 === 0 ? 'X' : 'O';
    return new Move(row, col, player);
  });
}
