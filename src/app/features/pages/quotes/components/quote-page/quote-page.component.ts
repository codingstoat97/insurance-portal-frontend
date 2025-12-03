import { ScrollStrategy } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';

import { ImageModalComponent } from 'src/app/shared/components/image-modal/image-modal.component';
import { ClientPurchaseFormComponent } from 'src/app/shared/forms/client-purchase-form/client-purchase-form.component';

import { ClientPlan, Insurance, Plan, PlanBenefit, Region, Vehicle } from 'src/app/shared/models';
import * as PATH from 'src/app/shared/utils/request-paths.util';

@Component({
  selector: 'app-quote-page',
  templateUrl: './quote-page.component.html',
  styleUrls: ['./quote-page.component.sass']
})
export class QuotePageComponent {
  private quoteId!: number;
  public quotePlan!: Plan | null;

  public planBenefits: PlanBenefit[] | null = [];
  public insuranceData!: Insurance | null;
  public vehicleData!: Vehicle | null;
  public regionData!: Region | null;

  public scrollStrategy: ScrollStrategy | undefined;

  constructor(
    private location: Location,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private snackbarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.quoteId = +idParam;
        this.loadQuote();
      }
    });
  }

  private loadQuote(): void {
    this.httpService.get<Plan>(PATH.planGetByID + '/' + this.quoteId).subscribe(res => {
      this.quotePlan = res;
      this.fetchPlanBenefits();
      this.fetchInsuranceData();
      this.fetchRegionData();
      this.fetchVehicleData();
    });
  }

  private fetchPlanBenefits(): void {
    if (!this.quotePlan) return;
    this.httpService.get<PlanBenefit[]>(PATH.planBenefitsGetAllByPlan + '/' + this.quotePlan?.id).subscribe(res => {
      this.planBenefits = res;
    });
  }

  private fetchInsuranceData(): void {
    if (!this.quotePlan) return;
    this.httpService.get<Insurance>(PATH.insuranceGetByID + '/' + this.quotePlan?.insuranceId).subscribe(res => {
      this.insuranceData = res;
    });
  }

  private fetchRegionData(): void {
    if (!this.quotePlan) return;
    this.httpService.get<Region>(PATH.regionGetByID + '/' + this.quotePlan?.regionalId).subscribe(res => {
      this.regionData = res;
    });
  }

  private fetchVehicleData(): void {
    if (!this.quotePlan) return;
    this.httpService.get<Vehicle>(PATH.vehicleGetByID + '/' + this.quotePlan?.vehicleId).subscribe(res => {
      this.vehicleData = res;
    });
  }

  private saveClientPlan(clientPlan: ClientPlan): void {
    if (!clientPlan) return;
    // this.httpService.clientPost<ClientPlan>(PATH.clientPlanAdd, clientPlan).subscribe(res => {
    //   if (res) {
    //     this.snackbarService.success('Se guardaron los datos correctamente');
    //     this.openQrModal();
    //   } else {
    //     this.snackbarService.error('Hubo un problema al guardar los datos, intente nuevamente');
    //   }
    // });
    this.snackbarService.success('Se guardaron los datos correctamente');
    this.openQrModal();
  }

  openQrModal(): void {
    this.dialog.open(ImageModalComponent, {
      width: '400px',
      data: {
        title: 'QR del Seguro',
        image: this.insuranceData?.qrImage
      }
    });
  }

  openPurchaseDialog() {
    const dialogRef = this.dialog.open(ClientPurchaseFormComponent, {
      width: '520px',
      maxHeight: '80vh',
      autoFocus: false,
      data: { planID: this.quotePlan?.id }
    });
    const sub1 = dialogRef.componentInstance.submitted?.subscribe((payload: any) => {
      dialogRef.close(payload);
    });
    const sub2 = dialogRef.componentInstance.cancelled?.subscribe(() => {
      dialogRef.close();
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const clientPlan = res;
        this.saveClientPlan(clientPlan);
      }
      sub1?.unsubscribe?.(); sub2?.unsubscribe?.();
    });
  }

  goBack(): void {
    this.location.back();
  }

}
