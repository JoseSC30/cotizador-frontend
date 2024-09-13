import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';
import { AlertsService } from 'src/app/shared/services/toast.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const location = inject(Location);
  const alertsService = inject(AlertsService);

  const expectedRoles = route.data['roles'] as Array<string>;

  // const userRoles = authService.getCurrentUser()?.roles;
  const role = authService.getCurrentRole();
  console.log('RoleGuard: role', role);
  
  if (!role || !expectedRoles.includes(role)) {
    alertsService.toast(
      'Acceso denegado. No tiene permisos para acceder a la página',
      'error'
    );
    location.back();
    console.log('RoleGuard: Usuario no tiene permisos');
    return false;
  }
  
  // if (!userRoles || !userRoles.some((role) => expectedRoles.includes(role))) {
  //   // router.navigate(['/forbidden']);
  //   alertsService.toast(
  //     'Acceso denegado. No tiene permisos para acceder a la página',
  //     'error'
  //   );
  //   location.back();
  //   return false;
  // }

  console.log('RoleGuard: Usuario tiene permisos');
  return true;
};
