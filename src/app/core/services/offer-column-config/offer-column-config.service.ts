import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';

import { HttpService } from '../http/http.service';
import { OfferColumnConfig } from 'src/app/shared/models';
import * as PATH from 'src/app/shared/utils/request-paths.util';

@Injectable({
  providedIn: 'root'
})
export class OfferColumnConfigService {

  private readonly columnsSubject = new BehaviorSubject<OfferColumnConfig[]>([]);
  readonly columns$ = this.columnsSubject.asObservable();

  constructor(private httpService: HttpService) {
    this.refresh();
  }

  refresh(): void {
    this.httpService.get<OfferColumnConfig[]>(PATH.offerColumnConfigList)
      .pipe(catchError(() => of(null)))
      .subscribe(res => {
        if (res) this.columnsSubject.next(res);
      });
  }

  update(id: number, enabled: boolean): Observable<OfferColumnConfig> {
    return this.httpService.put<OfferColumnConfig>(`${PATH.offerColumnConfigUpdate}/${id}`, { enabled })
      .pipe(tap(res => {
        const updated = this.columnsSubject.value.map(c => c.id === res.id ? res : c);
        this.columnsSubject.next(updated);
      }));
  }
}