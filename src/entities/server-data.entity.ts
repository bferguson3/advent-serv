import { GameClient } from "./game-client.entity";
import { GameLobby } from "./game-lobby.entity";
import { MapData } from "./map-data.entity";

export class ServerData {
    public clients: GameClient[] = [];
    public lobbies: GameLobby[] = [];
    public maps: MapData[] = [];

    public getUser(clientId: string): GameClient {
        for (const client of this.clients) {
            if (client.clientId === clientId) {
                return client;
            }
        }

        return null;
    }
}
