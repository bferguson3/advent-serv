import { RollResult } from "../entities";

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

    private static MIN_DIE_ROLL: number = 1;
}
