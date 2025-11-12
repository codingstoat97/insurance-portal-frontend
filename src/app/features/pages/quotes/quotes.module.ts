import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotesRoutingModule } from './quotes-routing.module';
import { QuoteStepperComponent } from './pages/quote-stepper/quote-stepper.component';
import { QuoteViewComponent } from './pages/quote-view/quote-view.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { MatStepperModule } from '@angular/material/stepper';

import { ClientFormComponent } from "src/app/shared/forms/client-form/client-form.component";
import { VehicleFormComponent } from "src/app/shared/forms/vehicle-form/vehicle-form.component";
import { QuoteOfferComponent } from "./components/quote-offer/quote-offer.component";
import { OfferListComponent } from "./components/offer-list/offer-list.component";
import { ClientVehicleComponent } from "src/app/shared/forms/client-vehicle/client-vehicle.component";

@NgModule({
  declarations: [
    QuoteStepperComponent,
    QuoteViewComponent
  ],
  imports: [
    CommonModule,
    QuotesRoutingModule,
    SharedModule,
    MatStepperModule,
    ClientFormComponent,
    VehicleFormComponent,
    QuoteOfferComponent,
    OfferListComponent,
    ClientVehicleComponent
],
schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QuotesModule { }
