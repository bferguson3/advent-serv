import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  UserListComponent,
  MapListComponent,
  UserComponent,
  AddUserComponent,
  AddPlayerComponent
} from './components';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent
  },
  {
    path: 'maps',
    component: MapListComponent
  },
  {
    path: 'user/:id',
    component: UserComponent
  },
  {
    path: 'add-user',
    component: AddUserComponent
  },
  {
    path: 'add-player/:id/:username',
    component: AddPlayerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
