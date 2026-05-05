import { Cell } from './cell.ts';

export class InvalidPositionError extends Error {
  constructor(row: number, col: number) {
    super(`Invalid grid position: (${row}, ${col})`);
    this.name = 'InvalidPositionError';
  }
}

export class Grid {
  private cells: Cell[][];

  constructor() {
    this.cells = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => new Cell())
    );
  }

  getCell(row: number, col: number): Cell {
    if (row < 0 || row >= 3 || col < 0 || col >= 3) {
      throw new InvalidPositionError(row, col);
    }
    return this.cells[row][col];
  }
}
