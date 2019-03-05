import { GameClient, IResponseObject, ServerData } from "../entities";
import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class MapListHandler extends MesssageHandlerBase {

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {
        const mapListObject = {
            type: ResponseMessageType.MapList,
            visibility: VisibilityLevelType.Private,
            clientId: this.client.clientId,
            value: "MAP01"
        };

        return [mapListObject];
    }
}
