import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';

import { HttpService } from '../http/http.service';
import { SalesConfig } from 'src/app/shared/models';
import * as PATH from 'src/app/shared/utils/request-paths.util';

@Injectable({
  providedIn: 'root'
})
export class SalesConfigService {

  private readonly enabledSubject = new BehaviorSubject<boolean>(true);
  readonly enabled$ = this.enabledSubject.asObservable();

  constructor(private httpService: HttpService) {
    this.refresh();
  }

  refresh(): void {
    this.httpService.get<SalesConfig>(PATH.salesConfigPath)
      .pipe(catchError(() => of(null)))
      .subscribe(res => {
        if (res) this.enabledSubject.next(res.enabled);
      });
  }

  update(enabled: boolean): Observable<SalesConfig> {
    return this.httpService.put<SalesConfig>(PATH.salesConfigPath, { enabled })
      .pipe(tap(res => this.enabledSubject.next(res.enabled)));
  }
}
