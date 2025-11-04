import { Component, inject, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { HttpService } from 'src/app/core/services/http/http.service';

import { PlanFormComponent } from 'src/app/shared/forms/plan-form/plan-form.component';


@Component({
  selector: 'app-broker-main',
  templateUrl: './broker-main.component.html',
  styleUrls: ['./broker-main.component.sass']
})
export class BrokerMainComponent implements OnInit {

  readonly dialog = inject(MatDialog);
  username: string = 'Erick Kinlock';
  profilePictureURL = '/assets/user-pp.jpg'

  columns = [
    { id: 'id', header: 'ID', field: 'id' },
    { id: 'vehicleId', header: 'Vehiculo', field: 'vehicleId' },
    { id: 'vehicleBrand', header: 'Marca', field: 'vehicleBrand' },
    { id: 'vehicleModel', header: 'Modelo', field: 'vehicleModel' },
    { id: 'regional', header: 'Regional', field: 'regional' },
    { id: 'insurance', header: 'Aseguradora', field: 'insurance' },
    { id: 'minimumPremium', header: 'Prima', field: 'minimumPremium' },
    { id: 'rate', header: 'Tasa', field: 'rate' },
    { id: 'discount', header: 'Descuento', field: 'discount' },
  ];

  rows = [];

  actions: any[] = [
    { id: 'edit', icon: 'edit', tooltip: 'Editar Plan' }
  ];

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.fetchPlanList();
  }

  fetchPlanList() {
    this.httpService.get<any>('plans').subscribe(res => {
      console.log(res);
      this.rows = res;
    })
  }

  openPlanDialog(plan?: any) {
    console.log(plan);

    const dialogRef = this.dialog.open(PlanFormComponent, {
      width: '520px',
    });

    dialogRef.componentInstance.title = 'Crear Plan';
    if (plan) {
      dialogRef.componentInstance.value = plan;
    } else {
      dialogRef.componentInstance.value = null;
    }
    dialogRef.componentInstance.submitLabel = 'Guardar';
    dialogRef.componentInstance.showCancel = true;

    const sub1 = dialogRef.componentInstance.submitted?.subscribe(payload => {
      console.log('broker main', payload);
      dialogRef.close(payload);
    });
    const sub2 = dialogRef.componentInstance.cancelled?.subscribe(() => {
      dialogRef.close();
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
      sub1?.unsubscribe?.(); sub2?.unsubscribe?.();
    });
  }

  onRowAction(e: { actionId: string; row: any }): void {
    console.log(e);

    switch (e.actionId) {
      case 'edit': this.openPlanDialog(e.row); break;
    }
  }

  onAddNewElement(): void {
    this.openPlanDialog();
  }

}
