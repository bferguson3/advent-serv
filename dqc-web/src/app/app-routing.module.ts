import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent, MapListComponent, UserComponent, AddUserComponent } from './components';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
