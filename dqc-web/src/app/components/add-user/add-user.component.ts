import { Component } from '@angular/core';
import { ApiService } from '../../services';
import { NewUser, UserData } from '../../core';
import { Form } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {

    public isSubmitting: boolean = false;
    public hasError: boolean = false;
    public user: NewUser;

    constructor(
        private apiService: ApiService,
        private router: Router
    ) {
        this.user = new NewUser();
    }

    public onSubmit(): void {
        this.isSubmitting = true;
        this.hasError = false;

        this.apiService.saveNewUser(this.user)
            .subscribe((userResult: UserData) => {
                if (userResult) {
                    this.router.navigateByUrl('/');
                } else {
                    this.hasError = true;
                }

                this.isSubmitting = false;
            }, (err) => {
                this.hasError = true;
                this.isSubmitting = false;
            });
    }
}
