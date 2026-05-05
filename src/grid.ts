import { Cell } from './cell.ts';

export class InvalidPositionError extends Error {
  constructor(row: number, col: number) {
    super(`Invalid grid position: (${row}, ${col})`);
    this.name = 'InvalidPositionError';
  }
}

export class Grid {
  private cells: Cell[][];

  readonly width: number = 3;
  readonly height: number = 3;

  constructor() {
    this.cells = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => new Cell())
    );
  }

  getCell(row: number, col: number): Cell {
    if (row < 0 || row >= this.height || col < 0 || col >= this.width) {
      throw new InvalidPositionError(row, col);
    }
    return this.cells[row][col];
  }
}
