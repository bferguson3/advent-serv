import { CombatActor, CombatResult, CombatState, GameClient, GameLobby, IResponseObject, ServerData } from "../entities";
import { CombatCommandType, ResponseMessageType, TargetScopeType, VisibilityLevelType } from "../enums";
import { GameService } from "../services";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class ResolveCombatHandler extends MesssageHandlerBase {

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {

        const lobby = this.serverData.getLobby(this.client.lobbyId);
        const combatState = lobby.gameState.combatState;

        const sortedActors = this.sortActors(lobby, combatState);

        // calculate actions
        const combatResults = this.createCombatResults(sortedActors);

        const responseObject = {
            type: ResponseMessageType.ResolveCombat,
            visibility: VisibilityLevelType.Room,
            childHandlers: null
        };

        return [responseObject];
    }

    private createCombatResults(
        combatActors: CombatActor[]): CombatResult[] {

        const results: CombatResult[] = [];

        for (const actor of combatActors) {
            const action = actor.combatTurnActions;

            const actorResults: CombatResult[] = [];

            if (action.targetScope === TargetScopeType.Single) {

                const result = new CombatResult();

                // initiator details
                result.initiatorNum = result.initiatorNum;
                result.initiatorGroupNum = result.initiatorGroupNum;

                // action details
                result.action = action.action;
                result.subAction = action.subAction;

                // target details
                result.targetGroupNum = action.targetGroupNum;
                result.targetNum = action.targetNum;
                result.targetTeam = action.targetTeam;

                // action details
                result.action = action.action;
                result.subAction = action.subAction;

                if (action.action === CombatCommandType.Attack) {
                    result.healResult = 0;
                    result.damageResult = this.calculateAttackDamage();
                }

                actorResults.push(result);

                // perform actual damage/heal/status changes on target
            }

            results.push(...actorResults);
        }

        return results;
    }

    private calculateAttackDamage(): number {
        return 0;
    }

    private sortActors(
        lobby: GameLobby,
        combatState: CombatState): CombatActor[] {

        // determine turn order
        const unsortedActors: CombatActor[] = [];

        for (const player of lobby.players) {
            if (combatState.turnActions.length >= player.slot) {
                unsortedActors.push(new CombatActor(
                    player.slot,
                    true,
                    player.currentChar,
                    combatState.turnActions[player.slot - 1]
                ));
            } else {
                // wtf something bad happened
            }
        }

        for (let i = 0; i < combatState.enemyGroups.length; i++) {
            const enemyGroup = combatState.enemyGroups[i];

            for (let j = 0; j < enemyGroup.enemies.length; j++) {
                const action = GameService.determineEnemyAction(
                    enemyGroup.enemyType,
                    enemyGroup.enemies[j],
                    lobby.players);

                unsortedActors.push(new CombatActor(
                    (j + 1),
                    false,
                    enemyGroup.enemies[j],
                    action,
                    enemyGroup.enemyType,
                    (i + 1)
                ));
            }
        }

        const sortedActors = unsortedActors.sort((a, b) => {
            return b.calculatedSpeed - a.calculatedSpeed;
        });

        return sortedActors;
    }
}
