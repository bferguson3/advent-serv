import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { IResponseObject } from "../interfaces";
import { Player, ServerData } from "../models";
import { ProtectedMessageHandlerBase } from "./protected-message-handler-base.handler";

export class WorldStateMessageHandler extends ProtectedMessageHandlerBase {
    constructor(gameObject: any, player: Player, serverData: ServerData) {
        super(gameObject, player, serverData);
    }

    protected async runHandlerLogic(): Promise<IResponseObject[]> {
        const response = {
            type: ResponseMessageType.GlobalState,
            visibility: VisibilityLevelType.Private,
            playerId: this.player.id,
            ts: this.player.lastActivity,
            data: this.serverData.broadcastData
        };

        return [response];
    }
}
