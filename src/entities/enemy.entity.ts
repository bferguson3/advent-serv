import { StatusEffectType } from "../enums";

export class Enemy {

    // Stats
    public str: number;
    public agi: number;
    public int: number;
    public mhp: number;
    public mmp: number;

    // Ephemeral stats
    public chp: number;
    public cmp: number;
    public statusEffects: StatusEffectType[] = [];
}
