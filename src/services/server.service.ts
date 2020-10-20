export class ServerService {
    public static GetCurrentUtcDate(): number {
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
}
