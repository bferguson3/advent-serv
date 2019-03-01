import { PlayerData, PlayerStats } from "../entities";
import { ClassType } from "../enums/class-type.enum";

export class PlayerService {
    public static populatePlayerStats(player: PlayerData, stats: PlayerStats): void {
        player.str = stats.str;
        player.agi = stats.agi;
        player.int = stats.int;
        player.mhp = stats.mhp;
        player.mmp = stats.mmp;
        player.classLevel = stats.classLevel;
    }

    public static calculateStats(
        player: PlayerData,
        classToCalculate: ClassType = null): PlayerStats {

        let currentClass: string;

        if (classToCalculate !== null) {
            currentClass = classToCalculate;
        } else {
            currentClass = player.currentClass;
        }

        const cPlayer = new PlayerStats();

        let multiplier = 0;

        if (currentClass === ClassType.Jester) {
            cPlayer.str = (6 + (player.level / 2));
            cPlayer.agi = (6 + player.level);
            cPlayer.int = (4 + (player.level / 2));
            cPlayer.mhp = (15 + ((cPlayer.str + cPlayer.agi) / 2));
            cPlayer.mmp = (2 + (cPlayer.int / 2) + player.level);
            multiplier = 1 + ((player.clvl.jester - 1) / 9);
        }

        cPlayer.str = Math.floor(cPlayer.str * multiplier);
        cPlayer.agi = Math.floor(cPlayer.agi * multiplier);
        cPlayer.int = Math.floor(cPlayer.int * multiplier);
        cPlayer.mhp = Math.floor(cPlayer.mhp * multiplier);
        cPlayer.mmp = Math.floor(cPlayer.mmp * multiplier);
        cPlayer.classLevel = player.clvl[currentClass];
        cPlayer.class = currentClass;

        return cPlayer;
    }
}