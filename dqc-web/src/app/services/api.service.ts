import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserListItem, UserData, NewUser, NewPlayer } from '../core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {
    constructor(
        private httpClient: HttpClient
    ) {}

    private readonly USER_API_PATH: string = 'user';
    private readonly PLAYER_API_PATH: string = 'player';
    private readonly NEW_API_PATH: string = 'new';

    public getUserList(): Observable<UserListItem[]> {

        const call = this.httpClient
            .get<UserListItem[]>(`${environment.apiBase}${this.USER_API_PATH}`);

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

    public saveNewPlayer(player: NewPlayer): Observable<UserData> {

        const call = this.httpClient
            .post<UserData>(`${environment.apiBase}${this.PLAYER_API_PATH}/${this.NEW_API_PATH}/`, player);

        return call;
    }
}
