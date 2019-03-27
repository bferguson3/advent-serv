import { Enemy } from "./enemy.entity";

export class CombatState {
    public playerTriggered: number;
    public currentPlayer: number;
    public round: number;
    public enemies: Enemy[] = [];
}
