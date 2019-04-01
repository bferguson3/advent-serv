import { Component } from '@angular/core';
import { ApiService } from '../../services';
import { UserListItem } from '../../core';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
    public users: UserListItem[] = [];

    constructor(
        private apiService: ApiService
    ) {
        this.apiService.getUserList().subscribe((userList: UserListItem[]) => {
            this.users = userList;
        });
    }

    public getRoute(user: UserListItem): string {
        return `/user/${user.link}`;
    }
}
