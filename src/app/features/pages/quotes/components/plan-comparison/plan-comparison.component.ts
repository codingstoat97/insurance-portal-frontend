import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { catchError, forkJoin, of } from 'rxjs';

import { HttpService } from 'src/app/core/services/http/http.service';
import { PlanPurchaseService } from 'src/app/core/services/plan-purchase/plan-purchase.service';
import { SalesConfigService } from 'src/app/core/services/sales-config/sales-config.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { Insurance, Plan, PlanBenefit } from 'src/app/shared/models';
import * as PATH from 'src/app/shared/utils/request-paths.util';

@Component({
  selector: 'app-plan-comparison',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule
  ],
  templateUrl: './plan-comparison.component.html',
  styleUrls: ['./plan-comparison.component.sass']
})
export class PlanComparisonComponent implements OnChanges {
  @Input() offers: Plan[] = [];
  @Input() insuranceMap = new Map<number, Insurance>();
  @Input() maxCompare = 3;

  @Output() removeOffer = new EventEmitter<number>();
  @Output() closePanel = new EventEmitter<void>();

  benefitsByPlan = new Map<number, PlanBenefit[]>();
  loadingBenefits = false;
  readonly salesEnabled$ = this.salesConfigService.enabled$;

  constructor(
    private httpService: HttpService,
    private purchaseService: PlanPurchaseService,
    private salesConfigService: SalesConfigService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['offers']) {
      this.loadBenefits();
    }
  }

  get benefitNames(): string[] {
    const names = new Set<string>();
    this.benefitsByPlan.forEach(list => list.forEach(b => names.add(b.benefitName)));
    return Array.from(names);
  }

  hasBenefit(planId: number, benefitName: string): boolean {
    return !!this.benefitsByPlan.get(planId)?.some(b => b.benefitName === benefitName);
  }

  insuranceName(insuranceId: number): string {
    return this.insuranceMap.get(insuranceId)?.name || 'Sin nombre';
  }

  primaAlContado(offer: Plan): number {
    const premium = Number(offer?.minimumPremium) || 0;
    const rate = Number(offer?.rate) || 0;
    return premium + (premium * (rate / 100));
  }

  primaACredito(offer: Plan): number {
    const contado = this.primaAlContado(offer);
    const interest = Number(offer?.interest) || 0;
    return contado + (contado * interest);
  }

  contratar(offer: Plan): void {
    this.purchaseService.openPurchaseDialog(offer.id);
  }

  private loadBenefits(): void {
    if (this.offers.length === 0) {
      this.benefitsByPlan = new Map();
      return;
    }
    this.loadingBenefits = true;
    const requests = this.offers.map(offer =>
      this.httpService.get<PlanBenefit[]>(PATH.planBenefitsGetAllByPlan + '/' + offer.id)
        .pipe(catchError(() => of([] as PlanBenefit[])))
    );
    forkJoin(requests).subscribe(results => {
      this.benefitsByPlan = new Map(this.offers.map((offer, i) => [offer.id, results[i]]));
      this.loadingBenefits = false;
    });
  }
}
