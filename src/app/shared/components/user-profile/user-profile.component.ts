import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared.module';
import { Router } from '@angular/router';

import { MatTooltipModule } from "@angular/material/tooltip";
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, SharedModule, MatTooltipModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  @Input() username: string = '';
  @Input() profilePictureURL: string = 'https://cdn-icons-png.freepik.com/512/12225/12225935.png';
  @Input() showOccupation: boolean = false;
  constructor(private router: Router, private authService: AuthService){}

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.authService.logout();
  }

}
