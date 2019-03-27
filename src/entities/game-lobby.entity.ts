import { GameState } from "./game-state.entity";
import { LobbyPlayerReference } from "./lobby-player-reference.entity";
import { MapPosition } from "./map-position.entity";
import { ServerData } from "./server-data.entity";

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

    public getCurrentMapPosition(serverData: ServerData): MapPosition {
        const currentPlayerIndex = this.gameState.active_player - 1;
        const currentPosition = this.gameState.player_positions[currentPlayerIndex];

        const mapData = serverData.getMatchingMap(this.mapname);
        let positionData: MapPosition = null;

        for (const mapItem of mapData.Board) {
            if (mapItem.SpaceNumber === currentPosition) {
                positionData = new MapPosition();
                positionData.slot = this.gameState.active_player;
                positionData.spaceNumber = mapItem.SpaceNumber;
                positionData.tileType = mapItem.TileType;
                positionData.tileData = mapItem.TileData;
            }
        }

        return positionData;
    }
}
