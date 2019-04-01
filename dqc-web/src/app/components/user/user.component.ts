import { Component } from '@angular/core';
import { ApiService } from '../../services';
import { UserData } from '../../core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent {
    public user: UserData;

    constructor(
        private apiService: ApiService,
        private route: ActivatedRoute
    ) {
        if (this.route && this.route.snapshot && this.route.snapshot.paramMap.get('id')) {

            const id = this.route.snapshot.paramMap.get('id');

            this.apiService.getUserData(id).subscribe((user: UserData) => {
                this.user = user;
            });
        }
    }
}
