import { PasswordData } from "./password-data.entity";
import { PlayerData } from "./player-data.entity";

export class UserData {
    public username: string;
    public currentPasswordData: PasswordData;
    public playerData: PlayerData[];
    public passwordHistory: PasswordData[];
    public lastLoginDate: Date;
}
