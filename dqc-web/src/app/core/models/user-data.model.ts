import { PasswordData } from './password-data.model';
import { PlayerData } from './player-data.model';

export class UserData {
    public username: string;
    public currentPasswordData: PasswordData;
    public playerData: PlayerData[];
    public passwordHistory: PasswordData[];
    public lastLoginDate: Date;
}
