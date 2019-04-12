import { GameLobbyModel } from "../client-models";
import { GameClient, GameLobby, IResponseObject, LobbyPlayerReference, ServerData } from "../entities";
import { ErrorType, ResponseMessageType, VisibilityLevelType } from "../enums";
import { ServerService } from "../services";
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

        const matchingMap = this.serverData.getMatchingMap(mapName);

        if (!matchingMap) {
            return this.createError(
                VisibilityLevelType.Private,
                ErrorType.InvalidMap);
        }

        const playerReference = new LobbyPlayerReference();
        playerReference.clientId = this.client.clientId;
        playerReference.user = this.client.username;
        playerReference.slot = 1;

        const lobby: GameLobby = new GameLobby();

        lobby.id = ServerService.createLobbyId();
        lobby.mapname = mapName;
        lobby.isLocked = isLocked;
        lobby.user = this.client.username;
        lobby.userId = this.client.clientId;
        lobby.gameState =  null;
        lobby.playerCount = 1;
        lobby.players = [
            playerReference
        ];

        this.client.lobbyId = lobby.id;

        this.serverData.lobbies.push(lobby);

        const lobbyResponseObject = {
            type: ResponseMessageType.Lobby,
            visibility: VisibilityLevelType.Private,
            lobby: new GameLobbyModel(lobby),
            childResponses: null
        };

        return [lobbyResponseObject];
    }
}
