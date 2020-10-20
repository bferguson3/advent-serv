import { Character } from "./character.model";

export class Enemy extends Character {
    public enemyType: string;
    public hp: number;
    public target: string;
}
