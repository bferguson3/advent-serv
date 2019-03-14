export abstract class GameUtilities {
    public static getUtcTimestamp(): number {
        const now = new Date();

        const utcTimestamp = Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() ,
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds(),
            now.getUTCMilliseconds()
        );

        return utcTimestamp;
    }

    public static createClientId(): string {
        return `${this.getUtcTimestamp()}-${this.createRandomId(4)}`;
    }

    public static createLobbyId(): string {
        return this.createRandomId(12);
    }

    private static createRandomId(length: number): string {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz".split("");

        let id = "";

        for (let i = 0; i < length; i++) {
            id += chars[Math.floor(Math.random() * chars.length)];
        }

        return id;
    }
}
