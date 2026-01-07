import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const allowedRoles = (route.data?.['roles'] as string[]) ?? [];

  if (allowedRoles.length === 0) return true;

  const role = auth.getRole();
  const canAccess = !!role && allowedRoles.includes(role);

  if (!canAccess) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};

