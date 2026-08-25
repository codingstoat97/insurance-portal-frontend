import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ResponsiveService } from 'src/app/core/services/responsive/responsive.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';

import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { InfoModalComponent } from 'src/app/shared/components/info-modal/info-modal.component';
import { AddBenefitModalComponent } from 'src/app/shared/components/add-benefit-modal/add-benefit-modal.component';
import { BenefitFormComponent } from 'src/app/shared/forms/benefit-form/benefit-form.component';
import { PlanFormComponent } from 'src/app/shared/forms/plan-form/plan-form.component';
import { BrokerFormComponent } from 'src/app/shared/forms/broker-form/broker-form.component';
import { Benefit, Broker, ClientPlanApproval, Insurance, Plan, Region } from 'src/app/shared/models';

import * as PATHS from 'src/app/shared/utils/request-paths.util';
import { Action, Column } from 'src/app/shared/utils/data-table-types.util';

import { CoverageLabelPipe } from 'src/app/shared/pipes/coverage-pipe/coverage-label.pipe';

import { catchError, EMPTY, forkJoin } from 'rxjs';


@Component({
  selector: 'app-broker-main',
  templateUrl: './broker-main.component.html',
  styleUrls: ['./broker-main.component.sass'],
  providers: [CoverageLabelPipe]
})
export class BrokerMainComponent implements OnInit {

  readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  username: string = 'Erick Kinlock';
  profilePictureURL = '/assets/default-profile.svg';
  broker?: Broker;

  regionMap: Record<number, Region> = {};
  insuranceMap: Record<number, Insurance> = {};

  planColumns: Column<Plan>[] = [
    { id: 'id', header: 'ID', field: 'id' },
    { id: 'name', header: 'Nombre', field: 'name' },
    { id: 'regionalId', header: 'Regional', field: 'regionalId', valueGetter: (row) => this.regionMap[row.regionalId!]?.name ?? '—' },
    { id: 'insuranceId', header: 'Aseguradora', field: 'insuranceId', valueGetter: (row) => this.insuranceMap[row.insuranceId!]?.name ?? '—' },
    { id: 'minimumPremium', header: 'Prima (Bs.)', valueGetter: (row) => row.minimumPremium?.toFixed(2) ?? '—' },
    { id: 'rate', header: 'Tasa (%)', field: 'rate' },
    { id: 'ageLimit', header: 'Límite de Años', field: 'ageLimit' },
    { id: 'discount', header: 'Descuento (%)', field: 'discount' },
    { id: 'interest', header: 'Interés (%)', field: 'interest' },
    { id: 'segment', header: 'Segmento', field: 'segment' },
    { id: 'planType', header: 'Tipo de Plan', field: 'planType' },
    { id: 'franchise', header: 'Franquicia', field: 'franchise' },
    { id: 'state', header: 'Plan Activado', field: 'state' }
  ];

  planRows: Plan[] = [];

  benefitColumns: Column<Benefit>[] = [
    { id: 'id', header: 'ID', field: 'id' },
    { id: 'name', header: 'Nombre del Beneficio', field: 'name' },
    { id: 'description', header: 'Descripción', field: 'description' },
    { id: 'coverage', header: 'Tipo de Cobertura', field: 'coverage', valueGetter: (row) => this.coverageLabelPipe.transform(row.coverage) },
  ];

  benefitRows: Benefit[] = [];

  approvalColumns: Column<ClientPlanApproval>[] = [
    { id: 'id', header: 'ID', field: 'id' },
    { id: 'clientName', header: 'Cliente', valueGetter: (row) => this.getClientFullName(row) },
    { id: 'clientCellphone', header: 'Celular', valueGetter: (row) => row.client?.cellphone ?? '—' },
    { id: 'vehiclePlate', header: 'Placa', field: 'vehiclePlate' },
    { id: 'vehiclePrice', header: 'Precio Vehículo (Bs.)', field: 'vehiclePrice' },
    { id: 'insurance', header: 'Aseguradora', valueGetter: (row) => this.insuranceMap[row.plan?.insuranceId!]?.name ?? '—' },
    { id: 'planType', header: 'Tipo de Plan', valueGetter: (row) => row.plan?.planType ?? '—' },
  ];

  waitingListRows: ClientPlanApproval[] = [];
  soldPlanRows: ClientPlanApproval[] = [];

  waitingListActions: Action[] = [
    { id: 'approve', icon: 'check_circle', tooltip: 'Aprobar' },
  ];

  planActions: Action[] = [
    { id: 'info', icon: 'info', tooltip: 'Detalles' },
    { id: 'edit', icon: 'edit', tooltip: 'Editar' },
    { id: 'add', icon: 'add', tooltip: 'Añadir Beneficios' },
    { id: 'delete', icon: 'delete', tooltip: 'Eliminar' },
  ];

  actions: Action[] = [
    { id: 'info', icon: 'info', tooltip: 'Detalles' },
    { id: 'edit', icon: 'edit', tooltip: 'Editar' },
    { id: 'delete', icon: 'delete', tooltip: 'Eliminar' },
  ];

  get isMobile(): boolean {
    return this.responsiveService.isPhonePortrait;
  }

  constructor(
    private httpService: HttpService,
    private snackbar: SnackBarService,
    private coverageLabelPipe: CoverageLabelPipe,
    private responsiveService: ResponsiveService,
    private authService: AuthService) { }

  logout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.fetchBrokerInfo();
    this.fetchBenefitList();
    forkJoin({
      regions: this.httpService.get<Region[]>(PATHS.regionList),
      insurances: this.httpService.get<Insurance[]>(PATHS.insuranceList),
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: ({ regions, insurances }) => {
        this.regionMap = Object.fromEntries(regions.map(r => [r.id, r]));
        this.insuranceMap = Object.fromEntries(insurances.map(i => [i.id, i]));
        this.fetchPlanList();
        this.fetchWaitingListPlans();
        this.fetchSoldPlans();
      },
      error: () => this.snackbar.error('Error al cargar datos de referencia.')
    });
  }

  fetchWaitingListPlans(): void {
    this.httpService.get<ClientPlanApproval[]>(PATHS.brokerGetWaitingListPlans)
      .pipe(
        catchError(() => { this.snackbar.error('Error al cargar las pólizas pendientes.'); return EMPTY; }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => { this.waitingListRows = res; });
  }

  fetchSoldPlans(): void {
    this.httpService.get<ClientPlanApproval[]>(PATHS.brokerGetSoldPlans)
      .pipe(
        catchError(() => { this.snackbar.error('Error al cargar las pólizas aprobadas.'); return EMPTY; }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => { this.soldPlanRows = res; });
  }

  private getClientFullName(row: ClientPlanApproval): string {
    const client = row.client;
    if (!client) return '—';
    return [client.name, client.paternalSurname, client.maternalSurname].filter(Boolean).join(' ');
  }

  onWaitingListRowAction(e: { actionId: string; row: ClientPlanApproval }): void {
    if (e.actionId === 'approve') {
      this.confirmSoldPlan(e.row);
    }
  }

  private confirmSoldPlan(row: ClientPlanApproval): void {
    this.httpService.put(PATHS.brokerConfirmSoldPlan + '/' + row.id, {})
      .pipe(
        catchError(() => { this.snackbar.error('Error al aprobar la póliza.'); return EMPTY; }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.snackbar.success('Póliza aprobada correctamente');
        this.fetchWaitingListPlans();
        this.fetchSoldPlans();
      });
  }

  fetchPlanList(): void {
    this.httpService.get<Plan[]>(PATHS.planList)
      .pipe(
        catchError(() => { this.snackbar.error('Error al cargar los planes.'); return EMPTY; }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => { this.planRows = res; });
  }

  fetchBrokerInfo(): void {
    this.httpService.get<Broker>(PATHS.brokerGetByID)
      .pipe(
        catchError(() => { this.snackbar.error('Error al cargar tu perfil.'); return EMPTY; }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        this.broker = res;
        this.username = res.name;
        this.profilePictureURL = res.logo || '/assets/default-profile.svg';
      });
  }

  openEditProfileDialog(): void {
    const dialogRef = this.dialog.open(BrokerFormComponent, { width: '640px', maxWidth: '95vw', maxHeight: '90vh' });
    dialogRef.componentInstance.title = 'Editar Perfil';
    dialogRef.componentInstance.value = this.broker;
    dialogRef.componentInstance.submitLabel = 'Guardar Cambios';
    dialogRef.componentInstance.showCancel = true;

    const sub1 = dialogRef.componentInstance.submitted.subscribe((payload: Broker) => {
      dialogRef.close(payload);
    });
    const sub2 = dialogRef.componentInstance.cancelled.subscribe(() => {
      dialogRef.close();
    });

    dialogRef.afterClosed().subscribe((result?: Broker) => {
      if (result) {
        this.updateProfile(result);
      }
      sub1.unsubscribe();
      sub2.unsubscribe();
    });
  }

  private updateProfile(payload: Broker): void {
    this.httpService.put(PATHS.brokerUpdate, payload)
      .pipe(
        catchError(() => { this.snackbar.error('Error al actualizar tu perfil.'); return EMPTY; }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.snackbar.success('Perfil actualizado con éxito');
        this.fetchBrokerInfo();
      });
  }

  fetchBenefitList(): void {
    this.httpService.get<Benefit[]>(PATHS.benefitList)
      .pipe(
        catchError(() => { this.snackbar.error('Error al cargar los beneficios.'); return EMPTY; }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => { this.benefitRows = res; });
  }

  openEntityDialog(type: string, entity?: Plan | Benefit): void {
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
        if (entity) {
          this.updateEntity(type, result, entity.id);
        } else {
          this.saveEntity(type, result);
        }
      }
      sub1?.unsubscribe?.();
      sub2?.unsubscribe?.();
    });
  }

  private getDialogRef(type: string): MatDialogRef<any> {
    switch (type) {
      case 'Plan':
        return this.dialog.open(PlanFormComponent, { width: '760px', maxWidth: '95vw', maxHeight: '90vh' });
      case 'Benefit':
        return this.dialog.open(BenefitFormComponent, { width: '620px', maxWidth: '95vw', maxHeight: '90vh' });
      default:
        throw new Error(`Unknown entity type: ${type}`);
    }
  }

  openInformationDialog(type: string, item: Plan | Benefit): void {
    this.dialog.open(InfoModalComponent, {
      data: { title: 'Detalles', columns: this.getInformationColumns(type), element: item },
    });
  }

  private getInformationColumns(type: string): any[] {
    switch (type) {
      case 'Plan': return this.planColumns;
      case 'Benefit': return this.benefitColumns;
      default: return [];
    }
  }

  openDeleteDialog(type: string, itemName: any, item: any): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      data: { type: type, element: itemName },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteEntity(type, item.id);
      }
    });
  }

  private deleteEntity(entityType: string, entityID: string): void {
    const path = this.getEntityPath(entityType) + '/delete/' + entityID;
    this.httpService.delete(path)
      .pipe(
        catchError(() => { this.snackbar.error('Error al eliminar.'); return EMPTY; }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.snackbar.success('Eliminado correctamente.');
        this.refreshData(entityType);
      });
  }

  private handleEditEntity(entity: Plan | Benefit, dialogRef: MatDialogRef<any>): void {
    dialogRef.componentInstance.title = 'Editar';
    dialogRef.componentInstance.value = entity;
    dialogRef.componentInstance.showDescription = false;
    dialogRef.componentInstance.submitLabel = 'Guardar Cambios';
    dialogRef.componentInstance.showCancel = true;
  }

  private handleAddNewEntity(dialogRef: MatDialogRef<any>): void {
    dialogRef.componentInstance.title = 'Crear Nuevo';
    dialogRef.componentInstance.value = null;
    dialogRef.componentInstance.showDescription = false;
    dialogRef.componentInstance.submitLabel = 'Guardar';
    dialogRef.componentInstance.showCancel = true;
  }

  onRowAction(type: string, e: { actionId: string; row: any }): void {
    switch (e.actionId) {
      case 'info': this.openInformationDialog(type, e.row); break;
      case 'edit': this.openEntityDialog(type, e.row); break;
      case 'delete': this.openDeleteDialog(type, e.row.name, e.row); break;
    }
  }

  onPlanRowAction(type: string, e: { actionId: string; row: any }): void {
    switch (e.actionId) {
      case 'info': this.openInformationDialog(type, e.row); break;
      case 'edit': this.openEntityDialog(type, e.row); break;
      case 'add': this.openAddBenefitsModal(e.row); break;
      case 'delete': this.openDeleteDialog(type, e.row.name, e.row); break;
    }
  }

  onAddNewElement(type: string): void {
    this.openEntityDialog(type);
  }

  openAddBenefitsModal(plan: Plan): void {
    const dialogRef = this.dialog.open(AddBenefitModalComponent, {
      data: plan,
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((selectedBenefits: Benefit[] | undefined) => {
      if (!selectedBenefits) return;
      this.savePlanBenefits(plan, selectedBenefits);
    });
  }

  private savePlanBenefits(plan: Plan, benefits: Benefit[]): void {
    const planId = plan?.id;

    if (!planId) {
      this.snackbar.error('No existe un plan con ese ID');
      return;
    }

    const requests = benefits.map(b => {
      const payload = { planId, benefitId: b.id, description: b.description };
      return this.httpService.post(PATHS.planBenefitsAdd, payload);
    });

    forkJoin(requests).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.snackbar.success('Beneficios agregados correctamente'),
      error: () => this.snackbar.error('No se pudieron añadir los beneficios'),
    });
  }

  private saveEntity(type: string, payload: Plan | Benefit): void {
    const path = this.getEntityPath(type) + '/add';
    this.httpService.post(path, payload)
      .pipe(
        catchError(() => { this.snackbar.error('Error al guardar.'); return EMPTY; }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.snackbar.success('Guardado con éxito');
        this.refreshData(type);
      });
  }

  private updateEntity(type: string, payload: Plan | Benefit, id: number | string): void {
    const path = this.getEntityPath(type) + '/edit/' + id;
    this.httpService.put(path, payload)
      .pipe(
        catchError(() => { this.snackbar.error('Error al actualizar.'); return EMPTY; }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.snackbar.success('Actualizado con éxito');
        this.refreshData(type);
      });
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
