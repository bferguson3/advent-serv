import { GameLobbyModel } from "../client-models";
import { GameClient, IResponseObject, ServerData } from "../entities";
import { ErrorType, ResponseMessageType, VisibilityLevelType } from "../enums";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class UpdateLobbyCharacterHandler extends MesssageHandlerBase {

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {
        // TODO: possibly rework public lobby broadcasts to only require lobbyId
        const lobbyId = this.gameObject.data.lobbyId;
        let curLobby = null;
        const clientId = this.client.clientId;

        // assign data from GO to lobby-player
        for (const lobby of this.serverData.lobbies) {
            if (lobby.id === lobbyId) {
                for (const player of lobby.players) {
                    if (player.clientId === clientId) {
                        player.currentChar = this.client.playerData[this.gameObject.data.characterNo];
                        curLobby = lobby;
                        break;
                    }
                }
                break;
            }
        }

        if (!curLobby) {
            return this.createError(
                VisibilityLevelType.Private,
                ErrorType.InvalidLobby
            );
        }

        const updateLobbyCharObject = {
            type: ResponseMessageType.UpdateLobbyCharacter,
            visibility: VisibilityLevelType.Room,
            lobby: new GameLobbyModel(curLobby),
            childResponses: null
        };

        return [updateLobbyCharObject];
    }
}
