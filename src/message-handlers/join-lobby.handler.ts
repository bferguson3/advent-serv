import { GameLobbyModel } from "../client-models";
import { GameClient, IResponseObject, ServerData } from "../entities";
import { ErrorType, ResponseMessageType, VisibilityLevelType } from "../enums";
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
            return this.createError(
                VisibilityLevelType.Private,
                ErrorType.InvalidLobby
            );
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

        const lobbyResponse: IResponseObject[] = [];

        // would be better to combine these somehow
        if (responseType === ResponseMessageType.JoinedLobby) {
            const lobbyModel = new GameLobbyModel(joinedLobby);

            // give player lobby data and room slot
            const playerResponseObject = {
                type: ResponseMessageType.JoinedLobby,
                visibility: VisibilityLevelType.Private,
                lobby: new GameLobbyModel(joinedLobby),
                roomslot: pslot
            };

            lobbyResponse.push(playerResponseObject);

            // give other players just the lobby info
            const roomResponseObject = {
                type: ResponseMessageType.LobbyUpdate,
                visibility: VisibilityLevelType.Room,
                lobby: lobbyModel
            };

            lobbyResponse.push(roomResponseObject);
        } else if (responseType === ResponseMessageType.LobbyFull) {
            const lobbyResponseObject = {
                type: ResponseMessageType.LobbyFull,
                visibility: VisibilityLevelType.Private,
            };

            lobbyResponse.push(lobbyResponseObject);
        }

        return lobbyResponse;
    }
}
