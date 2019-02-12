export function calculateStats(player) {
    let multiplier = 0;

    if (player.currentClass === "jester") {
        player.str = (6 + (player.level/2));
        player.agi = (6 + player.level);
        player.int = (4 + (player.level/2)); 
        player.mhp = (15 + ((player.str+player.agi)/2));
        player.mmp = (2 + (player.int/2) + player.level);
        multiplier = 1 + ((player.clvl.jester-1)/9);
    }

    player.str = Math.floor(player.str*multiplier);
    player.agi = Math.floor(player.agi*multiplier);
    player.int = Math.floor(player.int*multiplier);
    player.mhp = Math.floor(player.mhp*multiplier);
    player.mmp = Math.floor(player.mmp*multiplier);
}