import { Component, inject, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';

import { InsuranceFormComponent } from 'src/app/shared/forms/insurance-form/insurance-form.component';
import { RegionFormComponent } from 'src/app/shared/forms/region-form/region-form.component';
import { VehicleFormComponent } from 'src/app/shared/forms/vehicle-form/vehicle-form.component';
import { Insurance, Region, Vehicle } from 'src/app/shared/models';

import * as PATH from 'src/app/shared/utils/request-paths.util'

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.sass']
})
export class AdminMainComponent implements OnInit {

  readonly dialog = inject(MatDialog);
  username: string = 'Admin';

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

  constructor(private httpService: HttpService, private snackbar: SnackBarService) { }

  ngOnInit(): void {
    this.fetchRegionList();
    this.fetchVehicleList();
    this.fetchInsuranceList();
  }

  fetchInsuranceList() {
    this.httpService.get<any>(PATH.insuranceList).subscribe(res => {
      this.insuranceRows = res;
    })
  }

  fetchRegionList() {
    this.httpService.get<any>(PATH.regionList).subscribe(res => {
      this.regionRows = res;
    })
  }

  fetchVehicleList() {
    this.httpService.get<any>(PATH.vehicleList).subscribe(res => {
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
      dialogRef.close(payload);
    });
    const sub2 = dialogRef.componentInstance.cancelled?.subscribe(() => {
      dialogRef.close();
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveRegion(result);
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
      dialogRef.close(payload);
    });
    const sub2 = dialogRef.componentInstance.cancelled?.subscribe(() => {
      dialogRef.close();
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveInsurance(result);
      }
      sub1?.unsubscribe?.(); sub2?.unsubscribe?.();
    });
  }

  openVehicleDialog() {
    const dialogRef = this.dialog.open(VehicleFormComponent, {
      width: '520px',
    });

    dialogRef.componentInstance.title = 'Crear Vehículo';
    dialogRef.componentInstance.value = null;
    dialogRef.componentInstance.showDescription = false;
    dialogRef.componentInstance.submitLabel = 'Guardar';
    dialogRef.componentInstance.showCancel = true;

    const sub1 = dialogRef.componentInstance.submitted?.subscribe(payload => {
      dialogRef.close(payload);
    });
    const sub2 = dialogRef.componentInstance.cancelled?.subscribe(() => {
      dialogRef.close();
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveVehicle(result);
      }
      sub1?.unsubscribe?.(); sub2?.unsubscribe?.();
    });
  }

  onAddNewElement(type: string): void {
    switch (type) {
      case 'region': this.openRegionDialog(); break;
      case 'vehicle': this.openVehicleDialog(); break;
      case 'insurance': this.openInsuranceDialog(); break;
    }
  }

  private saveRegion(payload: Region): void {
    this.httpService.post(PATH.regionAdd, payload).subscribe(res => {
      this.snackbar.success('Guardado con éxito');
      this.fetchRegionList();
    })
  }

  private saveVehicle(payload: Vehicle): void {
    this.httpService.post(PATH.vehicleAdd, payload).subscribe(res => {
      this.snackbar.success('Guardado con éxito');
      this.fetchVehicleList();
    })
  }

  private saveInsurance(payload: Insurance): void {
    this.httpService.post(PATH.insuranceAdd, payload).subscribe(res => {
      this.snackbar.success('Guardado con éxito');
      this.fetchInsuranceList();
    })
  }

}
