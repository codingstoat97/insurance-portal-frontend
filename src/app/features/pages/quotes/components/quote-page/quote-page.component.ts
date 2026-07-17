import { ScrollStrategy } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';
import { PlanPurchaseService } from 'src/app/core/services/plan-purchase/plan-purchase.service';

import { catchError, EMPTY } from 'rxjs';

import { Insurance, Plan, PlanBenefit, Region, Vehicle } from 'src/app/shared/models';
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
    private route: ActivatedRoute,
    private httpService: HttpService,
    private snackbarService: SnackBarService,
    private planPurchaseService: PlanPurchaseService
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
    this.httpService.get<Plan>(PATH.planGetByID + '/' + this.quoteId)
      .pipe(catchError(() => { this.snackbarService.error('Error al cargar el plan.'); return EMPTY; }))
      .subscribe(res => {
        this.quotePlan = res;
        this.fetchPlanBenefits();
        this.fetchInsuranceData();
        this.fetchRegionData();
        this.fetchVehicleData();
      });
  }

  private fetchPlanBenefits(): void {
    if (!this.quotePlan) return;
    this.httpService.get<PlanBenefit[]>(PATH.planBenefitsGetAllByPlan + '/' + this.quotePlan?.id)
      .pipe(catchError(() => { this.snackbarService.error('Error al cargar los beneficios del plan.'); return EMPTY; }))
      .subscribe(res => { this.planBenefits = res; });
  }

  private fetchInsuranceData(): void {
    if (!this.quotePlan) return;
    this.httpService.get<Insurance>(PATH.insuranceGetByID + '/' + this.quotePlan?.insuranceId)
      .pipe(catchError(() => { this.snackbarService.error('Error al cargar los datos de la aseguradora.'); return EMPTY; }))
      .subscribe(res => { this.insuranceData = res; });
  }

  private fetchRegionData(): void {
    if (!this.quotePlan) return;
    this.httpService.get<Region>(PATH.regionGetByID + '/' + this.quotePlan?.regionalId)
      .pipe(catchError(() => { this.snackbarService.error('Error al cargar los datos de la regional.'); return EMPTY; }))
      .subscribe(res => { this.regionData = res; });
  }

  private fetchVehicleData(): void {
    if (!this.quotePlan) return;
    this.httpService.get<Vehicle>(PATH.vehicleGetByID + '/' + this.quotePlan?.vehicleId)
      .pipe(catchError(() => { this.snackbarService.error('Error al cargar los datos del vehículo.'); return EMPTY; }))
      .subscribe(res => { this.vehicleData = res; });
  }

  openPurchaseDialog(): void {
    if (!this.quotePlan) return;
    this.planPurchaseService.openPurchaseDialog(this.quotePlan.id, this.insuranceData?.qrImage);
  }

  goBack(): void {
    this.location.back();
  }

}
