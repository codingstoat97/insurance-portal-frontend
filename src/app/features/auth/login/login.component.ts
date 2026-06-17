import { Component } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';

interface LoginResponse {
  token?: string;
  role?: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder, private httpService: HttpService, private router: Router, private route: ActivatedRoute, private authService: AuthService, private snackbar: SnackBarService) { }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.value;
    this.login(payload);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  private login(payload: any): void {
    this.httpService.post<LoginResponse>('auth/login', payload).subscribe({
      next: (res) => {
        const token = res.token;
        const role = res.role;

        if (!token) {
          console.error('No vino token en la respuesta');
          return;
        }
        if (!role) {
          console.error('No vino role en la respuesta');
          return;
        }

        this.authService.setToken(token);
        this.authService.setRole(role);

        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
          return;
        }
        const path = this.authService.getRedirectionPath();
        this.router.navigate([path]);
      },
      error: () => {
        this.snackbar.error('Error al iniciar sesión. Verifica tus credenciales.');
      }
    });
  }

}
