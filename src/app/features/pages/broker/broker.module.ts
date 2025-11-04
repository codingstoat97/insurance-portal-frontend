import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrokerRoutingModule } from './broker-routing.module';
import { BrokerMainComponent } from './broker-main/broker-main.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';

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
    BrokerRoutingModule,
    DataTableComponent,
    UserProfileComponent
  ]
})
export class BrokerModule { }
