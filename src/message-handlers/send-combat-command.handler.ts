import { GameLobbyModel } from "../client-models";
import { GameClient, IResponseObject, ServerData } from "../entities";
import { CombatCommandType, ErrorType, ResponseMessageType, TargetScopeType, TargetTeamType, VisibilityLevelType } from "../enums";
import { GameService } from "../services";
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

        const thiscombat = lobby.gameState.combatState;
        const pslot = lobby.getPlayerSlot(clientId);
        const newAction = thiscombat.turnActions[pslot];
        newAction.action = this.gameObject.command;
        // TODO: fix this
        newAction.subAction = null;
        // TODO: Add functionality to determine team type appropriately
        newAction.targetTeam = TargetTeamType.Enemies;
        // TODO: Add functionality to determine scope appropriately
        newAction.targetScope = TargetScopeType.Single;
        // Next two are taken from client packet
        newAction.targetGroupNum = this.gameObject.groupnum;
        newAction.targetNum = this.gameObject.targetnum;

        const updateCombatCommandsObject = {
            type: ResponseMessageType.UpdateCombatCommands,
            visibility: VisibilityLevelType.Room,
            lobby: new GameLobbyModel(lobby)
        };

        return [updateCombatCommandsObject];
    }
}
