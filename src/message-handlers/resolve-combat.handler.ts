import { CombatActor, GameClient, IResponseObject, ServerData } from "../entities";
import { ResponseMessageType, VisibilityLevelType } from "../enums";
import { MesssageHandlerBase } from "./message-handler-base.handler";

export class ResolveCombatHandler extends MesssageHandlerBase {

    constructor(gameObject: any, client: GameClient, serverData: ServerData) {
        super(gameObject, client, serverData);
    }

    public async handleMessage(): Promise<IResponseObject[]> {

        const lobby = this.serverData.getLobby(this.client.lobbyId);
        const combatState = lobby.gameState.combatState;

        // determine turn order
        const unsortedActors: CombatActor[] = [];

        for (const player of lobby.players) {
            unsortedActors.push(new CombatActor(true, player.currentChar));
        }

        for (const enemyGroup of combatState.enemyGroups) {
            for (const enemy of enemyGroup.enemies) {
                unsortedActors.push(new CombatActor(false, enemy, enemyGroup.enemyType));
            }
        }

        const sortedActors = unsortedActors.sort((a, b) => {
            return b.calculatedSpeed - a.calculatedSpeed;
        });

        // calculate actions

        const responseObject = {
            type: ResponseMessageType.ResolveCombat,
            visibility: VisibilityLevelType.Room,
            childHandlers: null
        };

        return [responseObject];
    }
}
