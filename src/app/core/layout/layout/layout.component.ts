import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { ToolbarComponent } from '../toolbar/toolbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ToolbarService } from '../../services/toolbar/toolbar.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToolbarComponent, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.sass']
})
export class LayoutComponent implements OnDestroy {
  toolbarVisible = true;
  footerVisible = true;

  private subscription = new Subscription();

  constructor(toolbarService: ToolbarService) {
    this.subscription.add(toolbarService.isVisible$.subscribe(v => (this.toolbarVisible = v)));
    this.subscription.add(toolbarService.isFooterVisible$.subscribe(v => (this.footerVisible = v)));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
