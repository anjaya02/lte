import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { DashboardLayoutComponent } from './layout/dashboard-layout.component';
import { SearchUserComponent } from './features/search-user.component';
import { AddUserComponent } from './features/add-user.component';
import { DeleteUserComponent } from './features/delete-user.component';
import { ModifyUserComponent } from './features/modify-user.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  // Public route - Login page
  {
    path: 'login',
    component: LoginComponent,
  },

  // Protected routes - require authentication
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [MsalGuard],
    children: [
      { path: '', redirectTo: 'search', pathMatch: 'full' },
      { path: 'search', component: SearchUserComponent },
      { path: 'add', component: AddUserComponent },
      { path: 'delete', component: DeleteUserComponent },
      { path: 'modify', component: ModifyUserComponent },
    ],
  },

  // Redirect any unknown routes to login
  { path: '**', redirectTo: 'login' },
];
