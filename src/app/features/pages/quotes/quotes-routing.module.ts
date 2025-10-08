import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuoteStepperComponent } from './pages/quote-stepper/quote-stepper.component';

const routes: Routes = [
  { path: '', component: QuoteStepperComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotesRoutingModule { }
