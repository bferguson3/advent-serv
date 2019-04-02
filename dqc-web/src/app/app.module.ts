import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MomentModule } from 'ngx-moment';
import { MatFileUploadModule } from 'angular-material-fileupload';

import {
  MatToolbarModule,
  MatMenuModule,
  MatButtonModule,
  MatIconModule,
  MatTableModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatSelectModule,
  MatSnackBarModule,
  MatDialogModule
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiService } from './services';

import {
  AddMapComponent,
  UserListComponent,
  MapListComponent,
  UserComponent,
  AddUserComponent,
  AddPlayerComponent
} from './components';


@NgModule({
  declarations: [
    AppComponent,
    AddMapComponent,
    AddPlayerComponent,
    AddUserComponent,
    MapListComponent,
    UserComponent,
    UserListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSnackBarModule,
    MatFileUploadModule,
    MatDialogModule,
    HttpClientModule,
    MomentModule
  ],
  entryComponents: [
    AddMapComponent
  ],
  providers: [
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
