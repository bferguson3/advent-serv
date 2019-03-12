import { GameClient, IResponseObject, ServerData } from "../entities";
import { MapType, ResponseMessageType, VisibilityLevelType } from "../enums";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class MapListHandler extends MesssageHandlerBase {

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {
        const maps: string[] = [];

        for (const map in MapType) {
            if (map) {
                maps.push(map);
            }
        }

        const mapListObject = {
            type: ResponseMessageType.MapList,
            visibility: VisibilityLevelType.Private,
            clientId: this.client.clientId,
            value: maps
        };

        return [mapListObject];
    }
}
