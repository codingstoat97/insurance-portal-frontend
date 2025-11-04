import { Component, inject, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';

import { PlanFormComponent } from 'src/app/shared/forms/plan-form/plan-form.component';
import { Plan } from 'src/app/shared/models';

import * as PATHS from 'src/app/shared/utils/request-paths.util'


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
    { id: 'state', header: 'Plan Activado', field: 'state'}
  ];

  rows = [];

  actions: any[] = [
    { id: 'edit', icon: 'edit', tooltip: 'Editar Plan' }
  ];

  constructor(private httpService: HttpService, private snackbar: SnackBarService) { }

  ngOnInit(): void {
    this.fetchPlanList();
  }

  fetchPlanList(): void {
    this.httpService.get<any>(PATHS.planList).subscribe(res => {
      this.rows = res;
    })
  }

  openPlanDialog(plan?: any): void {
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
        this.savePlan(result);
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

  getPlanByID(planID: number): Plan {
    let response: any;
    this.httpService.get<Plan>(PATHS.planGetByID + '/' + planID).subscribe(res => {
      response = res; 
    })
    return response;
  }

  onAddNewElement(): void {
    this.openPlanDialog();
  }

  private savePlan(payload: Plan): void {
    this.httpService.post(PATHS.planAdd, payload).subscribe(res => {
      this.snackbar.success('Guardado con éxito');
      this.fetchPlanList();
    })
  }

}
