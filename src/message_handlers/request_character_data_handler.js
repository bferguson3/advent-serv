import { calculateStats } from "../character_data";

export function request_character_data_handler(gameObject, client, serverData) {

    // this will be pulled from a local database
    const tempPlayer = {
        type: "player_data",
        clientId: client.clientId,
        value: {
            name: 'Filius',
            sheet: 'assets/filius_sheet.png',
            level: 1,
            currentclass: 'jester',
            clvl: {
                jester: 1,
                warrior: 1,
                priest: 1,
                thief: 1,
                mage: 1,
                budoka: 1,
            },
            equipment: {}
        }
    };

    calculateStats(tempPlayer);

    return tempPlayer;
}
