import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';

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

  constructor(private router: Router){}

  goToQuotePage() {
    this.router.navigate(['/quotes', this.offer.id]);
  }

  get primaAlContado(): number {
    const premium = Number(this.offer?.minimumPremium) || 0;
    const rate = Number(this.offer?.rate) || 0;
    return premium + (premium * (rate / 100));
  }
}
