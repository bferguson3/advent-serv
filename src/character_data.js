export function calculateStats(player) {
    let cPlayer = player;
    
    let multiplier = 0;

    if (cPlayer.currentClass === "jester") {
        cPlayer.str = (6 + (cPlayer.level/2));
        cPlayer.agi = (6 + cPlayer.level);
        cPlayer.int = (4 + (cPlayer.level/2)); 
        cPlayer.mhp = (15 + ((cPlayer.str+cPlayer.agi)/2));
        cPlayer.mmp = (2 + (cPlayer.int/2) + cPlayer.level);
        multiplier = 1 + ((cPlayer.clvl.jester-1)/9);
    }

    cPlayer.str = Math.floor(cPlayer.str*multiplier);
    cPlayer.agi = Math.floor(cPlayer.agi*multiplier);
    cPlayer.int = Math.floor(cPlayer.int*multiplier);
    cPlayer.mhp = Math.floor(cPlayer.mhp*multiplier);
    cPlayer.mmp = Math.floor(cPlayer.mmp*multiplier);
    cPlayer.classLevel = cPlayer.clvl[cPlayer.currentClass];

    delete cPlayer.clvl;

    return cPlayer;
}