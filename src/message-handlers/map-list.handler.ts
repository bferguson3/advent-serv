import { MesssageHandlerBase } from "./message-handler-base.handler";
import { GameClient, ServerData, IResponseObject } from "../entities";
import { ResponseMessageType, VisibilityLevelType } from "../enums";

export class MapListHandler extends MesssageHandlerBase {

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public handleMessage(): IResponseObject {
        const mapListObject = {
            type: ResponseMessageType.MapList,
            visibility: VisibilityLevelType.Private,
            clientId: this.client.clientId,
            value: "MAP01"
        };
    
        return mapListObject;
    }
}