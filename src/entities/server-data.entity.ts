import { GameClient } from "./game-client.entity";

export class ServerData {
    public clients: GameClient[] = [];
    public lobbies: any[] = [];

    public getUser(clientId: string): GameClient {
        for (const client of this.clients) {
            if (client.clientId === clientId) {
                return client;
            }
        }

        return null
    }
}
