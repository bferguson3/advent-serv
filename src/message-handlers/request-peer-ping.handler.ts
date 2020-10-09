import { GameClient, IResponseObject, PlayerData, ServerData } from "../entities";
import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { PlayerService } from "../services";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class RequestPeerPingHandler extends MesssageHandlerBase {
    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {
        /*
        for (const player of this.client.playerData) {
            const stats = PlayerService.calculateStats(player);
            PlayerService.populatePlayerStats(player, stats);
            PlayerService.calculateDerivedStats(player);
        }
        */
        // TODO: this will be pulled from a local database
        const playerResponse = {
            type: ResponseMessageType.PingResponse,
            visibility: VisibilityLevelType.Private,
            clientId: this.client.clientId,
            value: this.client.lastActivity,
            childHandlers: null
        };

        return [playerResponse];
    }
}
