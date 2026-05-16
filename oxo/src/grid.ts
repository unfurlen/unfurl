import { Cell } from './cell';
import { Move } from './move';
import { Player } from './player';

export const SIZE = 3;

export class InvalidPositionError extends Error {
  constructor(row: number, col: number) {
    super(`Invalid grid position: (${row}, ${col})`);
    this.name = 'InvalidPositionError';
  }
}

export class Grid {
  private cells: Cell[][];

  constructor() {
    this.cells = Array.from({ length: SIZE }, () =>
      Array.from({ length: SIZE }, () => new Cell())
    );
  }

  getCell(row: number, col: number): Cell {
    if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) {
      throw new InvalidPositionError(row, col);
    }
    return this.cells[row][col];
  }

  applyMove(move: Move): void {
    this.cells[move.row][move.col] = new Cell(move.player);
  }

  winner(): Player | null {
    const lines: [number, number][][] = [
      [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],
      [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]],
      [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]],
    ];

    for (const line of lines) {
      const [a, b, c] = line.map(([r, col]) => this.cells[r][col].player);
      if (a && a === b && b === c) {
        return a;
      }
    }

    return null;
  }
}
