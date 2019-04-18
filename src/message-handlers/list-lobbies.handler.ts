import { GameLobbyModel } from "../client-models";
import { GameClient, IResponseObject, ServerData } from "../entities";
import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class ListLobbiesHandler extends MesssageHandlerBase {

    private readonly LOBBIES_PER_PAGE: number = 10;

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {

        let page = 1;

        if (this.gameObject && this.gameObject.data && this.gameObject.data.page) {
            page = this.gameObject.data.page;
        }

        // page is not 0 based
        if (page > 0) {
            page--;
        }

        const lobbies: GameLobbyModel[] = [];
        const startNum = page * this.LOBBIES_PER_PAGE;
        const endNum = startNum + this.LOBBIES_PER_PAGE;

        for (let i = startNum; i < endNum; i++) {
            if (this.serverData.lobbies.length >= i + 1) {
                lobbies.push(new GameLobbyModel(this.serverData.lobbies[i]));
            }
        }

        const lobbyResponseObject = {
            type: ResponseMessageType.LobbyList,
            visibility: VisibilityLevelType.Private,
            pageNum: page,
            pageCount: this.serverData.lobbies.length === 0
                ? 1
                : Math.ceil(this.serverData.lobbies.length / this.LOBBIES_PER_PAGE),
            totalCount: this.serverData.lobbies.length,
            lobbies: lobbies,
            childHandlers: null
        };

        return [lobbyResponseObject];
    }
}
