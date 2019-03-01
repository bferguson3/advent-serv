import { GameClient, IResponseObject, ServerData } from "../entities";
import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class LoginHandler extends MesssageHandlerBase {
    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public handleMessage(): IResponseObject[] {

        let loginResponseValue: boolean;

        // TODO: really authenticate, maybe?
        if (this.gameObject.data.player_username === "guest" && this.gameObject.data.password === "password") {
            loginResponseValue = true;

            this.client.username = this.gameObject.data.player_username;
            this.client.authenticationHash = "PUTAHASHHERE"; // TOOD: put a hash here

            // TODO: load in player data instead of randomly creating it
            this.client.playerData = [
                {
                    name: "Filius",
                    sheet: "assets/filius_sheet.png",
                    level: 1,
                    currentClass: "jester",
                    classLevel: 0,
                    clvl: {
                        jester: 1,
                        warrior: 1,
                        priest: 1,
                        thief: 1,
                        mage: 1,
                        budoka: 1,
                    },
                    str: 0,
                    agi: 0,
                    int: 0,
                    mhp: 0,
                    mmp: 0,
                    equipment: {}
                },
                {
                    name: "Juno",
                    sheet: "assets/juno_sheet.png",
                    level: 1,
                    currentClass: "warrior",
                    classLevel: 0,
                    clvl: {
                        jester: 1,
                        warrior: 1,
                        priest: 1,
                        thief: 1,
                        mage: 1,
                        budoka: 1,
                    },
                    str: 0,
                    agi: 0,
                    int: 0,
                    mhp: 0,
                    mmp: 0,
                    equipment: {}
                }
            ];
        } else {
            loginResponseValue = false;
        }

        const loginResponseObject = {
            type: ResponseMessageType.Login,
            visibility: VisibilityLevelType.Private,
            clientId: this.client.clientId,
            value: loginResponseValue.toString()
        };

        return [loginResponseObject];
    }
}
