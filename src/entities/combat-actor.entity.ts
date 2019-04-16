import { EnemyType } from "../enums";
import { CombatTurnActions } from "./combat-turn-actions.entity";

export class CombatActor {
    public isPlayer: boolean;
    public actor: any;
    public enemyType: EnemyType;
    public combatTurnActions: CombatTurnActions;

    public calculatedSpeed: number;

    constructor(
        isPlayer: boolean,
        actor: any,
        combatTurnActions: CombatTurnActions,
        enemyType: EnemyType = null) {

        this.isPlayer = isPlayer;
        this.actor = actor;
        this.combatTurnActions = combatTurnActions;
        this.enemyType = enemyType;

        this.calculateSpeed();
    }

    private calculateSpeed(): void {
        // TODO: take status effects into account
        let speed: number = 0;

        if (this.actor && this.actor.agi) {
            const seed = Math.random() * 255;
            speed = this.actor.agi - ((seed * (this.actor.agi - (this.actor.agi / 4))) / 256);
        }

        this.calculatedSpeed = speed;
    }
}
