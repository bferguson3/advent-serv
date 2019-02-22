import { MesssageHandlerBase } from "./message-handler-base.handler";
import { GameClient, GameLobby, ServerData, LobbyPlayerReference } from "../entities";
import { GameUtilities } from "../utilities";

export class CreateLobbyHandler extends MesssageHandlerBase {

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public handleMessage(): any {
        let isLocked: boolean = false;
        let mapName: string = "";

        if (this.gameObject && this.gameObject.data) {
            if (this.gameObject.data.mapname) {
                mapName = this.gameObject.data.mapName;
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
            type: "lobby",
            lobby: lobby
        };

        return lobbyResponseObject;
    }
}
