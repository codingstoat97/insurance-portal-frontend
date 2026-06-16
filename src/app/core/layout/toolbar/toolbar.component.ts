import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../services/auth/auth.service';
import { ToolbarService } from '../../services/toolbar/toolbar.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass']
})
export class ToolbarComponent implements OnDestroy {
  variant: 'transparent' | 'solid' = 'solid';
  showNav = false;
  isVisible = true;

  private subscription = new Subscription();

  constructor(private router: Router, private authService: AuthService, toolbarService: ToolbarService) {
    this.subscription.add(toolbarService.isVisible$.subscribe(v => (this.isVisible = v)));
    this.subscription.add(toolbarService.variant$.subscribe(v => (this.variant = v)));
    this.subscription.add(toolbarService.showNav$.subscribe(v => (this.showNav = v)));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  redirectToPortal(): void {
    const path = this.authService.getRedirectionPath();
    this.router.navigate([path]);
  }
}
