import { GameClient, IResponseObject, ServerData } from "../entities";
import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { MapService } from "../services/map.service";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class StartGameHandler extends MesssageHandlerBase {

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {
        let approval = true;
        const lobbyId = this.gameObject.data.lobbyId;
        const mapId = this.gameObject.data.map;

        let mapData: any = null;

        if (mapId) {
            for (const map of this.serverData.maps) {
                if (map.Name === mapId) {
                    mapData = MapService.convertToMapBlob(map);
                    break;
                }
            }

            for (const lobby of this.serverData.lobbies) {
                // TODO proper error message handling here
                if (lobby.id === lobbyId) {
                    for (const player of lobby.players) {
                        if (!player.currentChar) {
                            approval = false;
                        }
                    }

                    break;
                }
            }
        }

        const gameStarterObject = {
            type: ResponseMessageType.StartGame,
            visibility: VisibilityLevelType.Room,
            value: approval,
            mapData: mapData
        };

        return [gameStarterObject];
    }
}
