import { Player } from './player.ts';

export class Cell {
  readonly player: Player | null;

  constructor(player?: Player) {
    this.player = player ?? null;
  }
}
