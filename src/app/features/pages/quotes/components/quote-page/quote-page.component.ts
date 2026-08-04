import { ScrollStrategy } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';
import { PlanPurchaseService } from 'src/app/core/services/plan-purchase/plan-purchase.service';
import { SalesConfigService } from 'src/app/core/services/sales-config/sales-config.service';
import { QuoteStepperService } from 'src/app/core/services/quote-stepper/quote-stepper.service';

import { SendEmailModalComponent } from 'src/app/shared/components/send-email-modal/send-email-modal.component';

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
    private stepperService: QuoteStepperService,
    private dialog: MatDialog
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

  get primaAlContado(): number {
    const premium = Number(this.quotePlan?.minimumPremium) || 0;
    const rate = Number(this.quotePlan?.rate) || 0;
    return premium + (premium * (rate / 100));
  }

  get primaACredito(): number {
    const contado = this.primaAlContado;
    const interest = Number(this.quotePlan?.interest) || 0;
    return contado + (contado * (interest / 100));
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
    const doc = this.buildQuotePdf();
    const fileName = `Cotizacion_${this.insuranceData?.name ?? 'Plan'}_${this.quotePlan?.id ?? this.quoteId}.pdf`.replace(/\s+/g, '_');
    doc.save(fileName);
  }

  openSendEmailModal(): void {
    if (!this.quotePlan) return;
    const dialogRef = this.dialog.open(SendEmailModalComponent, { width: '420px', maxWidth: '95vw' });
    dialogRef.afterClosed().subscribe((email?: string) => {
      if (email) this.sendPdfByEmail(email);
    });
  }

  private sendPdfByEmail(email: string): void {
    if (!this.quotePlan) return;
    const doc = this.buildQuotePdf();
    const base64Pdf = doc.output('datauristring').split(',').pop() ?? '';

    this.httpService.post(PATH.planSendEmail + '/' + this.quotePlan.id, { base64Pdf, email })
      .pipe(catchError(() => { this.snackbarService.error('Error al enviar el correo.'); return EMPTY; }))
      .subscribe(() => this.snackbarService.success('Correo enviado correctamente.'));
  }

  private buildQuotePdf(): jsPDF {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 14;
    let cursorY = 18;

    const titleText = this.quotePlan?.name ?? '';
    const titlePaddingX = 4;
    const tileHeight = 11;
    const tileX = marginX;
    const tileY = cursorY - 6;
    const tileWidth = pageWidth - marginX * 2;

    // --kin-accent (#ff8b22), same solid-bar treatment as the section headers below
    doc.setFillColor(255, 139, 34);
    doc.rect(tileX, tileY, tileWidth, tileHeight, 'F');

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(244, 240, 230);
    doc.text(titleText, tileX + titlePaddingX, tileY + tileHeight / 2, { baseline: 'middle' });
    doc.setTextColor(0, 0, 0);

    cursorY = tileY + tileHeight + 7;
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
      headStyles: { fillColor: [64, 136, 162], textColor: [244, 240, 230] },
      margin: { left: marginX, right: marginX },
    });

    const planDetailsBody: string[][] = [];
    if (this.quotePlan?.discount) {
      planDetailsBody.push(['Descuento', `${this.formatNumber(this.quotePlan.discount)} %`]);
    }
    planDetailsBody.push(['Franquicia', this.quotePlan?.franchise ?? '-']);
    planDetailsBody.push(['Prima al Contado', `${this.formatNumber(this.primaAlContado)} Bs.`]);
    planDetailsBody.push(['Prima a Crédito', `${this.formatNumber(this.primaACredito)} Bs.`]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 8,
      head: [['Detalles del Plan', '']],
      body: planDetailsBody,
      theme: 'grid',
      headStyles: { fillColor: [64, 136, 162], textColor: [244, 240, 230] },
      margin: { left: marginX, right: marginX },
    });

    cursorY = (doc as any).lastAutoTable.finalY + 5;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100);
    const creditLegend = doc.splitTextToSize(
      'Prima a Crédito: Cuota inicial del 30% y cuatro (4) cuotas iguales los siguientes meses.',
      pageWidth - marginX * 2
    );
    doc.text(creditLegend, marginX, cursorY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    cursorY += creditLegend.length * 3.5 + 5;

    const benefitRows = (this.planBenefits ?? []).map(b => [b.benefitName ?? '-', b.description ?? '-']);
    autoTable(doc, {
      startY: cursorY,
      head: [['Coberturas', 'Descripción']],
      body: benefitRows.length ? benefitRows : [['-', 'No se registraron beneficios para este plan.']],
      theme: 'grid',
      headStyles: { fillColor: [64, 136, 162], textColor: [244, 240, 230] },
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

    return doc;
  }

  private formatNumber(value?: number): string {
    if (value === undefined || value === null || isNaN(value)) return '-';
    return Math.round(value).toString();
  }

}
