import { Player } from "./player.model";

export class ServerData {
    public maxPlayerCount: number;
    public players: Player[];

    constructor(maxPlayerCount: number) {
        this.maxPlayerCount = maxPlayerCount;
        this.players = Array(maxPlayerCount).fill(null);
    }
}
