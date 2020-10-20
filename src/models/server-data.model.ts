import { Enemy } from "./enemy.model";
import { Player } from "./player.model";

export class ServerData {
    public maxPlayerCount: number;
    public players: Player[];
    public enemies: Enemy[];

    constructor(maxPlayerCount: number) {
        this.maxPlayerCount = maxPlayerCount;
        this.players = Array(maxPlayerCount).fill(null);
        this.enemies = [];
    }
}
