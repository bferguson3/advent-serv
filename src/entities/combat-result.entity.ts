import { CombatCommandType, CommandSubactionType, StatusEffectType, TargetTeamType } from "../enums";

export class CombatResult {
    public initiatorGroupNum: number; // group of the enemy that initiated the action / null for players
    public initiatorNum: number; // # of enemy / slot of player that initiated the action

    public targetTeam: TargetTeamType;
    public targetGroupNum: number; // will be null for players
    public targetNum: number; // # of enemy, slot of player

    public action: CombatCommandType;
    public subAction: CommandSubactionType;

    public damageResult: number;
    public healResult: number;
    public statusEffects: StatusEffectType[] = [];
}
