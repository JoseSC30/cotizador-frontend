import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomePageComponent } from './auth/pages/welcome-page/welcome-page.component';
import { isAuthenticatedGuard } from './auth/guards/is-authenticated.guard';
import { isNotAuthenticatedGuard } from './auth/guards/is-not-authenticated.guard';
import { roleGuard } from './auth/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: WelcomePageComponent,
    canActivate: [isNotAuthenticatedGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [isNotAuthenticatedGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
    canActivate: [isAuthenticatedGuard, roleGuard],
    data: {
      roles: ['user']
    }
  },
  {
    path:'',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [isAuthenticatedGuard, roleGuard],
    data: {
      roles: ['admin']
    }
  },
  {
    path: '**',
    redirectTo: '/',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
