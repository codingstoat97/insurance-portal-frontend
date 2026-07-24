import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotesRoutingModule } from './quotes-routing.module';
import { QuoteStepperComponent } from './pages/quote-stepper/quote-stepper.component';
import { QuoteViewComponent } from './pages/quote-view/quote-view.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ClientVehicleComponent } from "src/app/shared/forms/client-vehicle/client-vehicle.component";
import { UserFormComponent } from "src/app/shared/forms/user-form/user-form.component";
import { VehicleFormComponent } from "src/app/shared/forms/vehicle-form/vehicle-form.component";
import { QuoteOfferComponent } from "./components/quote-offer/quote-offer.component";
import { OfferListComponent } from "./components/offer-list/offer-list.component";
import { QuotePageComponent } from './components/quote-page/quote-page.component';

import { MatDialogModule } from '@angular/material/dialog';
import { PlanPurchaseService } from 'src/app/core/services/plan-purchase/plan-purchase.service';

@NgModule({
  declarations: [
    QuoteStepperComponent,
    QuoteViewComponent,
    QuotePageComponent
  ],
  imports: [
    CommonModule,
    QuotesRoutingModule,
    SharedModule,
    MatProgressBarModule,
    UserFormComponent,
    VehicleFormComponent,
    QuoteOfferComponent,
    OfferListComponent,
    ClientVehicleComponent,
    MatDialogModule
],
providers: [PlanPurchaseService],
schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QuotesModule { }
