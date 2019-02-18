import { Peer } from "enet";
export class GameClient { 
    public clientId: string;
    public peerRef: Peer;
    public lastActivity: number;
    public authenticationHash: string;
}
