import { IResponseObject } from "../interfaces";
import { Player, ServerData } from "../models";
import { ProtectedMessageHandlerBase } from "./protected-message-handler-base.handler";

export class UpdateMessageHandler extends ProtectedMessageHandlerBase {
    constructor(gameObject: any, player: Player, serverData: ServerData) {
        super(gameObject, player, serverData);
    }

    protected async runHandlerLogic(): Promise<IResponseObject[]> {

        this.player.pos = this.gameObject.data.pos;
        this.player.rot = this.gameObject.data.rot;
        this.player.lHandPos = this.gameObject.data.lHandPos;
        this.player.lHandRot = this.gameObject.data.lHandRot;
        this.player.lHandObj = this.gameObject.data.lHandObj;
        this.player.rHandPos = this.gameObject.data.rHandPos;
        this.player.rHandRot = this.gameObject.data.rHandRot;
        this.player.rHandObj = this.gameObject.data.rHandObj;
        this.player.faceTx = this.gameObject.data.faceTx;
        this.player.bodyTx = this.gameObject.data.bodyTx;

        this.serverData.players[this.player.id] = this.player;

        // don't send a response
        return [];
    }
}
