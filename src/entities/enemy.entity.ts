import { StatusEffectType } from "../enums";

export class Enemy {

    // Stats
    public mhp: number;
    public mmp: number;
    public agi: number; // used only for turn order calcs
    public atp: number;
    public dfp: number;
    public atk: number;
    public mat: number;
    public mdf: number;
    public avd: number;
    public luc: number;

    // Ephemeral stats
    public chp: number;
    public cmp: number;
    public statusEffects: StatusEffectType[] = [];
}
