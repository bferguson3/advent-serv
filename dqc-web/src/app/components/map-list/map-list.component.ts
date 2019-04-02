import { Component } from '@angular/core';
import { ApiListItem } from '../../core';
import { ApiService } from '../../services';
import { MatDialog, MatSnackBar } from '@angular/material';

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
        private matDialog: MatDialog,
        private snackBar: MatSnackBar
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

    public deleteMap(listItem: ApiListItem): void {
        this.apiService.deleteMap(listItem.link).subscribe(() => {
            this.updateMaps();
            this.snackBar.open(`${listItem.name} deleted successfully!`, 'OK', {
                duration: 3000
            });
        }, (err) => {
            this.updateMaps();
            this.snackBar.open(`Error deleting ${listItem.name}`, 'OK', {
                duration: 3000
            });
        });
    }

    private updateMaps(): void {
        this.apiService.getMapList().subscribe((mapList: ApiListItem[]) => {
            this.maps = mapList;
        });
    }
}
