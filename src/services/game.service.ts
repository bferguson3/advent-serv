import { Enemy, EnemyGroup, GameLobby, MapBoardItem, MapPosition, RollResult, ServerData } from "../entities";
import { EnemyType } from "../enums";

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
        serverData: ServerData,
        params: any): RollResult => {

        // TODO: figure out how many dice to roll based on player state
        const rollResult = GameService.rollDice(1, 6);

        let slot = gameLobby.getPlayerSlot(clientId);

        if (slot === 0) {
            throw new Error();
        }

        // if the last player in order has taken their turn, reduce dice_left in gamestate
        // should this be after resolve_space?
        if (slot === gameLobby.playerCount) {
            gameLobby.gameState.rolls_left -= 1;
        }

        // slot is 1 based index, player loc is 0 based array
        slot--;

        let pos = gameLobby.gameState.player_positions[slot];

        const map = gameLobby.getCurrentMap(serverData);

        // keeping track of remaining roll amount in order to be able to handle decision spots
        gameLobby.gameState.remaining_amount_in_roll = rollResult.total;

        while (gameLobby.gameState.remaining_amount_in_roll > 0) {
            // better handle non linear boards
            pos++;

            // have to loop all the spaces in case the board isn't completely linear
            let matchingSpace: MapBoardItem = null;

            for (const space of map.Board) {
                if (space.SpaceNumber === pos) {
                    matchingSpace = space;
                    break;
                }
            }

            // here is where we'll have to make a decision about the type of space and
            // if to terminate the loop early

            if (matchingSpace === null) {
                // hit the end of the board, position over at 1
                pos = 1;
            }

            gameLobby.gameState.remaining_amount_in_roll--;
        }

        gameLobby.gameState.player_positions[slot] = pos;

        return rollResult;
    }

    public static advanceTurn(
        gameLobby: GameLobby): void {

        // check to see if at last player
        if (gameLobby.gameState.active_player >= gameLobby.gameState.player_positions.length) {
            gameLobby.gameState.active_player = 1;
            gameLobby.gameState.current_turn++;
        } else {
            gameLobby.gameState.active_player++;
        }
    }

    public static triggeredCombat(mapPosition: MapPosition): boolean {
        // TODO: add encounter rate to map, not just to tile
        let combatPercentage: number = 0;

        if (mapPosition.tileData && mapPosition.tileData.EncounterRate) {
            combatPercentage = mapPosition.tileData.EncounterRate;
        }

        if (combatPercentage > 0) {
            const combatRoll = this.rollDice(1, 100).total;

            if (combatRoll <= combatPercentage) {
                return true;
            }
        }

        return false;
    }

    public static generateEnemies(mapPosition: MapPosition): EnemyGroup[] {
        const groups: EnemyGroup[] = [];

        // TODO: real generation based on the mapPosition
        // TODO: real population of stats via enemy stats

        const impRoll = this.rollDice(1, 2);
        const slimeRoll = this.rollDice(1, 2);

        const impGroup = new EnemyGroup();
        impGroup.enemyType = EnemyType.Imp;

        for (let i = 0; i < impRoll.total; i++) {
            const imp = new Enemy();
            imp.mhp = 6;
            imp.chp = 6;
            imp.statusEffects = [];

            impGroup.enemies.push(imp);
        }

        const slimeGroup = new EnemyGroup();
        slimeGroup.enemyType = EnemyType.Slime;

        for (let i = 0; i < slimeRoll.total; i++) {
            const slime = new Enemy();
            slime.mhp = 4;
            slime.chp = 4;
            slime.statusEffects = [];

            slimeGroup.enemies.push(slime);
        }

        groups.push(impGroup);
        groups.push(slimeGroup);

        return groups;
    }

    private static MIN_DIE_ROLL: number = 1;
}
