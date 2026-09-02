import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';
import { QuoteStepperService } from 'src/app/core/services/quote-stepper/quote-stepper.service';
import * as premium from 'src/app/shared/utils/premium.util';

import { Plan } from 'src/app/shared/models';

@Component({
  selector: 'app-quote-offer',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule
  ],
  templateUrl: './quote-offer.component.html',
  styleUrls: ['./quote-offer.component.sass']
})
export class QuoteOfferComponent {
  @Input() offer!: Plan;
  @Input() insuranceName!: string;
  @Input() logo?: string | null;
  @Input() selected = false;
  @Input() compareDisabled = false;

  @Output() compareToggled = new EventEmitter<void>();

  constructor(
    private router: Router,
    private stepperService: QuoteStepperService
  ){}

  goToQuotePage() {
    this.router.navigate(['/quotes', this.offer.id]);
  }

  get primaAlContado(): number {
    const vehicleValue = Number(this.stepperService.clientVehicleData?.vehicleValue) || 0;
    return premium.primaAlContado(this.offer, vehicleValue);
  }
}
