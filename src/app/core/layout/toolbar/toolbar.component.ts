import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../services/auth/auth.service';
import { ToolbarService } from '../../services/toolbar/toolbar.service';
import { ResponsiveService } from '../../services/responsive/responsive.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass']
})
export class ToolbarComponent implements OnDestroy {
  variant: 'transparent' | 'solid' = 'solid';
  showNav = false;

  private subscription = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthService,
    private responsiveService: ResponsiveService,
    toolbarService: ToolbarService
  ) {
    this.subscription.add(toolbarService.variant$.subscribe(v => (this.variant = v)));
    this.subscription.add(toolbarService.showNav$.subscribe(v => (this.showNav = v)));
  }

  get isMobile(): boolean {
    return this.responsiveService.isPhonePortrait;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  redirectToPortal(): void {
    const path = this.authService.getRedirectionPath();
    this.router.navigate([path]);
  }
}
