import { GameClient, IResponseObject, PlayerData, ServerData } from "../entities";
import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { PlayerService } from "../services";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class RequestCharacterDataHandler extends MesssageHandlerBase {
    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public handleMessage(): IResponseObject {
        const tempPlayer: PlayerData = {
            name: "Filius",
            sheet: "assets/filius_sheet.png",
            level: 1,
            currentClass: "jester",
            classLevel: 0,
            clvl: {
                jester: 1,
                warrior: 1,
                priest: 1,
                thief: 1,
                mage: 1,
                budoka: 1,
            },
            str: 0,
            agi: 0,
            int: 0,
            mhp: 0,
            mmp: 0,
            equipment: {}
        };

        const playerStats = PlayerService.calculateStats(tempPlayer);
        PlayerService.populatePlayerStats(tempPlayer, playerStats);

        // TODO: this will be pulled from a local database
        const playerResponse = {
            type: ResponseMessageType.PlayerData,
            visibility: VisibilityLevelType.Private,
            clientId: this.client.clientId,
            value: tempPlayer
        };

        return playerResponse;
    }
}
