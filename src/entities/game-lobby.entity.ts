import { GameState } from "./game-state.entity";
import { LobbyPlayerReference } from "./lobby-player-reference.entity";

export class GameLobby {
    public id: string;
    public mapname: string;
    public isLocked: boolean;
    public user: string;
    public userId: string;
    public playerCount: number;
    public players: LobbyPlayerReference[];
    public gameState: GameState;

    public getPlayerSlot(clientId: string): number {
        for (const playerRef of this.players) {
            if (playerRef.clientId === clientId) {
                return playerRef.slot;
            }
        }

        return 0;
    }
}
