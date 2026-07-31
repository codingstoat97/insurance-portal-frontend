import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'auth_role';

  constructor(private router: Router) { }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  setRole(role: string): void {
    localStorage.setItem(this.ROLE_KEY, role);
  }

  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  hasRole(...allowedRoles: string[]): boolean {
    const role = this.getRole();
    return !!role && allowedRoles.includes(role);
  }

  getRedirectionPath(): string {
    if (!this.isLoggedIn()) {
      return '/login';
    }
    const role = this.getRole();
    if(role == 'ROLE_ADMIN') {
      return '/admin';
    } else if (role == 'ROLE_BROKER') {
      return '/broker';
    } else {
      return '/login';
    }
  }

  clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    if (this.isTokenExpired(token)) {
      this.clearSession();
      return false;
    }
    return true;
  }

  private isTokenExpired(token: string): boolean {
    const payload = token.split('.')[1];
    if (!payload) return true;
    try {
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      if (!decoded.exp) return false;
      return Date.now() >= decoded.exp * 1000;
    } catch {
      return true;
    }
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/home']);
  }

}
