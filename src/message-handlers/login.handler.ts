import * as pbkdf2 from "pbkdf2";
import { GameClient, IResponseObject, ServerData } from "../entities";
import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { DataLoadService } from "../services";
import { MapService } from "../services/map.service";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class LoginHandler extends MesssageHandlerBase {
    private static DEFAULT_ENCODING: string = "base64";

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {

        try {
            const userValue = await DataLoadService.loadUserData(this.gameObject.data.player_username);

            // check auth hash
            if (!userValue || !userValue.currentPasswordData) {
                return this.sendRejection();
            }

            const hash = this.createAuthHash(
                this.gameObject.data.password,
                userValue.currentPasswordData.passwordSalt
            );

            if (hash === userValue.currentPasswordData.passwordHash) {

                userValue.lastLoginDate = new Date(new Date().toISOString());
                await DataLoadService.saveUserData(userValue);

                this.client.username = userValue.username;
                this.client.authenticationHash = "PUTAHASHHERE"; // TOOD: put a hash here
                this.client.playerData = userValue.playerData;

                // Data with login:
                // - clientId: id of client object,
                // - tileData: data for all tiles to display
                // - maps: a list of all available map names

                const loginResponseObject = {
                    type: ResponseMessageType.Login,
                    visibility: VisibilityLevelType.Private,
                    clientId: this.client.clientId,
                    value: (true).toString(),
                    tileData: MapService.convertToTileBlob(this.serverData.tiles),
                    maps: this.serverData.mapNames,
                    childHandlers: null
                };

                return [loginResponseObject];
            }

            return this.sendRejection();
        } catch {
            return this.sendRejection();
        }
    }

    private createAuthHash(password: string, salt: string): string {
        // TODO: async this
        // TODO: append system wide secret to pw
        const result = pbkdf2.pbkdf2Sync(password, salt, 100, 64, "sha512");
        return result.toString(LoginHandler.DEFAULT_ENCODING);
    }

    private sendRejection(): IResponseObject[] {
        const loginResponseObject = {
            type: ResponseMessageType.Login,
            visibility: VisibilityLevelType.Private,
            clientId: this.client.clientId,
            value: (false).toString(),
            childHandlers: null
        };

        return [loginResponseObject];
    }
}
