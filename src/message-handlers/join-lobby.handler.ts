import { GameClient, IResponseObject, ServerData } from "../entities";
import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class JoinLobbyHandler extends MesssageHandlerBase {
    private readonly MAX_PLAYER_COUNT: number = 4;

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {
        let lobbyId = "";
        let joinedLobby = null;
        let pslot = 0;
        let responseType: ResponseMessageType;

        if (this.gameObject && this.gameObject.data && this.gameObject.data.lobbyId) {
            lobbyId = this.gameObject.data.lobbyId;
        }

        if (!lobbyId) {
            // TODO: return error
            return null;
        }

        for (const lobby of this.serverData.lobbies) {
            if (lobby.id === lobbyId) {

                if (lobby.playerCount === this.MAX_PLAYER_COUNT) {
                    responseType = ResponseMessageType.LobbyFull;
                    break;
                }

                pslot = lobby.players.length + 1;
                lobby.players.push({
                    clientId: this.client.clientId,
                    user: this.client.username,
                    slot: pslot,
                    currentChar: null
                });

                // keep current id on the client
                this.client.lobbyId = lobbyId;
                lobby.playerCount = lobby.players.length;
                joinedLobby = lobby;
                responseType = ResponseMessageType.JoinedLobby;
            }

            break;
        }

        if (responseType !== ResponseMessageType.JoinedLobby && responseType !== ResponseMessageType.LobbyFull) {
            return null;
        }

        let lobbyResponseObject: any;

        // would be better to combine these somehow
        if (responseType === ResponseMessageType.JoinedLobby) {
            lobbyResponseObject = {
                type: ResponseMessageType.JoinedLobby,
                visibility: VisibilityLevelType.Room,
                lobby: joinedLobby,
                roomslot: pslot
            };
        } else if (responseType === ResponseMessageType.LobbyFull) {
            lobbyResponseObject = {
                type: ResponseMessageType.LobbyFull,
                visibility: VisibilityLevelType.Private,
            };
        }

        return [lobbyResponseObject];
    }
}
