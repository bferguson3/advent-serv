import * as fs from "fs";
import * as pbkdf2 from "pbkdf2";
import * as randomstring from "randomstring";
import { Player, PlayerData } from "../models";

export class DataService {
    public static userDataPath: string = "./player-data";
    public static fileEncoding: string = "utf8";

    public static async setupDataService() {
        fs.mkdir(this.userDataPath, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }

            console.info(`Creating ${this.userDataPath}`);
        });
    }

    public static async playerExists(username: string): Promise<boolean> {
        const filePath = this.getUserPath(username);

        const promise = new Promise<boolean>((resolve, reject) => {
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    resolve(false);
                } else if (stats.isFile()) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });

        return promise;
    }

    public static async loadPlayer(username: string): Promise<Player> {
        let player: Player = null;

        try {
            const playerData = await this.readPlayerFile(username);
            player = playerData.toPlayer();
        } catch {
            throw new Error("Unable to load player file");
        }

        return player;
    }

    public static async authenticatePlayer(
        username: string,
        password: string): Promise<Player> {

        try {
            const playerData = await this.readPlayerFile(username);
            const hash = this.createAuthHash(password, playerData.passwordSalt);

            if (hash === playerData.passwordHash) {
                const player = playerData.toPlayer();
                return player;
            }
        } catch {
            // do nothing, just return null
        }

        return null;
    }

    public static async createPlayer(
        username: string,
        password: string,
        id: number,
        lastActivity: number): Promise<Player> {

        if (await this.playerExists(username)) {
            throw new Error("Player already exists");
        }

        try {
            const playerData = this.createPlayerData(username, password);
            playerData.lastActivity = lastActivity;
            await this.writePlayerFile(playerData);
            const player = playerData.toPlayer();
            player.id = id;
            return player;
        } catch {
            throw new Error("Unable to create player");
        }
    }

    public static async writePlayer(player: Player): Promise<void> {
        try {
            const playerData = await this.readPlayerFile(player.username);
            playerData.updateViaPlayer(player);
            await this.writePlayerFile(playerData);
        } catch {
            throw new Error("Unable to write player file");
        }
    }

    private static getUserPath(username: string): string {
        const path = `${this.userDataPath}/${username}.json`;
        return path;
    }

    private static readPlayerFile(username: string): Promise<PlayerData> {
        const path = this.getUserPath(username);

        const promise = new Promise<PlayerData>((resolve, reject) => {
            fs.readFile(path, this.fileEncoding, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const playerData: PlayerData = JSON.parse(data);
                    resolve(playerData);
                }
            });
        });

        return promise;
    }

    private static writePlayerFile(playerData: PlayerData): Promise<void> {
        if (!playerData || !playerData.username) {
            throw new Error("playerData must not be null and it must have a username");
        }

        const path = this.getUserPath(playerData.username);

        const promise = new Promise<void>(async (resolve, reject) => {
            const dataToWrite = JSON.stringify(playerData);

            fs.writeFile(path, dataToWrite, this.fileEncoding, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        return promise;
    }

    private static createPlayerData(username: string, password: string): PlayerData {
        const playerData = new PlayerData();

        playerData.username = username;
        playerData.passwordSalt = randomstring.generate(12);
        playerData.passwordHash = this.createAuthHash(password, playerData.passwordSalt);

        return playerData;
    }

    private static createAuthHash(password: string, salt: string): string {
        const encodedPassword = pbkdf2.pbkdf2Sync(password, salt, 100, 64, "sha512");
        const hash = encodedPassword.toString("base64");

        return hash;
    }
}
