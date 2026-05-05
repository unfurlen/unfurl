import { describe, it, expect } from 'vitest';
import { Cell } from './cell.ts';

describe('Cell', () => {
  it('creates a cell', () => {
    const cell = new Cell();
    expect(cell).toBeDefined();
  });
});
