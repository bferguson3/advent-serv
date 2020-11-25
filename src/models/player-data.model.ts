import { Player } from "./player.model";

export class PlayerData extends Player {
    public passwordHash: string;
    public passwordSalt: string;

    public static fromJson(jsonCopy: PlayerData): PlayerData {
        const copy = new PlayerData();
        copy.passwordHash = jsonCopy.passwordHash;
        copy.passwordSalt = jsonCopy.passwordSalt;
        copy.username = jsonCopy.username;
        copy.lastActivity = jsonCopy.lastActivity;

        return copy;
    }

    public toPlayer(): Player {
        const playerCopy = new Player();
        playerCopy.username = this.username;
        playerCopy.lastActivity = this.lastActivity;
        playerCopy.lHandPos = this.lHandPos;
        playerCopy.lHandRot = this.lHandRot;
        playerCopy.lHandObj = this.lHandObj;
        playerCopy.rHandPos = this.rHandPos;
        playerCopy.rHandRot = this.rHandRot;
        playerCopy.rHandObj = this.rHandObj;
        playerCopy.faceTx = this.faceTx;
        playerCopy.bodyTx = this.bodyTx;

        return playerCopy;
    }

    public updateViaPlayer(player: Player): void {
        this.lastActivity = player.lastActivity;
        this.lHandPos = player.lHandPos;
        this.lHandRot = player.lHandRot;
        this.lHandObj = player.lHandObj;
        this.rHandPos = player.rHandPos;
        this.rHandRot = player.rHandRot;
        this.rHandObj = player.rHandObj;
        this.faceTx = player.faceTx;
        this.bodyTx = player.bodyTx;
    }
}