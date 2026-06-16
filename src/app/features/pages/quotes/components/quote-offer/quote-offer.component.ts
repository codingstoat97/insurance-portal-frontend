import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';

import { Plan } from 'src/app/shared/models';

import { LevelLabelPipe } from 'src/app/shared/pipes/level-pipe/level-label.pipe';

@Component({
  selector: 'app-quote-offer',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    LevelLabelPipe
  ],
  templateUrl: './quote-offer.component.html',
  styleUrls: ['./quote-offer.component.sass']
})
export class QuoteOfferComponent {
  @Input() offer!: Plan;
  @Input() insuranceName!: string;

  constructor(private router: Router){}

  goToQuotePage() {
    this.router.navigate(['/quotes', this.offer.id]);
  }
}
