import { GameClient, IResponseObject, ServerData, MapPosition } from "../entities";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class ResolveSpaceHandler extends MesssageHandlerBase {

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {

        // get the lobby associated with this player
        const lobby = this
            .serverData
            .getLobby(this.client.lobbyId);

        // determine the space that the current slot is on


        // return data about the space
    }
}
