import { CombatCommandType, CommandSubactionType, TargetScopeType, TargetTeamType } from "../enums";

export class CombatTurnActions {
    public action: CombatCommandType;
    public subAction: CommandSubactionType;
    public targetTeam: TargetTeamType;
    public targetScope: TargetScopeType;
    public targetGroupNum: number;
    public targetNum: number;
}
