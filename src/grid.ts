import { Cell } from './cell.ts';

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
}
