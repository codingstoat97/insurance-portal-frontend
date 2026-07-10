import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { AdminPlansComponent } from './admin-plans/admin-plans.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { UserProfileComponent } from 'src/app/shared/components/user-profile/user-profile.component';
import { CdkTableModule } from "@angular/cdk/table";


@NgModule({
  declarations: [
    AdminMainComponent,
    AdminPlansComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    DataTableComponent,
    UserProfileComponent,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    CdkTableModule
  ]
})
export class AdminModule { }
