import { IResponseObject } from "../interfaces";
import { Player, ServerData } from "../models";

export abstract class MessageHandlerBase {
    public gameObject: any;
    public player: Player;
    public serverData: ServerData;

    constructor(gameObject: any, player: Player, serverData: ServerData) {
        this.gameObject = gameObject;
        this.player = player;
        this.serverData = serverData;
    }

    public abstract handleMessage(): Promise<IResponseObject[]>;
}
