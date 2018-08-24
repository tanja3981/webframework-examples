import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { ProfileComponent } from './profile.component';
import { ComplexComponent } from './complex.component';
import { ListComponent } from './list.component';

import { ListListComponent }          from './list/list.component';
import { ListDetailComponent }        from './list/detail.component';
import { ListEditComponent }       from './list/edit.component';

import { UserList } from './userlist';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'complex', component: ComplexComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'users', component: UserList},
  { path: 'list',
    component: ListComponent,
    children: [
        {
            path: '',
            component: ListListComponent
        },
        {
            path: ':id/view',
            component: ListDetailComponent
        },
        {
            path: ':id/edit',
            component: ListEditComponent
        }
    ]
    }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
