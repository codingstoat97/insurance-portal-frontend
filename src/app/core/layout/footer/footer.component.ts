import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { MatToolbarModule } from '@angular/material/toolbar';

import { ToolbarService } from '../../services/toolbar/toolbar.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatToolbarModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent implements OnDestroy {
  variant: 'transparent' | 'solid' = 'solid';

  private subscription = new Subscription();

  constructor(toolbarService: ToolbarService) {
    this.subscription.add(toolbarService.variant$.subscribe(v => (this.variant = v)));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}