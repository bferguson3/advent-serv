import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserListItem, UserData } from '../core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {
    constructor(
        private httpClient: HttpClient
    ) {}

    private readonly USER_API_PATH: string = 'user';

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
}
