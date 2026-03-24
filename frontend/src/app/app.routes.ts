import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layout/dashboard-layout.component';
import { SearchUserComponent } from './features/search-user.component';
import { AddUserComponent } from './features/add-user.component';
import { DeleteUserComponent } from './features/delete-user.component';
import { ModifyUserComponent } from './features/modify-user.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '', redirectTo: 'search', pathMatch: 'full' },
      { path: 'search', component: SearchUserComponent },
      { path: 'add', component: AddUserComponent },
      { path: 'delete', component: DeleteUserComponent },
      { path: 'modify', component: ModifyUserComponent }
    ]
  }
];
