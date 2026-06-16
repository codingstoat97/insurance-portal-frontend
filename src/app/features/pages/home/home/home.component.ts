import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResponsiveService } from 'src/app/core/services/responsive/responsive.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent {

  constructor(private router: Router, private responsiveService: ResponsiveService) { }

  get isMobile(): boolean {
    return this.responsiveService.isPhonePortrait;
  }

  goToStepper(): void {
    this.router.navigate(['/quotes']);
  }
}
