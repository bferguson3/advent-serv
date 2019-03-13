import { GameClient, GameLobby, GameState, IResponseObject, ServerData } from "../entities";
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

        let mapData: any = null;
        let matchingLobby: GameLobby = null;

        for (const lobby of this.serverData.lobbies) {
            if (lobby.id === lobbyId) {
                matchingLobby = lobby;

                for (const map of this.serverData.maps) {
                    if (map.Name === matchingLobby.mapname) {
                        mapData = MapService.convertToMapBlob(map);
                        break;
                    }
                }

                for (const player of matchingLobby.players) {
                    if (!player.currentChar) {
                        approval = false;
                    }
                }

                break;
            }
        }

        // initialize game state
        const gameState = new GameState();
        gameState.active_player = 1;
        gameState.current_turn = 1;
        gameState.flags = [];

        // start all players at 0 pos
        for (const player of matchingLobby.players) {
            gameState.player_positions.push(0);
        }

        if (!mapData || !matchingLobby) {
            // TODO: proper error handling here
            return;
        }

        matchingLobby.gameState = gameState;

        const gameStarterObject = {
            type: ResponseMessageType.StartGame,
            visibility: VisibilityLevelType.Room,
            value: approval,
            mapData: mapData,
            game: gameState
        };

        return [gameStarterObject];
    }
}
