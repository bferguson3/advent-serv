import { GameClient, IResponseObject, ServerData } from "../entities";
import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { GameService } from "../services/game.service";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class RollDiceHandler extends MesssageHandlerBase {

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {

        let numDice: number = 1;
        let numSides: number = 6;

        if (this.gameObject && this.gameObject.data) {
            if (this.gameObject.data.count) {
                numDice = this.gameObject.data.count;
            }

            if (this.gameObject.data.sides) {
                numSides = this.gameObject.data.sides;
            }
        }

        const result = GameService.rollDice(numDice, numSides);

        // Maybe need to split this up into different messages for the
        //  player that rolled the dice and another message for the rest of the
        //  room

        const lobbyResponseObject = {
            type: ResponseMessageType.DiceRollResult,
            visibility: VisibilityLevelType.Room,
            result: result
        };

        return [lobbyResponseObject];
    }
}
