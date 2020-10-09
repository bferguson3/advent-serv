import { GameClient, IResponseObject, PlayerData, ServerData } from "../entities";
import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { PlayerService } from "../services";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class RequestPeerPingHandler extends MesssageHandlerBase {
    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {
        
        const pingResponse = {
            type: ResponseMessageType.PingResponse,
            visibility: VisibilityLevelType.Private,
            clientId: this.client.clientId,
            value: this.client.lastActivity,
            childHandlers: null
        };

        return [pingResponse];
    }
}
