import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Revisa si existe un token
  if (authService.getToken()) {
    return true; // Si hay token, el usuario puede pasar
  } else {
    // Si no hay token, redirige a la página de login
    router.navigate(['/authentication/login']);
    return false; // Y no dejes que pase a la ruta protegida
  }
};