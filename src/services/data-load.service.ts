import * as fs from "fs";
import { UserData } from "../entities";

export class DataLoadService {

    // TODO: load in from env
    public static USER_DATA_PATH: string = "./user-data";

    public static async loadUserData(username: string): Promise<UserData> {

        let userData: UserData = null;

        try {
            userData = await this.readUserData(username);
        } catch {
            return null;
        }

        return userData;
    }

    public static async saveUserData(userData: UserData): Promise<void> {
        try {
            await this.writeUserData(userData);
        } catch {
            throw new Error("Error writing user data");
        }
    }

    private static readUserData(username: string): Promise<UserData> {
        const path = `${DataLoadService.USER_DATA_PATH}/${username}.json`;

        const promise = new Promise<UserData>((resolve, reject) => {
            fs.readFile(path, "utf8", (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const userData: UserData = JSON.parse(data);
                    resolve(userData);
                }
            });
        });

        return promise;
    }

    private static writeUserData(userData: UserData): Promise<void> {
        if (!userData || !userData.username) {
            throw new Error("userData must not be null and it must have a username");
        }

        const path = `${DataLoadService.USER_DATA_PATH}/${userData.username}.json`;

        const promise = new Promise<void>((resolve, reject) => {
            const dataToWrite = JSON.stringify(userData);

            fs.writeFile(path, dataToWrite, "utf8", (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        return promise;
    }
}
