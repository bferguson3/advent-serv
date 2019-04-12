import { GameClient, IResponseObject, RollResult, ServerData } from "../entities";
import { ErrorType, ResponseMessageType, VisibilityLevelType } from "../enums";
import { GameService } from "../services/game.service";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class RollDiceHandler extends MesssageHandlerBase {

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {

        if (!this.gameObject || !this.gameObject.data || !this.gameObject.data.dicetype) {
            return this.createError(
                VisibilityLevelType.Private,
                ErrorType.InvalidDiceType
            );
        }

        const lobby = this
            .serverData
            .getLobby(this.client.lobbyId);

        // this should never happen, but just in case
        if (!lobby || !lobby.gameState) {
            return this.createError(
                VisibilityLevelType.Private,
                ErrorType.GeneralServerError
            );
        }

        const diceType = this.gameObject.data.dicetype;
        let params: any = {};

        if (this.gameObject.data.params) {
            params = this.gameObject.data.params;
        }

        let roll: RollResult;

        try {
            switch (diceType) {
                case "move":
                    // don't let anyone move if in active combat
                    if (lobby.gameState.combatState) {
                        throw new Error();
                    }

                    roll = GameService.rollPlayerMovement(
                            this.client.clientId,
                            lobby,
                            this.serverData,
                            params);
                    break;
            }
        } catch (err) {
            return this.createError(
                VisibilityLevelType.Room,
                ErrorType.ErrorRollingDice
            );
        }

        const lobbyResponseObject = {
            type: ResponseMessageType.DiceRollResult,
            visibility: VisibilityLevelType.Room,
            clientId: this.client.clientId,
            dicetype: diceType,
            game: lobby.gameState,
            result: roll,
            childResponses: null
        };

        return [lobbyResponseObject];
    }
}
