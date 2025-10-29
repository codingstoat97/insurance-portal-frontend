import { Component, inject, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { HttpService } from 'src/app/core/services/http/http.service';

import { InsuranceFormComponent } from 'src/app/shared/forms/insurance-form/insurance-form.component';
import { RegionFormComponent } from 'src/app/shared/forms/region-form/region-form.component';
import { VehicleFormComponent } from 'src/app/shared/forms/vehicle-form/vehicle-form.component';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.sass']
})
export class AdminMainComponent implements OnInit {

  readonly dialog = inject(MatDialog);

  regionColumns = [
    { id: 'id', header: 'ID', field: 'id' },
    { id: 'name', header: 'Regional', field: 'name' },
    { id: 'country', header: 'Pais', field: 'country' }
  ];

  regionRows = [];

  vehicleColumns = [
    { id: 'id', header: 'ID', field: 'id' },
    { id: 'brand', header: 'Marca', field: 'brand' },
    { id: 'classifications', header: 'Clasificación', field: 'classifications' },
    { id: 'model', header: 'Modelo', field: 'model' },
    { id: 'highEnd', header: 'Es Alta Gama', field: 'highEnd' },
  ];

  vehicleRows = [];

  insuranceColumns = [
    { id: 'id', header: 'ID', field: 'id' },
    { id: 'name', header: 'Nombre', field: 'name' },
    { id: 'type', header: 'Tipo', field: 'type' },
    { id: 'email', header: 'Correo Electrónico', field: 'email' }
  ];

  insuranceRows = [];

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.fetchRegionList();
    this.fetchVehicleList();
    this.fetchInsuranceList();
  }

  fetchInsuranceList() {
    this.httpService.get<any>('insurances').subscribe(res => {
      console.log(res);

      this.insuranceRows = res;
    })
  }

  fetchRegionList() {
    this.httpService.get<any>('regionals').subscribe(res => {
      console.log(res);

      this.regionRows = res;
    })
  }

  fetchVehicleList() {
    this.httpService.get<any>('vehicleCatalog').subscribe(res => {
      console.log(res);

      this.vehicleRows = res;
    })
  }

  openRegionDialog() {
    const dialogRef = this.dialog.open(RegionFormComponent, {
      width: '520px',
    });

    dialogRef.componentInstance.title = 'Añadir región';
    dialogRef.componentInstance.value = null;
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

  openInsuranceDialog() {
    const dialogRef = this.dialog.open(InsuranceFormComponent, {
      width: '520px',
    });

    dialogRef.componentInstance.title = 'Registrar Aseguradora';
    dialogRef.componentInstance.value = null;
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

  openVehicleDialog() {
    const dialogRef = this.dialog.open(VehicleFormComponent, {
      width: '520px',
    });

    dialogRef.componentInstance.title = 'Crear Plan';
    dialogRef.componentInstance.value = null;
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

}
