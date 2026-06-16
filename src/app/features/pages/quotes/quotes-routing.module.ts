import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuoteStepperComponent } from './pages/quote-stepper/quote-stepper.component';
import { QuotePageComponent } from './components/quote-page/quote-page.component';

const routes: Routes = [
  { path: '', component: QuoteStepperComponent },
  { path: ':id', component: QuotePageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotesRoutingModule { }
