import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { catchError, EMPTY } from 'rxjs';

import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { QuoteOfferComponent } from "../quote-offer/quote-offer.component";
import { PlanComparisonComponent } from "../plan-comparison/plan-comparison.component";

import { Insurance, Plan } from 'src/app/shared/models';
import * as PATHS from 'src/app/shared/utils/request-paths.util'

const MAX_COMPARE = 3;

@Component({
  selector: 'app-offer-list',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    QuoteOfferComponent,
    PlanComparisonComponent
  ],
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.sass']
})
export class OfferListComponent implements OnInit {

  @Input() offerList: any[] = [];
  insuranceMap = new Map<number, Insurance>();
  selectedIds = new Set<number>();
  selectedOffers: Plan[] = [];
  readonly maxCompare = MAX_COMPARE;

  constructor(private httpService: HttpService, private snackbar: SnackBarService) { }

  ngOnInit(): void {
    this.loadInsurances();
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  toggleCompare(planId: number): void {
    if (this.selectedIds.has(planId)) {
      this.selectedIds.delete(planId);
    } else {
      if (this.selectedIds.size >= this.maxCompare) {
        this.snackbar.info(`Puedes comparar hasta ${this.maxCompare} planes a la vez.`);
        return;
      }
      this.selectedIds.add(planId);
    }
    this.syncSelection();
  }

  removeFromComparison(planId: number): void {
    this.selectedIds.delete(planId);
    this.syncSelection();
  }

  clearSelection(): void {
    this.selectedIds.clear();
    this.syncSelection();
  }

  private syncSelection(): void {
    this.selectedIds = new Set(this.selectedIds);
    this.selectedOffers = (this.offerList as Plan[]).filter(offer => this.selectedIds.has(offer.id));
  }

  private loadInsurances(): void {
    this.httpService.get<Insurance[]>(PATHS.insuranceList)
      .pipe(catchError(() => { this.snackbar.error('Error al cargar las aseguradoras.'); return EMPTY; }))
      .subscribe(res => {
        this.insuranceMap = new Map(res.map(i => [i.id, i]));
      });
  }

}