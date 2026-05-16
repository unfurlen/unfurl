import { Player } from './player';

export class Cell {
  readonly player: Player | null;

  constructor(player?: Player) {
    this.player = player ?? null;
  }
}
