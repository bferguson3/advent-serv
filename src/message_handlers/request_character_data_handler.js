export function request_character_data_handler(gameObject, client, serverData) {

    // this will be pulled from a local database
    const tempPlayerDataObj = {
        type: "player_data",
        clientId: client.clientId,
        value: {
            name: 'Filius',
            sheet: 'assets/filius_sheet.png',
            level: 1,
            mhp: 30,
            mmp: 0,
            xp: 0,
            str: 10,
            agi: 5,
            int: 2,
            equipment: {}
        }
    };

    return tempPlayerDataObj;
}
