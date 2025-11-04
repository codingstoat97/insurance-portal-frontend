import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  @Input() username: string = '';
  @Input() profilePictureURL: string = 'https://cdn-icons-png.freepik.com/512/12225/12225935.png';
  @Input() showOccupation: boolean = false;
  constructor(){}

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }

}
