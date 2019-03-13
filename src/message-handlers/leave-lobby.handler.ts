import { GameLobbyModel } from "../client-models";
import { GameClient, IResponseObject, ServerData } from "../entities";
import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class LeaveLobbyHandler extends MesssageHandlerBase {
    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {
        const clientId = this.client.clientId;

        let lobbyId = null;
        let curLobby = null;

        // TODO: extract this same logic out for kicking another player

        if (this.gameObject && this.gameObject.data) {
            if (this.gameObject.data.lobbyId) {
                lobbyId = this.gameObject.data.lobbyId;
            }
        }

        if (!lobbyId) {
            // TODO: return error
            console.log(`${clientId} tried to leave a lobby, but didn't give a lobbyId`);
            return null;
        }

        for (let i = 0; i < this.serverData.lobbies.length; i++) {

            const lobby = this.serverData.lobbies[i];

            if (lobby.id === lobbyId) {
                for (let j = 0; j < lobby.players.length; j++) {
                    if (lobby.players[j].clientId === clientId) {

                        curLobby = lobby;

                        lobby.players.splice(j, 1);

                        lobby.playerCount = lobby.players.length;

                        if (lobby.playerCount === 0) {
                            this.serverData.lobbies.splice(i, 1);
                            console.log("Lobby empty; closed.");
                        }

                        break;
                    }
                }
                for (let j = 0; j < lobby.players.length; j++) {
                    // reassign player slots
                    lobby.players[j].slot = j + 1;
                }
            }

            break;
        }

        const lobbyLeftObject = {
            type: ResponseMessageType.PlayerLeft,
            visibility: VisibilityLevelType.Room,
            lobby: new GameLobbyModel(curLobby)
        };

        return [lobbyLeftObject];
    }
}
