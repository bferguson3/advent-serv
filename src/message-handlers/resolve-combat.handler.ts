import { GameClient, IResponseObject, ServerData } from "../entities";
import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class ResolveCombatHandler extends MesssageHandlerBase {

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {

        const responseObject = {
            type: ResponseMessageType.ResolveSpace,
            visibility: VisibilityLevelType.Room,
            childHandlers: null
        };

        return [responseObject];
    }
}
