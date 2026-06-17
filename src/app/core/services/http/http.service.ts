import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { SKIP_AUTH } from '../../interceptors/auth.interceptor';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(this.baseUrl + path);
  }

  /** Public endpoint — no Bearer token, no global error handling. */
  clientPost<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.baseUrl + path, body, {
      context: new HttpContext().set(SKIP_AUTH, true),
    });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.baseUrl + path, body);
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.baseUrl + path, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(this.baseUrl + path);
  }
}
