import { GameClient } from "./game-client.entity";
import { GameLobby } from "./game-lobby.entity";
import { MapData } from "./map-data.entity";
import { TileData } from "./tile-data.entity";

export class ServerData {
    public clients: GameClient[] = [];
    public lobbies: GameLobby[] = [];
    public maps: MapData[] = [];
    public tiles: TileData[] = [];

    public getUser(clientId: string): GameClient {
        for (const client of this.clients) {
            if (client.clientId === clientId) {
                return client;
            }
        }

        return null;
    }
}
