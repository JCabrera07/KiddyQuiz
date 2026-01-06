import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Lógica INVERSA:
  // Si el usuario YA tiene un token (ya inició sesión)
  if (authService.getToken()) {
    // Lo redirigimos directamente al Dashboard
    router.navigate(['/estudiante/mis-clases']); 
    // Y BLOQUEAMOS la entrada a la página de Login
    return false; 
  }

  // Si no tiene token, dejamos que vea el Login
  return true;
};