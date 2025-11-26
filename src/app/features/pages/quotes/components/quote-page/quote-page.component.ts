import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HttpService } from 'src/app/core/services/http/http.service';

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
  public insuranceData!: Insurance;
  public vehicleData!: Vehicle;
  public regionData!: Region;

  constructor(
    private route: ActivatedRoute,
    private httpService: HttpService
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

  loadQuote(): void {
    this.httpService.get<Plan>(PATH.planGetByID + '/' + this.quoteId).subscribe(res => {
      this.quotePlan = res;
      this.fetchPlanBenefits();
      this.fetchInsuranceData();
      this.fetchRegionData();
      this.fetchVehicleData();
    });
  }

  fetchPlanBenefits(): void {
    if (!this.quotePlan) return;
    this.httpService.get<PlanBenefit[]>(PATH.planBenefitsGetAllByPlan + '/' + this.quotePlan?.id).subscribe(res => {
      this.planBenefits = res;
    });
  }

  fetchInsuranceData(): void {
    if (!this.quotePlan) return;
    this.httpService.get<Insurance>(PATH.insuranceGetByID + '/' + this.quotePlan?.insuranceId).subscribe(res => {
      this.insuranceData = res;
    });
  }

  fetchRegionData(): void {
    if (!this.quotePlan) return;
    this.httpService.get<Region>(PATH.regionGetByID + '/' + this.quotePlan?.regionalId).subscribe(res => {
      this.regionData = res;
    });
  }

  fetchVehicleData(): void {
    if (!this.quotePlan) return;
    this.httpService.get<Vehicle>(PATH.vehicleGetByID + '/' + this.quotePlan?.vehicleId).subscribe(res => {
      this.vehicleData = res;
    });
  }

}
