import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth/auth.service';
import { SnackBarService } from '../services/snack-bar/snack-bar.service';

/**
 * Set this token to true on a request to skip Bearer token injection
 * and global error handling. Use for public endpoints (e.g. login).
 *
 * Usage:
 *   this.http.post(url, body, {
 *     context: new HttpContext().set(SKIP_AUTH, true)
 *   });
 */
export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_AUTH)) {
    return next(req);
  }

  const authService = inject(AuthService);
  const snackBar = inject(SnackBarService);
  const router = inject(Router);

  const token = authService.getToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          authService.logout();
          snackBar.error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
          break;

        case 403:
          router.navigate(['/home']);
          snackBar.warn('No tienes permiso para acceder a este recurso.');
          break;

        case 500:
          snackBar.error('Error en el servidor. Por favor intenta más tarde.');
          break;

        default:
          if (error.status === 0) {
            snackBar.error('No se pudo conectar al servidor. Verifica tu conexión.');
          }
      }

      return throwError(() => error);
    })
  );
};
