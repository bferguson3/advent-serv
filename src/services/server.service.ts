export class ServerService {
    public static GetCurrentUtcDate(): Date {
        return new Date(new Date().toUTCString());
    }
}
