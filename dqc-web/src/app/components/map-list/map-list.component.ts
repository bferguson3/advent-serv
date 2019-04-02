import { Component } from '@angular/core';
import { ApiListItem } from '../../core';
import { ApiService } from '../../services';
import { MatDialog } from '@angular/material';

import { AddMapComponent } from '../add-map/add-map.component';

@Component({
    selector: 'app-map-list',
    templateUrl: './map-list.component.html',
    styleUrls: ['./map-list.component.scss']
})
export class MapListComponent {
    public maps: ApiListItem[] = [];

    constructor(
        private apiService: ApiService,
        private matDialog: MatDialog
    ) {
        this.updateMaps();
    }

    public getRoute(map: ApiListItem): string {
        return `/map/${map.link}`;
    }

    public onAddMapsClick(): void {
        const dialogRef = this.matDialog.open(AddMapComponent, {});

        dialogRef.afterClosed().subscribe(() => {
            this.updateMaps();
        });
    }

    private updateMaps(): void {
        this.apiService.getMapList().subscribe((mapList: ApiListItem[]) => {
            this.maps = mapList;
        });
    }
}
