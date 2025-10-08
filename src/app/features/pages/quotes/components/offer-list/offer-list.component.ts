import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuoteOfferComponent } from "../quote-offer/quote-offer.component";

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
export class OfferListComponent {

}
