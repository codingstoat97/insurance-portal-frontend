import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpService } from 'src/app/core/services/http/http.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { QuoteOfferComponent } from "../quote-offer/quote-offer.component";

import { Insurance } from 'src/app/shared/models';
import * as PATHS from 'src/app/shared/utils/request-paths.util'

@Component({
  selector: 'app-offer-list',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    QuoteOfferComponent
  ],
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.sass']
})
export class OfferListComponent implements OnInit, OnDestroy {

  @Input() offerList: any[] = [];
  insuranceMap = new Map<number, string>();
  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.loadInsurances();
  }

  ngOnDestroy(): void { }

  trackById(index: number, item: any) {
    return item.id;
  }

  private loadInsurances(): void {
    this.httpService.get<any>(PATHS.insuranceList).subscribe(res => {
      this.insuranceMap = new Map(
        res.map((i: any) => [i.id, i.name])
      );
    });
  }

}
