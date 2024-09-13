import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserCurrent } from '../interfaces/user.interface';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router); 
  
  
  if (authService.isAuthenticated()) {
    // const user = authService.getCurrentUser();
    const role = authService.getCurrentRole();
    
    if (role === 'user') {
      router.navigate(['/dashboard/home']);
    } else if (role === 'admin') {
      router.navigate(['/home']);
    } else if (role === 'asesor') {
      // router.navigate(['/asesor/home']);
    }
    
    // if (user?.roles.includes('user')) {
    //   router.navigate(['/dashboard/home']);
    // } else if (user?.roles.includes('admin')) {
    //   // TODO: Redirect to admin dashboard
    // }
    console.log('IsNotAuthenticated: Usuario autenticado')
    return false;
  } else {
    console.log('IsNotAuthenticated: Usuario no autenticado')
    return true;
  }
  
};
