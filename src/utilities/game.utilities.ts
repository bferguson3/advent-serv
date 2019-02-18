export abstract class GameUtilities {
    public static getUtcTimestamp(): number {
        const now = new Date;
    
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
    
    public static createLobbyId(): string {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz".split("");
        const length = 12;
    
        let lobbyId = "";
    
        for (var i = 0; i < length; i++) {
            lobbyId += chars[Math.floor(Math.random() * chars.length)];
        }
        
        return lobbyId;
    }
}
