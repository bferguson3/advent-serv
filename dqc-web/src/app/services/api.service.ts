import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiListItem, UserData, NewUser, NewPlayer, PlayerData } from '../core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {
    constructor(
        private httpClient: HttpClient
    ) {}

    private readonly USER_API_PATH: string = 'user';
    private readonly MAP_API_PATH: string = 'map';
    private readonly PLAYER_API_PATH: string = 'player';
    private readonly NEW_API_PATH: string = 'new';
    private readonly DELETE_API_PATH: string = 'delete';

    /* Users */
    public getUserList(): Observable<ApiListItem[]> {

        const call = this.httpClient
            .get<ApiListItem[]>(`${environment.apiBase}${this.USER_API_PATH}`);

        return call;
    }

    public getUserData(userLink: string): Observable<UserData> {

        const call = this.httpClient
            .get<UserData>(`${environment.apiBase}${this.USER_API_PATH}/${userLink}`);

        return call;
    }

    public saveNewUser(user: NewUser): Observable<UserData> {

        const call = this.httpClient
            .post<UserData>(`${environment.apiBase}${this.USER_API_PATH}/${this.NEW_API_PATH}/`, user);

        return call;
    }

    /* Characters */
    public saveNewPlayer(player: NewPlayer): Observable<UserData> {

        const call = this.httpClient
            .post<UserData>(`${environment.apiBase}${this.PLAYER_API_PATH}/${this.NEW_API_PATH}/`, player);

        return call;
    }

    public deletePlayer(user: string, player: PlayerData, index: number): Observable<void> {

        const deleteRequest = {
            username: user,
            playerName: player.name,
            playerIndex: index
        };

        const call = this.httpClient
            .post<void>(`${environment.apiBase}${this.PLAYER_API_PATH}/${this.DELETE_API_PATH}`, deleteRequest);

        return call;
    }

    /* Maps */
    public getMapList(): Observable<ApiListItem[]> {

        const call = this.httpClient
            .get<ApiListItem[]>(`${environment.apiBase}${this.MAP_API_PATH}`);

        return call;
    }

    public getMapUploadUrl(): string {
        return `${environment.apiBase}${this.MAP_API_PATH}`;
    }
}
