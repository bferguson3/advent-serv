import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '../../services';
import { UserData, NewPlayer } from '../../core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-add-player',
    templateUrl: './add-player.component.html',
    styleUrls: ['./add-player.component.scss']
})
export class AddPlayerComponent {

    public readonly DEFAULT_ERROR_MESSAGE: string = 'Error saving player';

    public isSubmitting: boolean = false;
    public hasError: boolean = false;
    public player: NewPlayer;
    public errorMessage: string = '';

    public genders: any[] = [
        {
            name: 'Male',
            value: 'M'
        },
        {
            name: 'Female',
            value: 'F'
        }
    ];

    public classes: any[] = [
        {
            name: 'Jester',
            value: 'jester'
        },
        {
            name: 'Warrior',
            value: 'warrior'
        },
        {
            name: 'Priest',
            value: 'priest'
        },
        {
            name: 'Thief',
            value: 'thief'
        },
        {
            name: 'Mage',
            value: 'mage'
        },
        {
            name: 'Budoka',
            value: 'budoka'
        }
    ];

    private userId: string = '';

    constructor(
        private apiService: ApiService,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location
    ) {
        this.player = new NewPlayer();
        let username: string = '';

        if (this.route && this.route.snapshot) {
            if (this.route.snapshot.paramMap.get('id')) {
                this.userId = this.route.snapshot.paramMap.get('id');
            }

            if (this.route.snapshot.paramMap.get('username')) {
                username = this.route.snapshot.paramMap.get('username');
            }
        }

        if (!username) {
            this.router.navigateByUrl('/');
        } else {
            this.player.username = username;
        }
    }

    public onCancelClick(): void {
        this.location.back();
    }

    public onSubmit(): void {
        this.isSubmitting = true;
        this.hasError = false;

        this.apiService.saveNewPlayer(this.player)
            .subscribe(() => {
                this.isSubmitting = false;

                let path: string = '';

                if (this.userId) {
                    path = `/user/${this.userId}`;
                }

                this.router.navigateByUrl(path);
            }, (err) => {
                this.hasError = true;
                this.isSubmitting = false;

                if (err && err.status === 500 && typeof err.error === 'string') {
                    this.errorMessage = err.error;
                } else {
                    this.errorMessage = this.DEFAULT_ERROR_MESSAGE;
                }
            });
    }
}
