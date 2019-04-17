import { EnemyType } from "../enums";
import { CombatTurnActions } from "./combat-turn-actions.entity";

export class CombatActor {
    public initiatorNum: number;
    public isPlayer: boolean;
    public actor: any;
    public combatTurnActions: CombatTurnActions;
    public enemyType: EnemyType;
    public initiatorGroupNum: number;

    public calculatedSpeed: number;

    constructor(
        initiatorNum: number,
        isPlayer: boolean,
        actor: any,
        combatTurnActions: CombatTurnActions,
        enemyType: EnemyType = null,
        initiatorGroupNum: number = null) {

        this.initiatorNum = initiatorNum;
        this.isPlayer = isPlayer;
        this.actor = actor;
        this.combatTurnActions = combatTurnActions;
        this.enemyType = enemyType;
        this.initiatorGroupNum = initiatorGroupNum;

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
