import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { catchError, EMPTY } from 'rxjs';

import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';
import { OfferColumnConfigService } from 'src/app/core/services/offer-column-config/offer-column-config.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';

import { QuoteOfferComponent } from "../quote-offer/quote-offer.component";
import { PlanComparisonComponent } from "../plan-comparison/plan-comparison.component";

import { Insurance, Plan } from 'src/app/shared/models';
import * as PATHS from 'src/app/shared/utils/request-paths.util'

const MAX_COMPARE = 5;

interface PlanTypeTab {
  value: string;
  label: string;
}

interface InsuranceChip {
  id: number;
  name: string;
}

@Component({
  selector: 'app-offer-list',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MatTabsModule,
    MatChipsModule,
    QuoteOfferComponent,
    PlanComparisonComponent
  ],
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.sass']
})
export class OfferListComponent implements OnInit, OnChanges {

  @Input() offerList: any[] = [];
  insuranceMap = new Map<number, Insurance>();
  selectedIds = new Set<number>();
  selectedOffers: Plan[] = [];
  readonly maxCompare = MAX_COMPARE;

  insuranceChips: InsuranceChip[] = [];
  selectedInsuranceIds = new Set<number>();

  planTypeTabs: PlanTypeTab[] = [];
  activeTabIndex = 0;

  columnVisible: Record<string, boolean> = {
    logo: true,
    aseguradora: true,
    descuento: true,
    primaAnual: true,
    primaACredito: true,
    franquicia: true
  };

  get selectedInsuranceIdsArray(): number[] {
    return [...this.selectedInsuranceIds];
  }

  get insuranceFilteredList(): any[] {
    if (this.selectedInsuranceIds.size === 0) return this.offerList;
    return this.offerList.filter(offer => this.selectedInsuranceIds.has(offer.insuranceId));
  }

  get filteredOfferList(): any[] {
    const list = this.insuranceFilteredList;
    if (this.planTypeTabs.length === 0) return list;
    const planType = this.planTypeTabs[this.activeTabIndex]?.value;
    return list.filter(offer => offer.planType === planType);
  }

  get tableOfferList(): any[] {
    return [...this.filteredOfferList].sort((a, b) => this.totalCost(a) - this.totalCost(b));
  }

  private totalCost(offer: any): number {
    return this.primaAlContado(offer) + this.franchiseMinimum(offer?.franchise);
  }

  private franchiseMinimum(value: unknown): number {
    const match = value != null ? String(value).match(/Bs\.?\s*([\d.,]+)/i) : null;
    return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
  }

  primaAlContado(offer: any): number {
    const premium = Number(offer?.minimumPremium) || 0;
    const rate = Number(offer?.rate) || 0;
    return premium + (premium * (rate / 100));
  }

  primaACredito(offer: any): number {
    const contado = this.primaAlContado(offer);
    const interest = Number(offer?.interest) || 0;
    return contado + (contado * (interest / 100));
  }

  constructor(
    private httpService: HttpService,
    private snackbar: SnackBarService,
    private offerColumnConfigService: OfferColumnConfigService,
    private router: Router) { }

  goToQuotePage(offerId: number): void {
    this.router.navigate(['/quotes', offerId]);
  }

  ngOnInit(): void {
    this.loadInsurances();
    this.offerColumnConfigService.columns$.subscribe(columns => {
      columns.forEach(c => this.columnVisible[c.columnKey] = c.enabled);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('offerList' in changes) {
      this.rebuildInsuranceChips();
      this.rebuildPlanTypeTabs();
    }
  }

  onInsuranceChipsChange(selectedIds: number[]): void {
    this.selectedInsuranceIds = new Set(selectedIds);
    this.rebuildPlanTypeTabs();
  }

  clearInsuranceFilter(): void {
    this.selectedInsuranceIds = new Set();
    this.rebuildPlanTypeTabs();
  }

  private rebuildInsuranceChips(): void {
    const seen = new Map<number, InsuranceChip>();
    for (const offer of this.offerList) {
      const id = offer?.insuranceId;
      if (id != null && !seen.has(id)) {
        seen.set(id, { id, name: this.insuranceMap.get(id)?.name || 'Sin nombre' });
      }
    }
    this.insuranceChips = Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name));

    const validIds = new Set(this.insuranceChips.map(c => c.id));
    const stillValid = [...this.selectedInsuranceIds].filter(id => validIds.has(id));
    if (stillValid.length !== this.selectedInsuranceIds.size) {
      this.selectedInsuranceIds = new Set(stillValid);
    }
  }

  private rebuildPlanTypeTabs(): void {
    const seen = new Set<string>();
    const tabs: PlanTypeTab[] = [];
    for (const offer of this.insuranceFilteredList) {
      const name = offer?.planType;
      if (name && !seen.has(name)) {
        seen.add(name);
        tabs.push({ value: name, label: name });
      }
    }
    this.planTypeTabs = tabs;
    if (this.activeTabIndex >= tabs.length) {
      this.activeTabIndex = 0;
    }
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
        this.rebuildInsuranceChips();
      });
  }

}
