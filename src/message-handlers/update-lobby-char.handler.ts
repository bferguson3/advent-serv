import { GameClient, IResponseObject, ServerData } from "../entities";
import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class UpdateLobbyCharacterHandler extends MesssageHandlerBase {

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {
        //TODO: error checking if an invalid/nonexistant lobby is passed by the client.
        // possibly rework public lobby broadcasts to only require lobbyId
        let lobbyId = this.gameObject.data.lobbyId;
        let curLobby = null;
        let clientId = this.client.clientId;

        //assign data from GO to lobby-player
        for (let i = 0; i < this.serverData.lobbies.length; i++) {

            const lobby = this.serverData.lobbies[i];

            if (lobby.id === lobbyId) {
                for (let j = 0; j < lobby.players.length; j++) {
                    if (lobby.players[j].clientId === clientId) {
                        lobby.players[j].currentChar = this.client.playerData[this.gameObject.data.characterNo].name; 
            
                        curLobby = lobby;
                        break;
                    }
                }
            }
        }

        if (!curLobby) {
            //TODO flesh this out?
            console.log('No lobby found for update character request');
            return null;
        }

        const updateLobbyCharObject = {
            type: ResponseMessageType.UpdateLobbyCharacter,
            visibility: VisibilityLevelType.Room,
            lobby: curLobby
        };

        return [updateLobbyCharObject];
    }
}
