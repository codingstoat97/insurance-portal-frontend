import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { AdminPlansComponent } from './admin-plans/admin-plans.component';

const routes: Routes = [
  { path: '', component: AdminMainComponent, title: 'Bubo | Administrador' },
  { path: 'plans', component: AdminPlansComponent, title: 'Bubo | Administrar Planes' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
