import { MesssageHandlerBase } from "./message-handler-base.handler";
import { GameClient, IResponseObject, ServerData } from "../entities";
import { ResponseMessageType, VisibilityLevelType } from "../enums";

export class ListLobbiesHandler extends MesssageHandlerBase {

    private readonly LOBBIES_PER_PAGE: number = 10;

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public handleMessage(): IResponseObject {
        
        let page = 0;

        if (this.gameObject && this.gameObject.data && this.gameObject.data.page) {
            page = this.gameObject.data.page;
        }

        const lobbies = [];
        const startNum = page * this.LOBBIES_PER_PAGE;
        const endNum = startNum + this.LOBBIES_PER_PAGE;

        for (let i = startNum; i < endNum; i++) {
            if (this.serverData.lobbies.length >= i+1) {
                lobbies.push(this.serverData.lobbies[i]);
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
            lobbies: this.serverData.lobbies
        };

        return lobbyResponseObject;
    }
}