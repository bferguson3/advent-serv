import { EncounterTemplate, EncounterTemplateGroup, Enemy, EnemyGroup, GameLobby, MapBoardItem, MapData, MapPosition, RollResult, ServerData } from "../entities";
import { EnemyType, TerrainType } from "../enums";

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

    public static generateEnemies(
        mapPosition: MapPosition,
        mapData: MapData): EnemyGroup[] {

        const groups: EnemyGroup[] = [];

        // TODO: real population of stats via enemy stats

        let terrain: TerrainType;

        if (mapPosition.tileData.Terrain) {
            terrain = mapPosition.tileData.Terrain;
        } else {
            terrain = TerrainType.All;
        }

        const possibleEncounters: EncounterTemplateGroup[] = [];

        for (const encounter of mapData.EncounterTable) {
            if (encounter.terrain) {
                const encounterTerrain = encounter.terrain.toLowerCase();

                if (encounterTerrain === terrain || encounterTerrain === TerrainType.All) {
                    possibleEncounters.push(encounter);
                }
            }
        }

        if (possibleEncounters.length > 0) {
            const selectedEncounterIndex = (this.rollDice(1, possibleEncounters.length).total - 1);
            const selectedEncounter = possibleEncounters[selectedEncounterIndex];

            for (const encounterTemplate of selectedEncounter.encounters) {
                const encounterRoll = this.rollDice(1, encounterTemplate.max).total + (encounterTemplate.min - 1);

                if (encounterRoll < 1) {
                    continue;
                }

                const enemyGroup = new EnemyGroup();
                enemyGroup.enemyType = encounterTemplate.type;
                enemyGroup.enemies = [];

                for (let i = 0; i < encounterRoll; i++) {
                    const enemy = new Enemy();

                    // TODO: pull this from data
                    switch (enemyGroup.enemyType) {
                        case EnemyType.Imp:
                            enemy.chp = 6;
                            enemy.mhp = 6;
                            break;
                        default:
                            enemy.chp = 4;
                            enemy.mhp = 4;
                            break;
                    }

                    enemy.statusEffects = [];

                    enemyGroup.enemies.push(enemy);
                }

                groups.push(enemyGroup);
            }

            return groups;
        } else {
            // we have a problem... not sure yet how to handle
            return [];
        }
    }

    private static MIN_DIE_ROLL: number = 1;
}
