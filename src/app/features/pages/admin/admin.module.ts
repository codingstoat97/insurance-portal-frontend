import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminMainComponent } from './admin-main/admin-main.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';

import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { UserProfileComponent } from 'src/app/shared/components/user-profile/user-profile.component';

@NgModule({
  declarations: [
    AdminMainComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    DataTableComponent,
    UserProfileComponent,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    MatSidenavModule
  ]
})
export class AdminModule { }
