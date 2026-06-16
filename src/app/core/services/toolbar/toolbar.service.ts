import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ToolbarService {
  private _isVisible = new BehaviorSubject<boolean>(true);
  private _isFooterVisible = new BehaviorSubject<boolean>(true);
  private _variant = new BehaviorSubject<'transparent' | 'solid'>('solid');
  private _showNav = new BehaviorSubject<boolean>(false);

  readonly isVisible$ = this._isVisible.asObservable();
  readonly isFooterVisible$ = this._isFooterVisible.asObservable();
  readonly variant$ = this._variant.asObservable();
  readonly showNav$ = this._showNav.asObservable();

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.update());
  }

  private update(): void {
    const url = this.router.url.split('?')[0];
    this._isVisible.next(url !== '/login' && !url.startsWith('/quotes'));
    this._showNav.next(url === '/home');

    let r = this.route.root;
    while (r.firstChild) r = r.firstChild;
    this._variant.next((r.snapshot.data['toolbar'] as 'transparent' | 'solid') || 'solid');
  }
}
