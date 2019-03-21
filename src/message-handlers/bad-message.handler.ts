import { GameClient, IResponseObject, ServerData } from "../entities";
import { ErrorType, VisibilityLevelType } from "../enums";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class BadMessageHandler extends MesssageHandlerBase {

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {
        return this.createError(
            VisibilityLevelType.Private,
            ErrorType.InvalidMessageType);
    }
}
