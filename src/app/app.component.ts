import { Component } from '@angular/core';
import { ThemeService } from './core/services/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'insurance-web-portal';

  // Eagerly inject so the .dark class is applied before any route renders
  constructor(_theme: ThemeService) {}
}
