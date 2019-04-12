import { CombatTurnActions, GameClient, IResponseObject, ServerData } from "../entities";
import { ErrorType, ResponseMessageType, TargetScopeType, TargetTeamType, VisibilityLevelType } from "../enums";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class SendCombatCommandHandler extends MesssageHandlerBase {

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {
        // TODO: possibly rework public lobby broadcasts to only require lobbyId
         // get the lobby associated with this player
        const clientId = this.client.clientId;
        const lobby = this
         .serverData
         .getLobby(this.client.lobbyId);

        if (!lobby || !lobby.gameState) {
            return this.createError(
                VisibilityLevelType.Room,
                ErrorType.GeneralServerError
            );
        }

        // TODO: error handling for missing data in gameObject.data

        const thiscombat = lobby.gameState.combatState;
        const pslot = lobby.getPlayerSlot(clientId);

        // TODO: check to make sure thiscombat.turnActions doesn't already include
        //  an entry for this player slot

        const newAction = new CombatTurnActions();
        newAction.slot = pslot;
        newAction.action = this.gameObject.data.command;
        // TODO: fix this
        newAction.subAction = null;
        // TODO: Add functionality to determine team type appropriately
        newAction.targetTeam = TargetTeamType.Enemies;
        // TODO: Add functionality to determine scope appropriately
        newAction.targetScope = TargetScopeType.Single;
        // Next two are taken from client packet
        newAction.targetGroupNum = this.gameObject.data.groupnum;
        newAction.targetNum = this.gameObject.data.targetnum;

        thiscombat.turnActions.push(newAction);

        const updateCombatCommandsObject = {
            type: ResponseMessageType.UpdateCombatCommands,
            visibility: VisibilityLevelType.Room,
            action: newAction,
            childResponses: null
        };

        return [updateCombatCommandsObject];
    }
}
