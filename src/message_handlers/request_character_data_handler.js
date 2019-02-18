import { calculateStats } from "../character_data";

export function request_character_data_handler(gameObject, client, serverData) {

    const tempPlayer = {
        name: 'Filius',
        sheet: 'assets/filius_sheet.png',
        level: 1,
        currentClass: 'jester',
        classLevel: 0,
        clvl: {
            jester: 1,
            warrior: 1,
            priest: 1,
            thief: 1,
            mage: 1,
            budoka: 1,
        },
        equipment: {}
    };

    let playerObj = calculateStats(tempPlayer);
    
    // this will be pulled from a local database
    const playerResponse = {
        type: "player_data",
        clientId: client.clientId,
        value: playerObj
    };

    return playerResponse;
}
