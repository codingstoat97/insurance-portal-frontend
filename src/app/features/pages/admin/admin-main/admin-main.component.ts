import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollStrategy } from '@angular/cdk/overlay';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ResponsiveService } from 'src/app/core/services/responsive/responsive.service';
import { SalesConfigService } from 'src/app/core/services/sales-config/sales-config.service';
import { OfferColumnConfigService } from 'src/app/core/services/offer-column-config/offer-column-config.service';

import { InsuranceFormComponent } from 'src/app/shared/forms/insurance-form/insurance-form.component';
import { VehicleFormComponent } from 'src/app/shared/forms/vehicle-form/vehicle-form.component';
import { RegionFormComponent } from 'src/app/shared/forms/region-form/region-form.component';
import { SimpleNameFormComponent } from 'src/app/shared/forms/simple-name-form/simple-name-form.component';
import { ClientFormComponent } from 'src/app/shared/forms/client-form/client-form.component';

import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { InfoModalComponent } from 'src/app/shared/components/info-modal/info-modal.component';

import { catchError, EMPTY } from 'rxjs';

import { Insurance, Region, User, Vehicle, VehicleType, Segment, PlanType, OfferColumnConfig, Client } from 'src/app/shared/models';
import * as PATH from 'src/app/shared/utils/request-paths.util'
import { UserFormComponent } from 'src/app/shared/forms/user-form/user-form.component';

type NamedCatalogEntity = VehicleType | Segment | PlanType;


@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.sass']
})
export class AdminMainComponent implements OnInit {

  readonly dialog = inject(MatDialog);
  public deleteDialogRef: MatDialogRef<DeleteModalComponent> | undefined;
  public infoDialogRef: MatDialogRef<InfoModalComponent> | undefined;
  public scrollStrategy: ScrollStrategy | undefined;
  username: string = 'Admin';

  regionColumns = [
    { id: 'id', header: 'ID', field: 'id' },
    { id: 'name', header: 'Regional', field: 'name' },
    { id: 'country', header: 'País', field: 'country' }
  ];

  regionRows = [];

  vehicleColumns = [
    { id: 'id', header: 'ID', field: 'id' },
    { id: 'brand', header: 'Marca', field: 'brand' },
    { id: 'classification', header: 'Clasificación', field: 'classification' },
    { id: 'model', header: 'Modelo', field: 'model' },
    { id: 'segment', header: 'Segmento', field: 'segment' },
    { id: 'vehicleType', header: 'Tipo de Vehículo', field: 'vehicleType' },
    { id: 'engineType', header: 'Tipo de Motor', field: 'engineType' }
  ];

  vehicleRows = [];

  insuranceColumns = [
    { id: 'id', header: 'ID', field: 'id' },
    { id: 'name', header: 'Nombre', field: 'name' },
    { id: 'type', header: 'Tipo', field: 'type' },
    { id: 'email', header: 'Correo Electrónico', field: 'email' }
  ];

  insuranceRows = [];

  brokerColumns = [
    { id: 'ci', header: 'ID', field: 'id' },
    { id: 'name', header: 'Nombre', field: 'name' },
    { id: 'email', header: 'Correo Electrónico', field: 'email' }
  ];

  brokerRows = [];

  vehicleTypeColumns = [
    { id: 'id', header: 'ID', field: 'id' },
    { id: 'name', header: 'Nombre', field: 'name' }
  ];

  vehicleTypeRows = [];

  segmentColumns = [
    { id: 'id', header: 'ID', field: 'id' },
    { id: 'name', header: 'Nombre', field: 'name' }
  ];

  segmentRows = [];

  planTypeColumns = [
    { id: 'id', header: 'ID', field: 'id' },
    { id: 'name', header: 'Nombre', field: 'name' }
  ];

  planTypeRows = [];

  clientColumns = [
    { id: 'id', header: 'ID', field: 'id' },
    { id: 'name', header: 'Nombre', valueGetter: (row: Client) => [row.name, row.paternalSurname, row.maternalSurname].filter(Boolean).join(' ') },
    { id: 'ci', header: 'CI', field: 'ci' },
    { id: 'email', header: 'Correo Electrónico', field: 'email' },
    { id: 'phone', header: 'Teléfono', field: 'phone' }
  ];

  clientRows = [];

  clientActions: any[] = [
    { id: 'info', icon: 'info', tooltip: 'Detalles' },
    { id: 'edit', icon: 'edit', tooltip: 'Editar' },
    { id: 'delete', icon: 'delete', tooltip: 'Eliminar' },
  ];

  clientDetailColumns = [
    { id: 'id', header: 'ID', field: 'id' },
    { id: 'name', header: 'Nombre', field: 'name' },
    { id: 'paternalSurname', header: 'Apellido Paterno', field: 'paternalSurname' },
    { id: 'maternalSurname', header: 'Apellido Materno', field: 'maternalSurname' },
    { id: 'marriedName', header: 'Apellido de Casada', field: 'marriedName' },
    { id: 'documentType', header: 'Tipo de Documento', field: 'documentType' },
    { id: 'ci', header: 'CI', field: 'ci' },
    { id: 'gender', header: 'Género', field: 'gender' },
    { id: 'birthdate', header: 'Fecha de Nacimiento', field: 'birthdate' },
    { id: 'countryOfBirth', header: 'País de Nacimiento', field: 'countryOfBirth' },
    { id: 'countryOfResidence', header: 'País de Residencia', field: 'countryOfResidence' },
    { id: 'maritalStatus', header: 'Estado Civil', field: 'maritalStatus' },
    { id: 'email', header: 'Correo Electrónico', field: 'email' },
    { id: 'phone', header: 'Teléfono', field: 'phone' },
    { id: 'cellphone', header: 'Celular', field: 'cellphone' },
    { id: 'address', header: 'Dirección', field: 'address' },
    { id: 'area', header: 'Área', field: 'area' },
    { id: 'profession', header: 'Profesión', field: 'profession' },
    { id: 'occupation', header: 'Ocupación', field: 'occupation' },
    { id: 'employmentSituation', header: 'Situación Laboral', field: 'employmentSituation' },
    { id: 'workPlace', header: 'Lugar de Trabajo', field: 'workPlace' },
    { id: 'salary', header: 'Salario', field: 'salary' },
  ];

  salesEnabled = true;

  offerColumns: OfferColumnConfig[] = [];

  actions: any[] = [
    { id: 'info', icon: 'info', tooltip: 'Detalles' },
    { id: 'edit', icon: 'edit', tooltip: 'Editar' },
    { id: 'delete', icon: 'delete', tooltip: 'Eliminar' },
  ];

  profilePictureURL = '/assets/admin-pp.jpg';

  get isMobile(): boolean {
    return this.responsiveService.isPhonePortrait;
  }

  constructor(
    private httpService: HttpService,
    private snackbar: SnackBarService,
    private responsiveService: ResponsiveService,
    private authService: AuthService,
    private salesConfigService: SalesConfigService,
    private offerColumnConfigService: OfferColumnConfigService,
    private router: Router) { }

  logout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.fetchRegionList();
    this.fetchVehicleList();
    this.fetchInsuranceList();
    this.fetchBrokerList();
    this.fetchVehicleTypeList();
    this.fetchSegmentList();
    this.fetchPlanTypeList();
    this.fetchClientList();
    this.salesConfigService.enabled$.subscribe(enabled => { this.salesEnabled = enabled; });
    this.offerColumnConfigService.columns$.subscribe(columns => { this.offerColumns = columns; });
  }

  onSalesEnabledChange(enabled: boolean): void {
    this.salesConfigService.update(enabled)
      .pipe(catchError(() => {
        this.snackbar.error('Error al actualizar la configuración de ventas.');
        this.salesEnabled = !enabled;
        return EMPTY;
      }))
      .subscribe(() => {
        this.snackbar.success(enabled ? 'Ventas habilitadas.' : 'Ventas deshabilitadas.');
      });
  }

  onOfferColumnToggle(column: OfferColumnConfig, enabled: boolean): void {
    this.offerColumnConfigService.update(column.id, enabled)
      .pipe(catchError(() => {
        this.snackbar.error('Error al actualizar la columna.');
        column.enabled = !enabled;
        return EMPTY;
      }))
      .subscribe(() => {
        this.snackbar.success(enabled ? `Columna "${column.label}" habilitada.` : `Columna "${column.label}" deshabilitada.`);
      });
  }

  private fetchInsuranceList() {
    this.httpService.get<any>(PATH.insuranceList)
      .pipe(catchError(() => { this.snackbar.error('Error al cargar las aseguradoras.'); return EMPTY; }))
      .subscribe(res => { this.insuranceRows = res; });
  }

  private fetchRegionList() {
    this.httpService.get<any>(PATH.regionList)
      .pipe(catchError(() => { this.snackbar.error('Error al cargar las regionales.'); return EMPTY; }))
      .subscribe(res => { this.regionRows = res; });
  }

  private fetchVehicleList() {
    this.httpService.get<any>(PATH.vehicleList)
      .pipe(catchError(() => { this.snackbar.error('Error al cargar los vehículos.'); return EMPTY; }))
      .subscribe(res => { this.vehicleRows = res; });
  }

  private fetchBrokerList() {
    this.httpService.get<any>(PATH.brokerList)
      .pipe(catchError(() => { this.snackbar.error('Error al cargar los brokers.'); return EMPTY; }))
      .subscribe(res => { this.brokerRows = res; });
  }

  private fetchVehicleTypeList() {
    this.httpService.get<any>(PATH.vehicleTypeList)
      .pipe(catchError(() => { this.snackbar.error('Error al cargar los tipos de vehículo.'); return EMPTY; }))
      .subscribe(res => { this.vehicleTypeRows = res; });
  }

  private fetchSegmentList() {
    this.httpService.get<any>(PATH.segmentList)
      .pipe(catchError(() => { this.snackbar.error('Error al cargar los segmentos.'); return EMPTY; }))
      .subscribe(res => { this.segmentRows = res; });
  }

  private fetchPlanTypeList() {
    this.httpService.get<any>(PATH.planTypeList)
      .pipe(catchError(() => { this.snackbar.error('Error al cargar los tipos de plan.'); return EMPTY; }))
      .subscribe(res => { this.planTypeRows = res; });
  }

  private fetchClientList() {
    this.httpService.get<any>(PATH.clientList)
      .pipe(catchError(() => { this.snackbar.error('Error al cargar los clientes.'); return EMPTY; }))
      .subscribe(res => { this.clientRows = res; });
  }

  openDeleteDialog(type: string, itemName: any, item: any): void {
    this.deleteDialogRef = this.dialog.open(DeleteModalComponent, {
      data: { type: type, element: itemName },
      scrollStrategy: this.scrollStrategy
    });

    this.deleteDialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        switch (type) {
          case 'Insurance': this.deleteEntity(type, item.id); break;
          case 'Region': this.deleteEntity(type, item.id); break;
          case 'Vehicle': this.deleteEntity(type, item.id); break;
          case 'VehicleType': this.deleteEntity(type, item.id); break;
          case 'Segment': this.deleteEntity(type, item.id); break;
          case 'PlanType': this.deleteEntity(type, item.id); break;
          case 'Client': this.deleteEntity(type, item.id); break;
        }
      }
    });
  }

  openInformationDialog(type: string, item: Vehicle | Region | Insurance | NamedCatalogEntity | Client): void {
    this.infoDialogRef = this.dialog.open(InfoModalComponent, {
      data: { title: 'Detalles', columns: this.getInformationColumns(type), element: item },
      scrollStrategy: this.scrollStrategy
    });
  }

  private getInformationColumns(type: string): any[] {
    switch (type) {
      case 'Insurance': return this.insuranceColumns;
      case 'Region': return this.regionColumns;
      case 'Vehicle': return this.vehicleColumns;
      case 'VehicleType': return this.vehicleTypeColumns;
      case 'Segment': return this.segmentColumns;
      case 'PlanType': return this.planTypeColumns;
      case 'Client': return this.clientDetailColumns;
      default: return [];
    }
  }

  openEntityDialog(type: string, entity?: Vehicle | Insurance | Region | User | NamedCatalogEntity | Client) {
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

    dialogRef.afterClosed().subscribe((result: Vehicle | Insurance | Region | User | NamedCatalogEntity | Client) => {
      if (result) {
        if (entity) {
          this.updateEntity(type, result, (entity as any).id);
        } else {
          this.saveEntity(type, result);
        }
      }
      sub1?.unsubscribe?.(); sub2?.unsubscribe?.();
    });
  }

  private getDialogRef(type: string): any {
    let dialogRef;
    switch (type) {
      case 'Vehicle':
        dialogRef = this.dialog.open(VehicleFormComponent, {
          width: '680px', maxWidth: '95vw', maxHeight: '90vh',
        }); break;
      case 'Insurance':
        dialogRef = this.dialog.open(InsuranceFormComponent, {
          width: '680px', maxWidth: '95vw', maxHeight: '90vh',
        }); break;
      case 'Region':
        dialogRef = this.dialog.open(RegionFormComponent, {
          width: '560px', maxWidth: '95vw', maxHeight: '90vh',
        }); break;
      case 'Broker':
        dialogRef = this.dialog.open(UserFormComponent, {
          width: '620px', maxWidth: '95vw', maxHeight: '90vh',
        }); break;
      case 'Client':
        dialogRef = this.dialog.open(ClientFormComponent, {
          width: '760px', maxWidth: '95vw', maxHeight: '90vh',
        }); break;
      case 'VehicleType':
      case 'Segment':
      case 'PlanType': {
        dialogRef = this.dialog.open(SimpleNameFormComponent, {
          width: '480px', maxWidth: '95vw', maxHeight: '90vh',
        });
        const cfg = this.catalogFormConfig[type];
        dialogRef.componentInstance.sectionTitle = cfg.sectionTitle;
        dialogRef.componentInstance.sectionIcon = cfg.sectionIcon;
        dialogRef.componentInstance.fieldLabel = cfg.fieldLabel;
        dialogRef.componentInstance.placeholder = cfg.placeholder;
        break;
      }
    }
    return dialogRef;
  }

  private readonly catalogFormConfig: Record<string, { sectionTitle: string; sectionIcon: string; fieldLabel: string; placeholder: string }> = {
    VehicleType: { sectionTitle: 'Datos del Tipo de Vehículo', sectionIcon: 'directions_car', fieldLabel: 'Nombre del Tipo de Vehículo', placeholder: 'Ej. Automóvil' },
    Segment: { sectionTitle: 'Datos del Segmento', sectionIcon: 'category', fieldLabel: 'Nombre del Segmento', placeholder: 'Ej. Individual' },
    PlanType: { sectionTitle: 'Datos del Tipo de Plan', sectionIcon: 'assignment', fieldLabel: 'Nombre del Tipo de Plan', placeholder: 'Ej. Básico' },
  };

  private handleEditEntity(entity: Vehicle | Insurance | Region | User | NamedCatalogEntity | Client, dialogRef: any) {
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
      case 'info': this.openInformationDialog(type, e.row); break;
      case 'edit': this.openEntityDialog(type, e.row); break;
      case 'delete': this.openDeleteDialog(type, this.getEntityDisplayName(type, e.row), e.row); break;
    }
  }

  private getEntityDisplayName(type: string, row: any): string {
    if (type === 'Client') {
      return [row.name, row.paternalSurname, row.maternalSurname].filter(Boolean).join(' ');
    }
    return row.name;
  }

  private saveEntity(type: string, payload: Insurance | Vehicle | Region | User | NamedCatalogEntity | Client): void {
    let path = this.getEntityPath(type) + '/add';
    if (type == 'Broker') {
      path += '/brokers';
    }
    this.httpService.post(path, payload)
      .pipe(catchError(() => { this.snackbar.error('Error al guardar.'); return EMPTY; }))
      .subscribe(() => {
        this.snackbar.success('Guardado con éxito');
        this.refreshData(type);
      });
  }

  private updateEntity(type: string, payload: Insurance | Vehicle | Region | User | NamedCatalogEntity | Client, id: any): void {
    const path = this.getEntityPath(type) + '/edit/' + id;
    this.httpService.put(path, payload)
      .pipe(catchError(() => { this.snackbar.error('Error al actualizar.'); return EMPTY; }))
      .subscribe(() => {
        this.snackbar.success('Actualizado con éxito');
        this.refreshData(type);
      });
  }

  private deleteEntity(entityType: string, entityID: string): void {
    const path = this.getEntityPath(entityType) + '/delete/' + entityID;
    this.httpService.delete(path)
      .pipe(catchError(() => { this.snackbar.error('Error al eliminar.'); return EMPTY; }))
      .subscribe(() => {
        this.snackbar.success('Eliminado correctamente.');
        this.refreshData(entityType);
      });
  }

  private getEntityPath(entityType: string): string {
    switch (entityType) {
      case 'Vehicle': return PATH.vehiclePath;
      case 'Insurance': return PATH.insurancePath;
      case 'Region': return PATH.regionPath;
      case 'Broker': return PATH.adminPath;
      case 'VehicleType': return PATH.vehicleTypePath;
      case 'Segment': return PATH.segmentPath;
      case 'PlanType': return PATH.planTypePath;
      case 'Client': return PATH.clientPath;
      default: return '';
    }
  }

  private refreshData(tableType: string): void {
    switch (tableType) {
      case 'Insurance': this.fetchInsuranceList(); break;
      case 'Vehicle': this.fetchVehicleList(); break;
      case 'Region': this.fetchRegionList(); break;
      case 'Broker': this.fetchBrokerList(); break;
      case 'VehicleType': this.fetchVehicleTypeList(); break;
      case 'Segment': this.fetchSegmentList(); break;
      case 'PlanType': this.fetchPlanTypeList(); break;
      case 'Client': this.fetchClientList(); break;
    }
  }

  navigateTo(path: string): void {

  }

  navigateToPlans(): void {
    this.router.navigateByUrl('/admin/plans');
  }

}
