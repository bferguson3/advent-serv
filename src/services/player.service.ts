import { PlayerData, PlayerStats } from "../entities";
import { ClassType } from "../enums/class-type.enum";

export class PlayerService {
    public static populatePlayerStats(player: PlayerData, stats: PlayerStats): void {
        player.str = stats.str ? stats.str : 0;
        player.agi = stats.agi ? stats.agi : 0;
        player.int = stats.int ? stats.int : 0;
        player.mhp = stats.mhp ? stats.mhp : 0;
        player.mmp = stats.mmp ? stats.mmp : 0;
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
            cPlayer.mhp = (15 + ((cPlayer.str + cPlayer.agi) / 2)) + (3 * player.level);
            cPlayer.mmp = (2 + (cPlayer.int / 2) + player.level);
            multiplier = 1 + ((player.clvl.jester - 1) / 9);
        } else if (currentClass === ClassType.Warrior) {
            cPlayer.str = (8 + (player.level));
            cPlayer.agi = (5 + (player.level / 3));
            cPlayer.int = (3 + (player.level / 3));
            cPlayer.mhp = (19 + ((cPlayer.str + cPlayer.agi))) + (4 * player.level);
            cPlayer.mmp = 0;
            multiplier = 1 + ((player.clvl.warrior - 1) / 9);
        } else if (currentClass === ClassType.Thief) {
            cPlayer.str = (6 + (player.level / 1.5));
            cPlayer.agi = (8 + (player.level / 0.75));
            cPlayer.int = (3 + (player.level / 2.25));
            cPlayer.mhp = (11 + (cPlayer.str + cPlayer.agi) / 2) + (2.5 * player.level);
            cPlayer.mmp = (2 + (cPlayer.int / 2) + (0.5 * player.level));
            multiplier = 1 + ((player.clvl.thief - 1) / 9);
        } else if (currentClass === ClassType.Priest) {
            cPlayer.str = (2 + (player.level / 2));
            cPlayer.agi = (5 + (player.level / 2.5));
            cPlayer.int = (8 + (player.level / 1.5));
            cPlayer.mhp = (9 + (cPlayer.str + cPlayer.agi) / 2) + (2.5 * player.level);
            cPlayer.mmp = (5 + (cPlayer.int / 1.5) + (3 * player.level));
            multiplier = 1 + ((player.clvl.priest - 1) / 9);
        } else if (currentClass === ClassType.Mage) {
            cPlayer.str = (3 + (player.level / 3));
            cPlayer.agi = (6 + (player.level / 3));
            cPlayer.int = (11 + (player.level / 1.25));
            cPlayer.mhp = (7 + (cPlayer.str + cPlayer.agi) / 2.5) + (2.5 * player.level);
            cPlayer.mmp = (5 + (cPlayer.int / 1.5) + (4 * player.level));
            multiplier = 1 + ((player.clvl.mage - 1) / 9);
        } else if (currentClass === ClassType.Budoka) {
            cPlayer.str = (8 + (player.level / 0.8));
            cPlayer.agi = (5 + (player.level));
            cPlayer.int = (4 + (player.level / 3));
            cPlayer.mhp = (18 + (cPlayer.str + cPlayer.agi) / 1.5) + (3.5 * player.level);
            cPlayer.mmp = 0;
            multiplier = 1 + ((player.clvl.mage - 1) / 9);
        }

        if (multiplier > 0) {
            cPlayer.str = Math.floor(cPlayer.str * multiplier);
            cPlayer.agi = Math.floor(cPlayer.agi * multiplier);
            cPlayer.int = Math.floor(cPlayer.int * multiplier);
            cPlayer.mhp = Math.floor(cPlayer.mhp * multiplier);
            cPlayer.mmp = Math.floor(cPlayer.mmp * multiplier);
        }

        cPlayer.classLevel = player.clvl[currentClass];
        cPlayer.class = currentClass;

        return cPlayer;
    }
}
