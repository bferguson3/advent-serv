import { GameClient, IResponseObject, ServerData } from "../entities";
import { ErrorType, ResponseMessageType, VisibilityLevelType } from "../enums";

export abstract class MesssageHandlerBase {
    public gameObject: any;
    public client: GameClient;
    public serverData: ServerData;

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        this.gameObject = gameObject;
        this.client = client;
        this.serverData = serverData;
    }

    public abstract handleMessage(): Promise<IResponseObject[]>;

    protected createError(
        visibilityLevel: VisibilityLevelType,
        errorType: ErrorType
    ): IResponseObject[] {

        const errorResponseObject = {
            type: ResponseMessageType.Error,
            visibility: visibilityLevel,
            error: errorType
        };

        return [errorResponseObject];
    }
}
