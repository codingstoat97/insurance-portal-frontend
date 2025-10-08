import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolbarComponent } from "../toolbar/toolbar.component";
import { FooterComponent } from "../footer/footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    ToolbarComponent, 
    FooterComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.sass']
})
export class LayoutComponent {

}
