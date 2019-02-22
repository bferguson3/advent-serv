import { MesssageHandlerBase } from "./message-handler-base.handler";
import { GameClient, GameLobby, ServerData } from "../entities";
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

        const lobby: GameLobby = {
            id: GameUtilities.createLobbyId(),
            mapname: mapName,
            isLocked: isLocked,
            user: this.client.username,
            userId: this.client.clientId,
            playerCount: 1,
            players: [
                {
                    
                }
            ]
        };
    }
}
