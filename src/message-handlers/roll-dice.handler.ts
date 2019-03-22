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

        const gameState = this
            .serverData
            .getGameState(this.client.lobbyId);

        // this should never happen, but just in case
        if (!gameState) {
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

        let rolls: RollResult;

        switch (diceType) {
            case "move":
                rolls = GameService.rollPlayerMovement(
                    this.client.clientId,
                    gameState,
                    params);
        }

        // Maybe need to split this up into different messages for the
        //  player that rolled the dice and another message for the rest of the
        //  room

        const lobbyResponseObject = {
            type: ResponseMessageType.DiceRollResult,
            visibility: VisibilityLevelType.Room,
            clientId: this.client.clientId,
            dicetype: diceType,
            game: gameState,
            roll: rolls ? rolls.rolls[0].toString() : ""
        };

        return [lobbyResponseObject];
    }
}
