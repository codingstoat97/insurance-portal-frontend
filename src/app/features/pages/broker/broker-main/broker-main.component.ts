import { ScrollStrategy } from '@angular/cdk/overlay';
import { Component, inject, OnInit } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';

import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { BenefitFormComponent } from 'src/app/shared/forms/benefit-form/benefit-form.component';
import { PlanFormComponent } from 'src/app/shared/forms/plan-form/plan-form.component';
import { Benefit, Insurance, Plan, Region, Vehicle } from 'src/app/shared/models';

import * as PATHS from 'src/app/shared/utils/request-paths.util'
import { Column } from 'src/app/shared/utils/data-table-types.util';

@Component({
  selector: 'app-broker-main',
  templateUrl: './broker-main.component.html',
  styleUrls: ['./broker-main.component.sass']
})
export class BrokerMainComponent implements OnInit {

  readonly dialog = inject(MatDialog);
  public deleteDialogRef: MatDialogRef<DeleteModalComponent> | undefined;
  public scrollStrategy: ScrollStrategy | undefined;

  username: string = 'Erick Kinlock';
  profilePictureURL = '/assets/user-pp.jpg'

  vehicleMap: Record<number, Vehicle> = {};
  regionMap: Record<number, Region> = {};
  insuranceMap: Record<number, Insurance> = {};

  planColumns: Column<Plan>[] = [
    { id: 'id', header: 'ID', field: 'id' },
    { id: 'vehicleId', header: 'Vehículo', field: 'vehicleId', valueGetter: (row) => this.vehicleMap[row.vehicleId!]?.brand ?? '—' },
    { id: 'regionalId', header: 'Regional', field: 'regionalId', valueGetter: (row) => this.regionMap[row.regionalId!]?.name ?? '—' },
    { id: 'insuranceId', header: 'Aseguradora', field: 'insuranceId', valueGetter: (row) => this.insuranceMap[row.insuranceId!]?.name ?? '—' },
    { id: 'minimumPremium', header: 'Prima', field: 'minimumPremium' },
    { id: 'rate', header: 'Tasa', field: 'rate' },
    { id: 'ageLimit', header: 'Límite de Años', field: 'ageLimit' },
    { id: 'discount', header: 'Descuento', field: 'discount' },
    { id: 'price', header: 'Precio', field: 'price' },
    { id: 'level', header: 'Nivel', field: 'level' },
    { id: 'franchise', header: 'Franquicia', field: 'franchise' },
    { id: 'state', header: 'Plan Activado', field: 'state' }
  ];

  planRows = [];

  benefitColumns = [
    { id: 'id', header: 'ID', field: 'id' },
    { id: 'name', header: 'Nombre del Beneficio', field: 'name' },
    { id: 'description', header: 'Descripción', field: 'description' },
    { id: 'coverage', header: 'Tipo de Cobertura', field: 'coverage' },
  ];

  benefitRows = [];

  actions: any[] = [
    { id: 'edit', icon: 'edit', tooltip: 'Editar' },
    { id: 'delete', icon: 'delete', tooltip: 'Eliminar' },
  ];

  constructor(private httpService: HttpService, private snackbar: SnackBarService) { }

  ngOnInit(): void {
    this.fetchPlanList();
    this.fetchBenefitList();

    this.fetchVehicleList();
    this.fetchRegionalList();
    this.fetchInsuranceList();
  }

  fetchPlanList(): void {
    this.httpService.get<any>(PATHS.planList).subscribe(res => {
      this.planRows = res;
    })
  }

  fetchBenefitList(): void {
    this.httpService.get<any>(PATHS.benefitList).subscribe(res => {
      this.benefitRows = res;
    })
  }

  private fetchVehicleList(): void {
    this.httpService.get<Vehicle[]>(PATHS.vehicleList).subscribe(res => {
      this.vehicleMap = Object.fromEntries(res.map(v => [v.id, v]));
      if (this.planRows?.length) this.planRows = [...this.planRows];
    });
  }

  private fetchRegionalList(): void {
    this.httpService.get<Region[]>(PATHS.regionList).subscribe(res => {
      this.regionMap = Object.fromEntries(res.map(r => [r.id, r]));
      if (this.planRows?.length) this.planRows = [...this.planRows];
    });
  }

  private fetchInsuranceList(): void {
    this.httpService.get<Insurance[]>(PATHS.insuranceList).subscribe(res => {
      this.insuranceMap = Object.fromEntries(res.map(i => [i.id, i]));
      if (this.planRows?.length) this.planRows = [...this.planRows];
    });
  }

  openEntityDialog(type: string, entity?: Plan | Benefit) {
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

    dialogRef.afterClosed().subscribe((result: Plan | Benefit) => {
      if (result) {
        this.saveEntity(type, result);
      }
      sub1?.unsubscribe?.(); sub2?.unsubscribe?.();
    });
  }

  private getDialogRef(type: string): any {
    let dialogRef;
    switch (type) {
      case 'Plan':
        dialogRef = this.dialog.open(PlanFormComponent, {
          height: '600px',
          width: '520px',
        }); break;
      case 'Benefit':
        dialogRef = this.dialog.open(BenefitFormComponent, {
          height: '600px',
          width: '520px',
        }); break;
    }
    return dialogRef;
  }

  openDeleteDialog(type: string, itemName: any, item: any): void {
    this.deleteDialogRef = this.dialog.open(DeleteModalComponent, {
      data: { type: type, element: itemName },
      scrollStrategy: this.scrollStrategy
    });

    this.deleteDialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        switch (type) {
          case 'Plan': this, this.deleteEntity(type, item.id); break;
          case 'Benefit': this.deleteEntity(type, item.id); break;
        }
      } else {
        console.error(result.error)
      }
    });
  }

  private deleteEntity(entityType: string, entityID: string): void {
    const path = this.getEntityPath(entityType) + '/delete/' + entityID;
    console.log(path);

    this.httpService.delete(path).subscribe(res => {
      this.snackbar.success('Eliminado correctamente.');
      this.refreshData(entityType);
    });
  }

  private handleEditEntity(entity: Plan | Benefit, dialogRef: any) {
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

  onRowAction(type: string, e: { actionId: string; row: any }): void {
    switch (e.actionId) {
      case 'edit': this.openEntityDialog(type, e.row); break;
      case 'delete': this.openDeleteDialog(type, e.row.name, e.row); break;
    }
  }

  onAddNewElement(type: string): void {
    this.openEntityDialog(type);
  }

  private saveEntity(type: string, payload: Plan | Benefit): void {
    const path = this.getEntityPath(type) + '/add';
    this.httpService.post(path, payload).subscribe(res => {
      this.snackbar.success('Guardado con éxito');
      this.refreshData(type);
    })
  }

  private getEntityPath(entityType: string): string {
    switch (entityType) {
      case 'Plan': return PATHS.planPath;
      case 'Benefit': return PATHS.benefitPath;
      default: return '';
    }
  }

  private refreshData(tableType: string): void {
    switch (tableType) {
      case 'Plan': this.fetchPlanList(); break;
      case 'Benefit': this.fetchBenefitList(); break;
    }
  }

}
