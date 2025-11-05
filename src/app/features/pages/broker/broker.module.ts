import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrokerRoutingModule } from './broker-routing.module';
import { BrokerMainComponent } from './broker-main/broker-main.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';

import { SharedModule } from 'src/app/shared/shared.module';

import { DataTableComponent } from "src/app/shared/components/data-table/data-table.component";
import { UserProfileComponent } from 'src/app/shared/components/user-profile/user-profile.component';

@NgModule({
  declarations: [
    BrokerMainComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatSidenavModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    BrokerRoutingModule,
    DataTableComponent,
    UserProfileComponent,
  ]
})
export class BrokerModule { }
