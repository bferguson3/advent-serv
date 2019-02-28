import { GameClient, IResponseObject, ServerData } from "../entities";
import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class LoginHandler extends MesssageHandlerBase {
    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public handleMessage(): IResponseObject {

        let loginResponseValue: boolean;

        // TODO: really authenticate, maybe?
        if (this.gameObject.data.player_username === "guest" && this.gameObject.data.password === "password") {
            loginResponseValue = true;

            this.client.username = this.gameObject.data.player_username;
            this.client.authenticationHash = "PUTAHASHHERE"; // TOOD: put a hash here
        } else {
            loginResponseValue = false;
        }

        const loginResponseObject = {
            type: ResponseMessageType.Login,
            visibility: VisibilityLevelType.Private,
            clientId: this.client.clientId,
            value: loginResponseValue.toString()
        };

        return loginResponseObject;
    }
}
