import { PlayerClassLevels } from "./player-class-levels.entity";

export class PlayerData {
    public name: string;
    public sheet: string;
    public level: number;
    public currentClass: string;
    public classLevel: number;
    public clvl: PlayerClassLevels;
    public equipment: any;

    // Stats
    public str: number;
    public agi: number;
    public int: number;
    public mhp: number;
    public mmp: number;
}
