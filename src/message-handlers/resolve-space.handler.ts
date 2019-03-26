import { GameClient, IResponseObject, ServerData } from "../entities";
import { ErrorType, ResponseMessageType, VisibilityLevelType } from "../enums";
import { MesssageHandlerBase } from "./message-handler-base.handler";
import { GameService } from "../services";

export class ResolveSpaceHandler extends MesssageHandlerBase {

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {

        // get the lobby associated with this player
        const lobby = this
            .serverData
            .getLobby(this.client.lobbyId);

        if (!lobby || !lobby.gameState) {
            return this.createError(
                VisibilityLevelType.Room,
                ErrorType.GeneralServerError
            );
        }

        // determine the space that the current slot is on
        const mapPosition = lobby.getCurrentMapPosition(this.serverData);

        // TODO: some switch statement with the map position tiletype... maybe make a separate service when we have more logic
        let tileType: string;

        switch (mapPosition.tileType) {
            default:
                tileType = "empty";
                GameService.advanceTurn(lobby);
                break;
        }

        const responseObject = {
            type: ResponseMessageType.ResolveSpace,
            visibility: VisibilityLevelType.Room,
            tileType: tileType,
            game: lobby.gameState
        };

        return [responseObject];
    }
}
