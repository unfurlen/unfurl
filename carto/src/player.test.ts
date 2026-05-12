import { describe, it, expect } from 'vitest';
import { Player } from './player.ts';

describe('Player', () => {
  it('creates a player at a position', () => {
    const p = new Player(2, 3);
    expect(p.row).toBe(2);
    expect(p.col).toBe(3);
  });
});
