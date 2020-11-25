import { Enemy } from "./enemy.model";
import { Player } from "./player.model";

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

    public get authenticatedPlayers(): Player[] {
        const authPlayers = [];

        for (const player in this.players) {
            if (this.players[player].isAuthenticated()) {
                authPlayers.push(this.players[player]);
            }
        }

        return authPlayers;
    }
}
