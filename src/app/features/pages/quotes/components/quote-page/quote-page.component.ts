import { ScrollStrategy } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';
import { PlanPurchaseService } from 'src/app/core/services/plan-purchase/plan-purchase.service';
import { SalesConfigService } from 'src/app/core/services/sales-config/sales-config.service';
import { QuoteStepperService } from 'src/app/core/services/quote-stepper/quote-stepper.service';

import { catchError, EMPTY } from 'rxjs';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { ClientVehicle, Insurance, Plan, PlanBenefit, Region, Vehicle } from 'src/app/shared/models';
import * as PATH from 'src/app/shared/utils/request-paths.util';

@Component({
  selector: 'app-quote-page',
  templateUrl: './quote-page.component.html',
  styleUrls: ['./quote-page.component.sass']
})
export class QuotePageComponent {
  private quoteId!: number;
  public quotePlan!: Plan | null;

  public planBenefits: PlanBenefit[] | null = [];
  public insuranceData!: Insurance | null;
  public vehicleData!: Vehicle | null;
  public regionData!: Region | null;
  public clientVehicleData!: ClientVehicle | null;

  public scrollStrategy: ScrollStrategy | undefined;
  readonly salesEnabled$ = this.salesConfigService.enabled$;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private snackbarService: SnackBarService,
    private planPurchaseService: PlanPurchaseService,
    private salesConfigService: SalesConfigService,
    private stepperService: QuoteStepperService
  ) { }

  ngOnInit(): void {
    this.clientVehicleData = this.stepperService.clientVehicleData;
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.quoteId = +idParam;
        this.loadQuote();
      }
    });
  }

  private loadQuote(): void {
    this.httpService.get<Plan>(PATH.planGetByID + '/' + this.quoteId)
      .pipe(catchError(() => { this.snackbarService.error('Error al cargar el plan.'); return EMPTY; }))
      .subscribe(res => {
        this.quotePlan = res;
        this.fetchPlanBenefits();
        this.fetchInsuranceData();
        this.fetchRegionData();
        this.fetchVehicleData();
      });
  }

  private fetchPlanBenefits(): void {
    if (!this.quotePlan) return;
    this.httpService.get<PlanBenefit[]>(PATH.planBenefitsGetAllByPlan + '/' + this.quotePlan?.id)
      .pipe(catchError(() => { this.snackbarService.error('Error al cargar los beneficios del plan.'); return EMPTY; }))
      .subscribe(res => { this.planBenefits = res; });
  }

  private fetchInsuranceData(): void {
    if (!this.quotePlan) return;
    this.httpService.get<Insurance>(PATH.insuranceGetByID + '/' + this.quotePlan?.insuranceId)
      .pipe(catchError(() => { this.snackbarService.error('Error al cargar los datos de la aseguradora.'); return EMPTY; }))
      .subscribe(res => { this.insuranceData = res; });
  }

  private fetchRegionData(): void {
    if (!this.quotePlan) return;
    this.httpService.get<Region>(PATH.regionGetByID + '/' + this.quotePlan?.regionalId)
      .pipe(catchError(() => { this.snackbarService.error('Error al cargar los datos de la regional.'); return EMPTY; }))
      .subscribe(res => { this.regionData = res; });
  }

  private fetchVehicleData(): void {
    if (!this.quotePlan) return;
    this.httpService.get<Vehicle>(PATH.vehicleGetByID + '/' + this.quotePlan?.vehicleId)
      .pipe(catchError(() => { this.snackbarService.error('Error al cargar los datos del vehículo.'); return EMPTY; }))
      .subscribe(res => { this.vehicleData = res; });
  }

  openPurchaseDialog(): void {
    if (!this.quotePlan) return;
    this.planPurchaseService.openPurchaseDialog(this.quotePlan.id);
  }

  goBack(): void {
    this.location.back();
  }

  downloadPdf(): void {
    if (!this.quotePlan) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 14;
    let cursorY = 18;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Plan de ${this.insuranceData?.name ?? ''} Seguros - Seguro ${this.insuranceData?.type ?? ''}`, marginX, cursorY);

    cursorY += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Contacto: ${this.insuranceData?.email ?? '-'}`, marginX, cursorY);

    cursorY += 5;
    doc.text(`Regional: ${this.regionData?.name ?? '-'}, ${this.regionData?.country ?? '-'}`, marginX, cursorY);

    cursorY += 5;
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-BO')}`, marginX, cursorY);

    cursorY += 8;

    autoTable(doc, {
      startY: cursorY,
      head: [['Datos del Vehículo', '']],
      body: [
        ['Marca', this.vehicleData?.brand ?? '-'],
        ['Modelo', this.vehicleData?.model ?? '-'],
        ['Año', this.clientVehicleData?.year ? String(this.clientVehicleData.year) : '-'],
        ['Valor del Vehículo', this.clientVehicleData?.vehicleValue ? `${this.formatNumber(this.clientVehicleData.vehicleValue)} Bs.` : '-'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [33, 37, 41] },
      margin: { left: marginX, right: marginX },
    });

    const planDetailsBody: string[][] = [];
    if (this.quotePlan?.discount) {
      planDetailsBody.push(['Descuento', `${this.formatNumber(this.quotePlan.discount)} %`]);
    }
    planDetailsBody.push(['Franquicia', this.quotePlan?.franchise ?? '-']);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 8,
      head: [['Detalles del Plan', '']],
      body: planDetailsBody,
      theme: 'grid',
      headStyles: { fillColor: [33, 37, 41] },
      margin: { left: marginX, right: marginX },
    });

    const benefitRows = (this.planBenefits ?? []).map(b => [b.benefitName ?? '-', b.description ?? '-']);
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 8,
      head: [['Coberturas', 'Descripción']],
      body: benefitRows.length ? benefitRows : [['-', 'No se registraron beneficios para este plan.']],
      theme: 'grid',
      headStyles: { fillColor: [33, 37, 41] },
      margin: { left: marginX, right: marginX },
      columnStyles: { 0: { cellWidth: 55 } },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(`Plan ID: ${this.quotePlan?.id ?? '-'}`, marginX, finalY);
    doc.text('Este documento es informativo y no constituye una póliza de seguro.', marginX, finalY + 5);

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Página ${i} de ${pageCount}`, pageWidth - marginX - 20, doc.internal.pageSize.getHeight() - 10);
    }

    const fileName = `Cotizacion_${this.insuranceData?.name ?? 'Plan'}_${this.quotePlan?.id ?? this.quoteId}.pdf`.replace(/\s+/g, '_');
    doc.save(fileName);
  }

  private formatNumber(value?: number): string {
    if (value === undefined || value === null || isNaN(value)) return '-';
    return Math.round(value).toString();
  }

}
