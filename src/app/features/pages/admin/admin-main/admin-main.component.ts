import { Component, inject, OnInit } from '@angular/core';
import { ScrollStrategy } from '@angular/cdk/overlay';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';

import { InsuranceFormComponent } from 'src/app/shared/forms/insurance-form/insurance-form.component';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { VehicleFormComponent } from 'src/app/shared/forms/vehicle-form/vehicle-form.component';
import { RegionFormComponent } from 'src/app/shared/forms/region-form/region-form.component';

import { Insurance, Region, Vehicle } from 'src/app/shared/models';
import * as PATH from 'src/app/shared/utils/request-paths.util'


@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.sass']
})
export class AdminMainComponent implements OnInit {

  readonly dialog = inject(MatDialog);
  public deleteDialogRef: MatDialogRef<DeleteModalComponent> | undefined;
  public scrollStrategy: ScrollStrategy | undefined;
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

  actions: any[] = [
    { id: 'edit', icon: 'edit', tooltip: 'Editar' },
    { id: 'delete', icon: 'delete', tooltip: 'Eliminar' },
  ];

  constructor(
    private httpService: HttpService,
    private snackbar: SnackBarService) { }

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

  openDeleteDialog(type: string, itemName: any, item: any): void {
    this.deleteDialogRef = this.dialog.open(DeleteModalComponent, {
      data: { type: type, element: itemName },
      scrollStrategy: this.scrollStrategy
    });

    this.deleteDialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        switch (type) {
          case 'Insurance': this, this.deleteEntity(type, item.id); break;
          case 'Region': this.deleteEntity(type, item.id); break;
        }
      }
    });
  }

  openEntityDialog(type: string, entity?: Vehicle | Insurance | Region) {
    const dialogRef = this.getDialogRef(type);

    if (entity) {
      this.handleEditEntity(entity, dialogRef);
    } else {
      this.handleAddNewEntity(dialogRef);
    }

    const sub1 = dialogRef.componentInstance.submitted?.subscribe((payload: any) => {
      dialogRef.close(payload);
    });
    const sub2 = dialogRef.componentInstance.cancelled?.subscribe(() => {
      dialogRef.close();
    });

    dialogRef.afterClosed().subscribe((result: Vehicle | Insurance | Region) => {
      if (result) {
        this.saveEntity(type, result);
      }
      sub1?.unsubscribe?.(); sub2?.unsubscribe?.();
    });
  }

  private getDialogRef(type: string): any {
    let dialogRef;
    switch (type) {
      case 'Vehicle':
        dialogRef = this.dialog.open(VehicleFormComponent, {
          width: '520px',
        }); break;
      case 'Insurance':
        dialogRef = this.dialog.open(InsuranceFormComponent, {
          width: '520px',
        }); break;
      case 'Region':
        dialogRef = this.dialog.open(RegionFormComponent, {
          width: '520px',
        }); break;
    }
    return dialogRef;
  }

  private handleEditEntity(entity: Vehicle | Insurance | Region, dialogRef: any) {
    dialogRef.componentInstance.title = 'Editar';
    dialogRef.componentInstance.value = entity;
    dialogRef.componentInstance.showDescription = false;
    dialogRef.componentInstance.submitLabel = 'Guardar Cambios';
    dialogRef.componentInstance.showCancel = true;
  }

  private handleAddNewEntity(dialogRef: any) {
    dialogRef.componentInstance.title = 'Crear Nuevo';
    dialogRef.componentInstance.value = null;
    dialogRef.componentInstance.showDescription = false;
    dialogRef.componentInstance.submitLabel = 'Guardar';
    dialogRef.componentInstance.showCancel = true;
  }

  onAddNewElement(type: string): void {
    this.openEntityDialog(type)
  }

  onRowAction(e: { actionId: string; row: any }, type: string): void {
    switch (e.actionId) {
      case 'edit': this.openEntityDialog(type, e.row); break;
      case 'delete': this.openDeleteDialog(type, e.row.name, e.row); break;
    }
  }

  private saveEntity(type: string, payload: Insurance | Vehicle | Region): void {
    const path = this.getEntityPath(type) + '/add';
    this.httpService.post(path, payload).subscribe(res => {
      this.snackbar.success('Guardado con éxito');
      this.refreshData(type);
    })
  }

  private deleteEntity(entityType: string, entityID: string): void {
    const path = this.getEntityPath(entityType) + '/delete/' + entityID;
    this.httpService.delete(path).subscribe(res => {
      this.snackbar.success('Eliminado correctamente.');
      this.refreshData(entityType);
    });
  }

  private getEntityPath(entityType: string): string {
    switch (entityType) {
      case 'Vehicle': return PATH.vehiclePath;
      case 'Insurance': return PATH.insurancePath;
      case 'Region': return PATH.regionPath;
      default: return '';
    }
  }

  private refreshData(tableType: string): void {
    switch (tableType) {
      case 'Insurance': this.fetchInsuranceList(); break;
      case 'Vehicle': this.fetchVehicleList(); break;
      case 'Region': this.fetchRegionList(); break;
    }
  }

}
