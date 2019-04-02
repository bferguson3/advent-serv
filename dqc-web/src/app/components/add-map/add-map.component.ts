import { Component } from '@angular/core';
import { ApiService } from '../../services';

@Component({
    selector: 'app-add-map',
    templateUrl: './add-map.component.html',
    styleUrls: ['./add-map.component.scss']
})
export class AddMapComponent {

    public fileUploadUrl: string = '';

    constructor(
        private apiService: ApiService
    ) {
        this.fileUploadUrl = this.apiService.getMapUploadUrl();
    }
}
