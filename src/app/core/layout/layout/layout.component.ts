import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

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
  hideFooter = false;

  private subscription = new Subscription();

  constructor(private router: Router, toolbarService: ToolbarService) {
    this.subscription.add(
      toolbarService.isVisible$.subscribe(v => (this.toolbarVisible = v))
    );
    this.subscription.add(
      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe(() => {
          const url = this.router.url.split('?')[0];
          this.hideFooter = url.startsWith('/quotes');
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
