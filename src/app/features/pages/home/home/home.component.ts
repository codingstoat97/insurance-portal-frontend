import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResponsiveService } from 'src/app/core/services/responsive/responsive.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent {

  readonly whatsappUrl = 'https://wa.me/59170728783?text=' +
    encodeURIComponent('Hola Bubo, quisiera más información sobre sus seguros.');

  constructor(private router: Router, private responsiveService: ResponsiveService) { }

  get isMobile(): boolean {
    return this.responsiveService.isPhonePortrait;
  }

  get isTablet(): boolean {
    return this.responsiveService.isTablet;
  }

  goToStepper(): void {
    this.router.navigate(['/quotes']);
  }
}
