import { GameClient, IResponseObject, ServerData } from "../entities";
import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class JoinLobbyHandler extends MesssageHandlerBase {
    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {
        let lobbyId = "";
        let joinedLobby = null;
        let pslot = 0;

        if (this.gameObject && this.gameObject.data && this.gameObject.data.lobbyId) {
            lobbyId = this.gameObject.data.lobbyId;
        }

        if (!lobbyId) {
            // TODO: return error
            return null;
        }

        for (const lobby of this.serverData.lobbies) {
            if (lobby.id === lobbyId) {
                pslot = lobby.players.length + 1;
                lobby.players.push({
                    clientId: this.client.clientId,
                    user: this.client.username,
                    slot: pslot
                });

                // keep current id on the client
                this.client.lobbyId = lobbyId;
                lobby.playerCount = lobby.players.length;
                joinedLobby = lobby;
            }

            break;
        }

        if (!joinedLobby) {
            return null;
        }

        const lobbyResponseObject = {
            type: ResponseMessageType.JoinedLobby,
            visibility: VisibilityLevelType.Room,
            lobby: joinedLobby,
            roomslot: pslot
        };

        return [lobbyResponseObject];
    }
}
