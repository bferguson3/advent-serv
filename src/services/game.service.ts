import { GameLobby, RollResult } from "../entities";

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

    // Dice roll functions
    public static rollPlayerMovement = (
        clientId: string,
        gameLobby: GameLobby,
        params: any): RollResult => {

        // TODO: figure out how many dice to roll based on player state
        const rollResult = GameService.rollDice(1, 6);

        let slot = gameLobby.getPlayerSlot(clientId);

        if (slot === 0) {
            throw new Error();
        }
        // if the last player in order has taken their turn, reduce dice_left in gamestate
        if (slot === gameLobby.playerCount) {
            gameLobby.gameState.rolls_left -= 1;
        }

        // slot is 1 based index, player loc is 0 based array
        slot--;

        const pos = gameLobby.gameState.player_positions[slot];

        // TODO: check actual board
        gameLobby.gameState.player_positions[slot] = pos + rollResult.total;

        return rollResult;
    }

    private static advanceTurn(
        gameLobby: GameLobby): void {

        
    }

    private static MIN_DIE_ROLL: number = 1;
}
