import { Component } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/core/services/http/http.service';

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

  constructor(private fb: FormBuilder, private httpService: HttpService, private router: Router) { }

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
        console.log('login res =>', res);
        const token = res.token || res.token;

        if (token) {
          localStorage.setItem('auth_token', token);
          this.router.navigate(['/admin']);
        } else {
          console.error('No vino token en la respuesta');
        }
      },
      error: (err) => {
        console.error('Error en login', err);
      }
    });
  }

}
