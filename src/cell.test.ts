import { describe, it, expect } from 'vitest';
import { Cell } from './cell.ts';
import { Player } from './player.ts';

describe('Cell', () => {
  it('creates a cell without a player', () => {
    const cell = new Cell();
    expect(cell.player).toBeNull();
  });

  it('creates a cell with a player', () => {
    const cell = new Cell(Player.X);
    expect(cell.player).toBe(Player.X);
  });
});
