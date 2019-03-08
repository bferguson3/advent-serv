import { GameClient, IResponseObject, ServerData } from "../entities";
import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class StartGameHandler extends MesssageHandlerBase {

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {
        let approval = true;
        const lobbyId = this.gameObject.data.lobbyId;

        for (let i = 0; i < this.serverData.lobbies.length; i++) {

            const lobby = this.serverData.lobbies[i];

            // TODO proper error message handling here
            if (lobby.id === lobbyId) {
                for (let j = 0; j < lobby.players.length; j++) {
                    if (!lobby.players[j].currentChar) {
                        approval = false;
                    }
                }
            }
            break;
        }
        
        const gameStarterObject = {
            type: ResponseMessageType.StartGame,
            visibility: VisibilityLevelType.Room,
            value: approval
        };

        return [gameStarterObject];
    }
}
