import { Component, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../services/auth/auth.service';
import { ToolbarService } from '../../services/toolbar/toolbar.service';
import { ResponsiveService } from '../../services/responsive/responsive.service';
import { ThemeService } from '../../services/theme/theme.service';

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
  isScrolled = false;

  private subscription = new Subscription();

  // The page scrolls inside the layout's <main>, not the window, and scroll
  // events don't bubble — so listen in the capture phase on the document.
  private readonly scrollListener = () => this.updateScrolled();

  constructor(
    private router: Router,
    private authService: AuthService,
    private responsiveService: ResponsiveService,
    private host: ElementRef<HTMLElement>,
    private zone: NgZone,
    toolbarService: ToolbarService,
    public themeService: ThemeService
  ) {
    this.subscription.add(toolbarService.variant$.subscribe(v => (this.variant = v)));
    this.subscription.add(toolbarService.showNav$.subscribe(v => (this.showNav = v)));
    this.subscription.add(router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => setTimeout(() => this.updateScrolled())));

    this.zone.runOutsideAngular(() =>
      document.addEventListener('scroll', this.scrollListener, { capture: true, passive: true }));
  }

  get isMobile(): boolean {
    return this.responsiveService.isPhonePortrait;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    document.removeEventListener('scroll', this.scrollListener, { capture: true });
  }

  // Solid once the page's hero (marked with data-toolbar-hero) has scrolled out
  // from under the toolbar; pages without a hero fall back to a small offset.
  private updateScrolled(): void {
    const toolbarBottom = this.host.nativeElement.getBoundingClientRect().bottom;
    const hero = document.querySelector('[data-toolbar-hero]');
    const scrolled = hero
      ? hero.getBoundingClientRect().bottom <= toolbarBottom
      : (document.querySelector('main.content')?.scrollTop ?? window.scrollY) > 80;

    if (scrolled !== this.isScrolled) {
      this.zone.run(() => (this.isScrolled = scrolled));
    }
  }

  redirectToPortal(): void {
    const path = this.authService.getRedirectionPath();
    this.router.navigate([path]);
  }
}
