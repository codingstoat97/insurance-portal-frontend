import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { catchError, forkJoin, of } from 'rxjs';

import { HttpService } from 'src/app/core/services/http/http.service';
import { PlanPurchaseService } from 'src/app/core/services/plan-purchase/plan-purchase.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { Insurance, Plan, PlanBenefit } from 'src/app/shared/models';
import { LevelLabelPipe } from 'src/app/shared/pipes/level-pipe/level-label.pipe';
import * as PATH from 'src/app/shared/utils/request-paths.util';

@Component({
  selector: 'app-plan-comparison',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    LevelLabelPipe
  ],
  templateUrl: './plan-comparison.component.html',
  styleUrls: ['./plan-comparison.component.sass']
})
export class PlanComparisonComponent implements OnChanges {
  @Input() offers: Plan[] = [];
  @Input() insuranceMap = new Map<number, Insurance>();

  @Output() removeOffer = new EventEmitter<number>();
  @Output() closePanel = new EventEmitter<void>();

  benefitsByPlan = new Map<number, PlanBenefit[]>();
  loadingBenefits = false;

  constructor(
    private httpService: HttpService,
    private purchaseService: PlanPurchaseService
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

  contratar(offer: Plan): void {
    this.purchaseService.openPurchaseDialog(offer.id, this.insuranceMap.get(offer.insuranceId)?.qrImage);
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
