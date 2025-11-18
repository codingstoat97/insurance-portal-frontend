import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'

import { filter } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass']
})
export class ToolbarComponent {
  public variant: any;
  public showButton: boolean = true;
  public showToolbar: boolean = true;
  constructor(private router: Router, private route: ActivatedRoute) {
    this.setToolbarForHome();
  }

  private setToolbarForHome(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        let r = this.route.root;
        while (r.firstChild) r = r.firstChild;
        this.variant = (r.snapshot.data['toolbar'] as any) || 'solid';
        const url = this.router.url.split('?')[0];
        this.showButton = url === '/home';
        this.showToolbar = url === '/login';
      });
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  goToBroker(): void {
    this.router.navigate(['/broker']);
  }

}
