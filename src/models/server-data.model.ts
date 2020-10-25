import { Enemy } from "./enemy.model";

export class ServerData {
    public maxPlayerCount: number;
    public players: {};
    public enemies: Enemy[];

    constructor(maxPlayerCount: number) {
        this.maxPlayerCount = maxPlayerCount;
        this.players = {};
        this.enemies = [];
    }

    public get broadcastData(): any {
        return {
            players: this.players,
            enemies: this.enemies
        };
    }
}
