import { GameClient, IResponseObject, ServerData } from "../entities";

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
}
