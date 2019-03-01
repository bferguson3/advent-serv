import { Peer } from "enet";
import { PlayerData } from "./player-data.entity";
export class GameClient {
    public clientId: string;
    public peerRef: Peer;
    public lastActivity: number;
    public authenticationHash: string;
    public username: string;
    public lobbyId: string;
    public playerData: PlayerData[];
}
