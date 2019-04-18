import { CombatActor, CombatResult, CombatState, GameClient, GameLobby, IResponseObject, ServerData } from "../entities";
import { CombatCommandType, ResponseMessageType, TargetScopeType, TargetTeamType, VisibilityLevelType } from "../enums";
import { GameService, PlayerService } from "../services";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class ResolveCombatHandler extends MesssageHandlerBase {

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {

        const lobby = this.serverData.getLobby(this.client.lobbyId);
        const combatState = lobby.gameState.combatState;

        // update all derived stats
        for (const player of lobby.players) {
            PlayerService.calculateDerivedStats(player.currentChar);
        }

        // sort turn order
        const sortedActors = this.sortActors(lobby, combatState);

        // calculate actions
        const combatResults = this.createCombatResults(
            lobby,
            sortedActors);

        const responseObject = {
            type: ResponseMessageType.ResolveCombat,
            visibility: VisibilityLevelType.Room,
            childHandlers: null,
            results: combatResults
        };

        return [responseObject];
    }

    private createCombatResults(
        lobby: GameLobby,
        combatActors: CombatActor[]): CombatResult[] {

        const results: CombatResult[] = [];

        for (const actor of combatActors) {
            const action = actor.combatTurnActions;

            const actorResults: CombatResult[] = [];

            if (action.targetScope === TargetScopeType.Single) {

                let targetActor: CombatActor = null;

                if (action.targetTeam === TargetTeamType.Allies) {
                    targetActor = this.getPlayerCombatActorBySlot(action.targetNum, combatActors);
                } else if (action.targetTeam === TargetTeamType.Enemies) {
                    targetActor = this.getEnemyCombatActorByTargetNum(
                        action.targetGroupNum,
                        action.targetNum,
                        combatActors);
                }

                if (targetActor === null) {
                    continue;
                }

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
                    result.damageResult = this.calculateAttackDamage(actor, targetActor);
                }

                actorResults.push(result);

                // perform actual damage/heal/status changes on target
                targetActor.actor.chp -= result.damageResult;
                targetActor.actor.chp += result.healResult;
            }

            results.push(...actorResults);
        }

        return results;
    }

    private calculateAttackDamage(
        sourceActor: CombatActor,
        targetActor: CombatActor): number {

        if (!sourceActor || !targetActor || !sourceActor.actor || !targetActor.actor) {
            return 0;
        }

        const sourceAtp: number = sourceActor.actor.atp;
        const targetDfp: number = sourceActor.actor.dfp;
        let damage: number = 0;

        if (targetDfp < (sourceAtp * 0.25)) {
            damage = sourceAtp * 2;
        } else if (targetDfp > (sourceAtp * 4)) {
            damage = 1;
        } else {
            damage = sourceAtp * (sourceAtp / (targetDfp * 2));
        }

        // see if randomization should be added or not
        if (Math.random() >= 0.5) {
            damage += GameService.rollDice(1, 2).total;
        }

        return Math.floor(damage);
    }

    private getPlayerCombatActorBySlot(
        slot: number,
        combatActors: CombatActor[]): CombatActor {

        for (const actor of combatActors) {
            if (actor.isPlayer && actor.initiatorNum === slot) {
                return actor;
            }
        }

        return null;
    }

    private getEnemyCombatActorByTargetNum(
        targetGroupNum: number,
        targetNum: number,
        combatActors: CombatActor[]): CombatActor {

        for (const actor of combatActors) {
            if (!actor.isPlayer && actor.initiatorGroupNum === targetGroupNum && actor.initiatorNum === targetNum) {
                return actor;
            }
        }

        return null;
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
