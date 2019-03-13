import { GameLobby, LobbyPlayerReference } from "../entities";

export class GameLobbyModel {
    public id: string;
    public mapname: string;
    public isLocked: boolean;
    public user: string;
    public userId: string;
    public playerCount: number;
    public players: LobbyPlayerReference[];

    constructor(gameLobby: GameLobby) {
        if (!gameLobby) {
            return;
        }

        this.id = gameLobby.id;
        this.mapname = gameLobby.mapname;
        this.isLocked = gameLobby.isLocked;
        this.user = gameLobby.user;
        this.userId = gameLobby.userId;
        this.playerCount = gameLobby.playerCount;
        this.players = gameLobby.players;
    }
}
