import { GameClient, GameLobby, GameState, IResponseObject, ServerData } from "../entities";
import { ErrorType, ResponseMessageType, VisibilityLevelType } from "../enums";
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
        gameState.rolls_left = mapData.dice;
        gameState.flags = [];

        for (const player of matchingLobby.players) {
            // start all players at tile 1
            gameState.player_positions.push(1);

            // initizliaze ephemeral player data
            player.currentChar.chp = player.currentChar.mhp;
            player.currentChar.cmp = player.currentChar.mmp;
            player.currentChar.statusEffects = [];
        }

        if (!mapData) {
            return this.createError(
                VisibilityLevelType.Room,
                ErrorType.InvalidMap
            );
        }

        if (!matchingLobby) {
            return this.createError(
                VisibilityLevelType.Private,
                ErrorType.InvalidLobby
            );
        }

        matchingLobby.gameState = gameState;

        const gameStarterObject = {
            type: ResponseMessageType.StartGame,
            visibility: VisibilityLevelType.Room,
            value: approval,
            mapData: mapData,
            game: gameState,
            childResponses: null
        };

        return [gameStarterObject];
    }
}
