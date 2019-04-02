import { Component } from '@angular/core';
import { ApiService } from '../../services';
import { ApiListItem } from '../../core';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
    public users: ApiListItem[] = [];

    constructor(
        private apiService: ApiService
    ) {
        this.apiService.getUserList().subscribe((userList: ApiListItem[]) => {
            this.users = userList;
        });
    }

    public getRoute(user: ApiListItem): string {
        return `/user/${user.link}`;
    }
}
