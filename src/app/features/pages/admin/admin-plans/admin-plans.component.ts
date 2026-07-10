import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import { Benefit, Insurance, Plan, Region, Vehicle } from 'src/app/shared/models';

import * as PATHS from 'src/app/shared/utils/request-paths.util';
import { Action, Column } from 'src/app/shared/utils/data-table-types.util';

import { LevelLabelPipe } from 'src/app/shared/pipes/level-pipe/level-label.pipe';
import { CoverageLabelPipe } from 'src/app/shared/pipes/coverage-pipe/coverage-label.pipe';

import { catchError, EMPTY, forkJoin } from 'rxjs';


@Component({
  selector: 'app-admin-plans',
  templateUrl: './admin-plans.component.html',
  styleUrls: ['./admin-plans.component.sass'],
  providers: [LevelLabelPipe, CoverageLabelPipe]
})
export class AdminPlansComponent implements OnInit {

  readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  username: string = 'Admin';
  profilePictureURL = '/assets/admin-pp.jpg';

  vehicleMap: Record<number, Vehicle> = {};
  regionMap: Record<number, Region> = {};
  insuranceMap: Record<number, Insurance> = {};

  planColumns: Column<Plan>[] = [
    { id: 'id', header: 'ID', field: 'id' },
    { id: 'vehicleId', header: 'Vehículo', field: 'vehicleId', valueGetter: (row) => this.vehicleMap[row.vehicleId!]?.brand ?? '—' },
    { id: 'regionalId', header: 'Regional', field: 'regionalId', valueGetter: (row) => this.regionMap[row.regionalId!]?.name ?? '—' },
    { id: 'insuranceId', header: 'Aseguradora', field: 'insuranceId', valueGetter: (row) => this.insuranceMap[row.insuranceId!]?.name ?? '—' },
    { id: 'minimumPremium', header: 'Prima (Bs.)', field: 'minimumPremium' },
    { id: 'rate', header: 'Tasa (%)', field: 'rate' },
    { id: 'ageLimit', header: 'Límite de Años', field: 'ageLimit' },
    { id: 'discount', header: 'Descuento (%)', field: 'discount' },
    { id: 'level', header: 'Nivel', field: 'level', valueGetter: (row) => this.levelLabelPipe.transform(row.level) },
    { id: 'franchise', header: 'Franquicia (Bs.)', field: 'franchise' },
    { id: 'state', header: 'Plan Activado', field: 'state' },
    { id: 'createdBy', header: 'Broker', field: 'createdBy' }
  ];

  planRows: Plan[] = [];

  benefitColumns: Column<Benefit>[] = [
    { id: 'id', header: 'ID', field: 'id' },
    { id: 'name', header: 'Nombre del Beneficio', field: 'name' },
    { id: 'description', header: 'Descripción', field: 'description' },
    { id: 'coverage', header: 'Tipo de Cobertura', field: 'coverage', valueGetter: (row) => this.coverageLabelPipe.transform(row.coverage) },
  ];

  benefitRows: Benefit[] = [];

  planActions: Action[] = [
    { id: 'info', icon: 'info', tooltip: 'Detalles' },
    { id: 'add', icon: 'add', tooltip: 'Añadir Beneficios' },
  ];

  actions: Action[] = [
    { id: 'info', icon: 'info', tooltip: 'Detalles' },
    { id: 'edit', icon: 'edit', tooltip: 'Editar' },
    { id: 'delete', icon: 'delete', tooltip: 'Eliminar' },
  ];

  private readonly DEFAULT_BENEFIT_LIMITS = [{ name: 'cobertura', limit: 90 }];

  get isMobile(): boolean {
    return this.responsiveService.isPhonePortrait;
  }

  constructor(
    private httpService: HttpService,
    private snackbar: SnackBarService,
    private levelLabelPipe: LevelLabelPipe,
    private coverageLabelPipe: CoverageLabelPipe,
    private responsiveService: ResponsiveService,
    private authService: AuthService,
    private router: Router) { }

  logout(): void {
    this.authService.logout();
  }

  navigateToEntities(): void {
    this.router.navigateByUrl('/admin');
  }

  ngOnInit(): void {
    this.fetchBenefitList();
    forkJoin({
      vehicles: this.httpService.get<Vehicle[]>(PATHS.vehicleList),
      regions: this.httpService.get<Region[]>(PATHS.regionList),
      insurances: this.httpService.get<Insurance[]>(PATHS.insuranceList),
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: ({ vehicles, regions, insurances }) => {
        this.vehicleMap = Object.fromEntries(vehicles.map(v => [v.id, v]));
        this.regionMap = Object.fromEntries(regions.map(r => [r.id, r]));
        this.insuranceMap = Object.fromEntries(insurances.map(i => [i.id, i]));
        this.fetchPlanList();
      },
      error: () => this.snackbar.error('Error al cargar datos de referencia.')
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
          this.updateEntity(type, result);
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
        return this.dialog.open(PlanFormComponent, { height: '600px', width: '520px' });
      case 'Benefit':
        return this.dialog.open(BenefitFormComponent, { width: '520px' });
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
      case 'add': this.openAddBenefitsModal(e.row); break;
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
      const payload = { planId, benefitId: b.id, limits: this.DEFAULT_BENEFIT_LIMITS };
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

  private updateEntity(type: string, payload: Plan | Benefit): void {
    const path = this.getEntityPath(type) + '/edit';
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