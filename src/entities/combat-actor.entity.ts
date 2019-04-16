import { EnemyType } from "../enums";

export class CombatActor {
    public isPlayer: boolean;
    public actor: any;
    public enemyType: EnemyType;

    public calculatedSpeed: number;

    constructor(
        isPlayer: boolean,
        actor: any,
        enemyType: EnemyType = null) {

        this.isPlayer = isPlayer;
        this.actor = actor;
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
