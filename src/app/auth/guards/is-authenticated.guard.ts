import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);  

  if (authService.isAuthenticated()) {
    console.log('IsAuthenticated: Usuario autenticado')
    return true;
  } else {
    console.log('IsAuthenticated: Usuario no autenticado')
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  
};
