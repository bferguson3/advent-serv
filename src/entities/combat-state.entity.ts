import { CombatTurnActions } from "./combat-turn-actions.entity";
import { EnemyGroup } from "./enemy-group.entity";

export class CombatState {
    public playerTriggered: number;
    public currentPlayer: number;
    public round: number;
    public enemyGroups: EnemyGroup[] = [];
    public turnActions: CombatTurnActions[] = [];
}
