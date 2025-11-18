import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private readonly url = "http://localhost:8080/";

  private token: string | null = '';
  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    this.token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  }

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(this.url + path, {
      headers: this.getAuthHeaders(),
    });
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(this.url + path, body, {
      headers: this.getAuthHeaders(),
    });
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(this.url + path, body, {
      headers: this.getAuthHeaders(),
    });
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(this.url + path, {
      headers: this.getAuthHeaders(),
    });
  }

}
