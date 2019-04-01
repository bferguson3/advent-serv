import { Component } from '@angular/core';
import { ApiService } from '../../services';
import { UserData, PlayerData } from '../../core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent {
    public user: UserData;
    public addPlayerLink: string = '';

    private id: string;

    constructor(
        private apiService: ApiService,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
    ) {
        if (this.route && this.route.snapshot && this.route.snapshot.paramMap.get('id')) {

            const id = this.route.snapshot.paramMap.get('id');
            this.id = id;

            this.apiService.getUserData(id).subscribe((user: UserData) => {
                this.user = user;
                this.addPlayerLink = `/add-player/${id}/${this.user.username}`;
            });
        }
    }

    public deleteCharacter(
        character: PlayerData,
        index: number): void {

        this.apiService.deletePlayer(
            this.user.username,
            character,
            index).subscribe(() => {

            this.apiService.getUserData(this.id).subscribe((user: UserData) => {
                this.user = user;
                this.snackBar.open('Character deleted successfully!', 'OK', {
                    duration: 3000
                });
            });
        }, (err) => {
            let errorMessage = 'Error deleting character';

            if (err && err.status === 500 && typeof err.error === 'string') {
                errorMessage = err.error;
            }

            this.snackBar.open(errorMessage, 'OK', {
                duration: 3000
            });
        });
    }
}
