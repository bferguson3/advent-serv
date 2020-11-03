import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { IResponseObject } from "../interfaces";
import { Player, ServerData } from "../models";
import { MessageHandlerBase } from "./message-handler-base.handler";
import { DataService } from "../services/data.service";


export class LoginMessageHandler extends MessageHandlerBase {
    constructor(gameObject: any, player: Player, serverData: ServerData) {
        super(gameObject, player, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {

        const username = this.gameObject.data.username;
        const password = this.gameObject.data.password;

        let authenticatedPlayer: Player = null;

        if (await DataService.playerExists(username)) {
            authenticatedPlayer = await DataService.authenticatePlayer(username, password);
        } else {
            authenticatedPlayer = await DataService.createPlayer(
                username,
                password,
                this.player.id,
                this.player.lastActivity);
        }

        if (authenticatedPlayer !== null) {
            this.copyPlayerProperties(authenticatedPlayer, this.player);
        }

        const response = {
            type: ResponseMessageType.Login,
            visibility: VisibilityLevelType.Private,
            ts: this.player.lastActivity,
            player: authenticatedPlayer
        };

        return [response];
    }

    private copyPlayerProperties(source: Player, target: Player): void {
        target.username = source.username;
        target.lHandPos = source.lHandPos;
        target.lHandRot = source.lHandRot;
        target.lHandObj = source.lHandObj;
        target.rHandPos = source.rHandPos;
        target.rHandRot = source.rHandRot;
        target.rHandObj = source.rHandObj;
        target.faceTx = source.faceTx;
        target.bodyTx = source.bodyTx;
    }
}
