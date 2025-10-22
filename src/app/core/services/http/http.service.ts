import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private readonly url = "http://localhost:8080/";

  constructor(private http: HttpClient) { }

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(this.url + path);
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(this.url + path, body);
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(this.url + path, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(this.url + path);
  }

}
