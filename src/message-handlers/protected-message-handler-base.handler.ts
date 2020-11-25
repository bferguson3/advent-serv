import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { IResponseObject } from "../interfaces";
import { Player, ServerData } from "../models";
import { MessageHandlerBase } from "./message-handler-base.handler";

export abstract class ProtectedMessageHandlerBase extends MessageHandlerBase {

    constructor(gameObject: any, player: Player, serverData: ServerData) {
        super(gameObject, player, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {
        if (!this.player.isAuthenticated()) {
            const unauthPacket = {
                type: ResponseMessageType.Unauthenticated,
                visibility: VisibilityLevelType.Private,
                ts: this.player.lastActivity,
            };

            return [unauthPacket];
        }

        return await this.runHandlerLogic();
    }

    protected abstract runHandlerLogic(): Promise<IResponseObject[]>;
}
