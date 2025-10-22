import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrokerMainComponent } from './broker-main/broker-main.component';

const routes: Routes = [
  { path: '', component: BrokerMainComponent, title: 'Broker | Kinlock Insurtech' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrokerRoutingModule { }
