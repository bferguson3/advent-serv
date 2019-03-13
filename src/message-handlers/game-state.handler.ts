import { GameClient, IResponseObject, ServerData } from "../entities";
import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class GameStateHandler extends MesssageHandlerBase {

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {

        const lobbyId = this.gameObject.data.lobbyId;

        for (const lobby of this.serverData.lobbies) {
            if (lobby.id === lobbyId) {
                const updateLobbyCharObject = {
                    type: ResponseMessageType.GameState,
                    visibility: VisibilityLevelType.Private,
                    game: lobby.gameState
                };

                return [updateLobbyCharObject];
            }
        }

        // TODO: error checking if an invalid/nonexistant lobby is passed by the client.
        return [];
    }
}
