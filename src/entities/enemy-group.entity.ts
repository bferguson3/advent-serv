import { EnemyType } from "../enums";
import { Enemy } from "./enemy.entity";

export class EnemyGroup {
    public enemyType: EnemyType;
    public enemies: Enemy[] = [];
}
