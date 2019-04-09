import { StatusEffectType } from "../enums";

export class Enemy {
    public chp: number;
    public mhp: number;
    public statusEffects: StatusEffectType[] = [];
}
