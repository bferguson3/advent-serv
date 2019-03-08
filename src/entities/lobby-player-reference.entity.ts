import { PlayerData } from "./player-data.entity";

export class LobbyPlayerReference {
    public clientId: string;
    public user: string;
    public slot: number;
    public currentChar: PlayerData;
}
