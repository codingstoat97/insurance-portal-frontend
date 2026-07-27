import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, EMPTY } from 'rxjs';

import { HttpService } from '../http/http.service';
import { SnackBarService } from '../snack-bar/snack-bar.service';

import { ClientPurchaseFormComponent } from 'src/app/shared/forms/client-purchase-form/client-purchase-form.component';

import { ClientPlan } from 'src/app/shared/models';
import * as PATH from 'src/app/shared/utils/request-paths.util';

@Injectable()
export class PlanPurchaseService {

  constructor(
    private dialog: MatDialog,
    private httpService: HttpService,
    private snackbarService: SnackBarService
  ) { }

  openPurchaseDialog(planId: number): void {
    const dialogRef = this.dialog.open(ClientPurchaseFormComponent, {
      width: '760px',
      maxWidth: '95vw',
      maxHeight: '85vh',
      autoFocus: false,
      data: { planId }
    });
    const sub1 = dialogRef.componentInstance.submitted?.subscribe((payload: ClientPlan) => {
      dialogRef.close(payload);
    });
    const sub2 = dialogRef.componentInstance.cancelled?.subscribe(() => {
      dialogRef.close();
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.saveClientPlan(res);
      }
      sub1?.unsubscribe?.(); sub2?.unsubscribe?.();
    });
  }

  private saveClientPlan(clientPlan: ClientPlan): void {
    this.httpService.clientPost<ClientPlan>(PATH.clientPlanAdd, clientPlan)
      .pipe(catchError(() => { this.snackbarService.error('Error al guardar los datos del cliente.'); return EMPTY; }))
      .subscribe(() => {
        this.snackbarService.success('Se guardaron los datos correctamente');
      });
  }
}