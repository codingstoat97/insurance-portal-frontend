import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

import { HttpService } from '../http/http.service';
import { SnackBarService } from '../snack-bar/snack-bar.service';
import { QuoteStepperService } from '../quote-stepper/quote-stepper.service';

import { ClientPurchaseFormComponent, PurchaseDialogData } from 'src/app/shared/forms/client-purchase-form/client-purchase-form.component';

import { ClientPlan } from 'src/app/shared/models';
import * as PATH from 'src/app/shared/utils/request-paths.util';
import { getApiErrorMessage } from 'src/app/shared/utils/http-error.util';

@Injectable()
export class PlanPurchaseService {

  constructor(
    private dialog: MatDialog,
    private httpService: HttpService,
    private snackbarService: SnackBarService,
    private stepperService: QuoteStepperService
  ) { }

  openPurchaseDialog(planId: number): void {
    const vehicle = this.stepperService.clientVehicleData;
    const data: PurchaseDialogData = {
      planId,
      vehicleBrand: vehicle?.brand,
      vehicleModel: vehicle?.model,
      vehiclePrice: vehicle?.vehicleValue,
      clientName: vehicle?.clientName,
      clientEmail: vehicle?.clientEmail,
      clientPhone: vehicle?.clientPhone,
    };
    const dialogRef = this.dialog.open(ClientPurchaseFormComponent, {
      width: '760px',
      maxWidth: '95vw',
      maxHeight: '85vh',
      autoFocus: false,
      data
    });
    const sub1 = dialogRef.componentInstance.submitted?.subscribe((payload: ClientPlan) => {
      this.saveClientPlan(payload, dialogRef);
    });
    const sub2 = dialogRef.componentInstance.cancelled?.subscribe(() => {
      dialogRef.close();
    });

    dialogRef.afterClosed().subscribe(() => {
      sub1?.unsubscribe?.(); sub2?.unsubscribe?.();
    });
  }

  private saveClientPlan(clientPlan: ClientPlan, dialogRef: MatDialogRef<ClientPurchaseFormComponent>): void {
    const form = dialogRef.componentInstance;
    form.saving = true;
    dialogRef.disableClose = true;

    this.httpService.clientPost<ClientPlan>(PATH.clientPlanAdd, clientPlan)
      .pipe(finalize(() => {
        form.saving = false;
        dialogRef.disableClose = false;
      }))
      .subscribe({
        next: () => {
          this.snackbarService.success('Se guardaron los datos correctamente');
          dialogRef.close(true);
        },
        error: (error: unknown) => this.snackbarService.error(this.getSaveErrorMessage(error))
      });
  }

  private getSaveErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) return 'No se pudo conectar al servidor. Verifica tu conexión e intenta nuevamente.';
      if (error.status === 413) return 'Las fotos son demasiado pesadas. Intenta con imágenes más livianas.';
    }
    return getApiErrorMessage(error, 'Error al guardar los datos del cliente. Intenta nuevamente.');
  }
}
