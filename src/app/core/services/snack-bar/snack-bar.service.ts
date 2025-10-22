import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  private base: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  };

  constructor(private sb: MatSnackBar) { }

  open(message: string, action: string = 'OK', config?: MatSnackBarConfig) {
    return this.sb.open(message, action, { ...this.base, ...config });
  }

  success(message: string, action = 'OK', config?: MatSnackBarConfig) {
    return this.open(message, action, { ...config, panelClass: ['snack-success'] });
  }

  error(message: string, action = 'Cerrar', config?: MatSnackBarConfig) {
    return this.open(message, action, { ...config, panelClass: ['snack-error'], duration: 5000 });
  }

  info(message: string, action = 'OK', config?: MatSnackBarConfig) {
    return this.open(message, action, { ...config, panelClass: ['snack-info'] });
  }

  warn(message: string, action = 'OK', config?: MatSnackBarConfig) {
    return this.open(message, action, { ...config, panelClass: ['snack-warn'] });
  }
}
