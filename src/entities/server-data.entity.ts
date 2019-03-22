import { GameClient } from "./game-client.entity";
import { GameLobby } from "./game-lobby.entity";
import { MapData } from "./map-data.entity";
import { TileData } from "./tile-data.entity";
import { GameState } from "./game-state.entity";

export class ServerData {

    public clients: GameClient[] = [];
    public lobbies: GameLobby[] = [];
    public maps: MapData[] = [];
    public tiles: TileData[] = [];

    // tslint:disable-next-line:variable-name
    private _mapNames: string[] = [];

    public getUser(clientId: string): GameClient {
        for (const client of this.clients) {
            if (client.clientId === clientId) {
                return client;
            }
        }

        return null;
    }

    public populateMapNames(): void {
        const names: string[] = [];

        for (const map of this.maps) {
            names.push(map.Name);
        }

        this._mapNames = names;
    }

    public getMatchingMap(mapName: string): MapData {
        if (!mapName) {
            return null;
        }

        for (const map of this.maps) {
            if (map.Name === mapName) {
                return map;
            }
        }

        return null;
    }

    public get mapNames(): string[] {
        return this._mapNames;
    }

    public getGameState(lobbyId: string): GameState {
        for (const lobby of this.lobbies) {
            if (lobby.id === lobbyId) {
                return lobby.gameState;
            }
        }

        return null;
    }
}
