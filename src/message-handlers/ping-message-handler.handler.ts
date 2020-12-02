import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { IResponseObject } from "../interfaces";
import { Player, ServerData } from "../models";
import { MessageHandlerBase } from "./message-handler-base.handler";

export class PingMessageHandler extends MessageHandlerBase {
    constructor(gameObject: any, player: Player, serverData: ServerData) {
        super(gameObject, player, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {
        const response = {
            visibility: VisibilityLevelType.Private,
            channel: 0,
            data: {
                type: ResponseMessageType.PingResponse,
                playerId: this.player.id,
                ts: this.player.lastActivity
            }
        };

        return [response];
    }
}
