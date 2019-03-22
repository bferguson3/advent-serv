import { GameState, RollResult } from "../entities";

export class GameService {

    public static rollDice(
        count: number,
        sides: number): RollResult {

        const result = new RollResult();

        for (let i = 0; i < count; i++) {
            const randomNum = Math.floor(Math.random() * (sides - GameService.MIN_DIE_ROLL + 1)) + GameService.MIN_DIE_ROLL;

            result.total += randomNum;
            result.rolls.push(randomNum);
        }

        return result;
    }

    // Movement functions
    public static rollPlayerMovement = (
        clientId: string,
        gameState: GameState,
        params: any): RollResult => {

        // TODO: figure out how many dice to roll based on player state
        const rollResult = GameService.rollDice(1, 6);

        // TODO: move player

        return rollResult;
    }

    private static MIN_DIE_ROLL: number = 1;
}
