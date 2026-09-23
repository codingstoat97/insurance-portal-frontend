import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResponsiveService } from 'src/app/core/services/responsive/responsive.service';
import { WHATSAPP_ICON_PATH, WHATSAPP_URL } from 'src/app/shared/utils/contact.util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent {

  readonly whatsappUrl = WHATSAPP_URL;
  readonly whatsappIconPath = WHATSAPP_ICON_PATH;

  readonly currentYear = new Date().getFullYear();

  readonly steps = [
    {
      icon: 'assets/lapicero.svg',
      alt: 'Registro',
      title: 'Registra',
      text: 'Ingresa los datos de tu vehículo y ayúdanos a conocer sus características. Así podremos ofrecerte las opciones de seguro que realmente se adaptan a ti.'
    },
    {
      icon: 'assets/auto.svg',
      alt: 'Vehículo',
      title: 'Compara',
      text: 'Explora y compara las mejores opciones de seguros disponibles, filtradas automáticamente según tu vehículo y tus necesidades.'
    },
    {
      icon: 'assets/escudo.svg',
      alt: 'Protección',
      title: 'Elige',
      text: 'Selecciona un plan, completa tu registro en línea y recibe tu certificado de cobertura directamente en tu correo una vez aprobado.'
    }
  ];

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
