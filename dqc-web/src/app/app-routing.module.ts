import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent, MapListComponent, UserComponent } from './components';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
