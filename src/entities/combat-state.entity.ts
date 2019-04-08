import { CombatTurnActions } from "./combat-turn-actions.entity";
import { Enemy } from "./enemy.entity";

export class CombatState {
    public playerTriggered: number;
    public currentPlayer: number;
    public round: number;
    public enemies: Enemy[] = [];
    public turnActions: CombatTurnActions[] = [];
}
