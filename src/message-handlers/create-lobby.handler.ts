import { GameLobbyModel } from "../client-models";
import { GameClient, GameLobby, IResponseObject, LobbyPlayerReference, ServerData } from "../entities";
import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { GameUtilities } from "../utilities";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class CreateLobbyHandler extends MesssageHandlerBase {

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {
        let isLocked: boolean = false;
        let mapName: string = "";

        if (this.gameObject && this.gameObject.data) {
            if (this.gameObject.data.mapname) {
                mapName = this.gameObject.data.mapname;
            }

            if (this.gameObject.data.isLocked) {
                isLocked = this.gameObject.data.isLocked;
            }
        }

        if (!mapName) {
            // TODO: return error
        }

        const playerReference = new LobbyPlayerReference();
        playerReference.clientId = this.client.clientId;
        playerReference.user = this.client.username;
        playerReference.slot = 1;

        const lobby: GameLobby = {
            id: GameUtilities.createLobbyId(),
            mapname: mapName,
            isLocked: isLocked,
            user: this.client.username,
            userId: this.client.clientId,
            playerCount: 1,
            players: [
                playerReference
            ]
        };

        this.client.lobbyId = lobby.id;

        this.serverData.lobbies.push(lobby);

        const lobbyResponseObject = {
            type: ResponseMessageType.Lobby,
            visibility: VisibilityLevelType.Private,
            lobby: new GameLobbyModel(lobby)
        };

        return [lobbyResponseObject];
    }
}
