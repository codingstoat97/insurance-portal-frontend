import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FormImportsModule } from '../form-imports.module';

import { catchError, EMPTY } from 'rxjs';

import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';
import { HttpService } from 'src/app/core/services/http/http.service';

import { Plan, Region, Insurance, Benefit, Broker, Segment, PlanType, VehicleType } from 'src/app/shared/models';
import * as PATH from 'src/app/shared/utils/request-paths.util';

@Component({
  selector: 'app-plan-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormImportsModule
  ],
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.sass']
})
export class PlanFormComponent implements OnInit, OnChanges {
  @Input() value?: Plan;
  @Input() title?: string | null = 'Datos del Plan';
  @Input() submitLabel?: string | null = 'Guardar';
  @Input() showCancel = false;
  @Input() showBrokerSelect = false;

  @Output() submitted = new EventEmitter<Plan>();
  @Output() cancelled = new EventEmitter<void>();

  planForEdit: Plan | null = null;
  regionList: Region[] = [];
  insuranceList: Insurance[] = [];
  benefitList: Benefit[] = [];
  brokerList: Broker[] = [];
  segmentList: Segment[] = [];
  planTypeList: PlanType[] = [];
  vehicleTypeList: VehicleType[] = [];
  engineTypeList: string[] = [];

  form = this.fb.group({
    name: this.fb.control<string | null>(null, { validators: [Validators.required] }),
    regionalId: this.fb.control<number | null>(null, { validators: [] }),
    insuranceId: this.fb.control<number | null>(null, { validators: [] }),
    minimumPremium: this.fb.control<number | null>(null),
    rate: this.fb.control<number | null>(null),
    ageLimit: this.fb.control<number | null>(null),
    discount: this.fb.control<number | null>(null),
    interest: this.fb.control<number | null>(null),
    segmentId: this.fb.control<number | null>(null, { validators: [Validators.required] }),
    planTypeId: this.fb.control<number | null>(null, { validators: [Validators.required] }),
    vehicleTypeId: this.fb.control<number | null>(null, { validators: [Validators.required] }),
    engineType: this.fb.control<string | null>(null, { validators: [Validators.required] }),
    franchisePercentage: this.fb.control<number | null>(null, { validators: [Validators.min(0)] }),
    franchiseMinimum: this.fb.control<number | null>(null, { validators: [Validators.min(0)] }),
    state: this.fb.control<boolean | true>(true),
    brokerId: this.fb.control<number | null>(null),
    benefits: this.fb.nonNullable.control<Benefit[]>([]),
  });

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private snackbarService: SnackBarService) { }

  ngOnInit(): void {
    this.fetchRegionalList();
    this.fetchInsuranceList();
    this.fetchSegmentList();
    this.fetchPlanTypeList();
    this.fetchVehicleTypeList();
    this.fetchEngineTypeList();
    if (this.showBrokerSelect) {
      this.fetchBrokerList();
    }

    if (this.value) {
      this.planForEdit = this.value;
      this.setFormFromPlan(this.value);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']?.currentValue) {
      this.planForEdit = changes['value'].currentValue as Plan;
      this.setFormFromPlan(this.planForEdit);
    }
  }

  fetchRegionalList(): void {
    this.httpService.get<Region[]>(PATH.regionList)
      .pipe(catchError(() => { this.snackbarService.error('Error al cargar las regionales.'); return EMPTY; }))
      .subscribe(res => { this.regionList = res; });
  }

  fetchInsuranceList(): void {
    this.httpService.get<Insurance[]>(PATH.insuranceList)
      .pipe(catchError(() => { this.snackbarService.error('Error al cargar las aseguradoras.'); return EMPTY; }))
      .subscribe(res => { this.insuranceList = res; });
  }

  fetchBrokerList(): void {
    this.httpService.get<Broker[]>(PATH.brokerList)
      .pipe(catchError(() => { this.snackbarService.error('Error al cargar los brokers.'); return EMPTY; }))
      .subscribe(res => { this.brokerList = res; });
  }

  fetchSegmentList(): void {
    this.httpService.get<Segment[]>(PATH.segmentList)
      .pipe(catchError(() => { this.snackbarService.error('Error al cargar los segmentos.'); return EMPTY; }))
      .subscribe(res => {
        this.segmentList = res ?? [];
        if (this.planForEdit) this.setFormFromPlan(this.planForEdit);
      });
  }

  fetchPlanTypeList(): void {
    this.httpService.get<PlanType[]>(PATH.planTypeList)
      .pipe(catchError(() => { this.snackbarService.error('Error al cargar los tipos de plan.'); return EMPTY; }))
      .subscribe(res => {
        this.planTypeList = res ?? [];
        if (this.planForEdit) this.setFormFromPlan(this.planForEdit);
      });
  }

  fetchVehicleTypeList(): void {
    this.httpService.get<VehicleType[]>(PATH.vehicleTypeList)
      .pipe(catchError(() => { this.snackbarService.error('Error al cargar los tipos de vehículo.'); return EMPTY; }))
      .subscribe(res => {
        this.vehicleTypeList = res ?? [];
        if (this.planForEdit) this.setFormFromPlan(this.planForEdit);
      });
  }

  fetchEngineTypeList(): void {
    this.httpService.get<string[]>(PATH.vehicleEngineTypeList)
      .pipe(catchError(() => { this.snackbarService.error('Error al cargar los tipos de motor.'); return EMPTY; }))
      .subscribe(res => { this.engineTypeList = res ?? []; });
  }

  private setFormFromPlan(plan: Plan): void {
    const { percentage, minimum } = this.parseFranchise(plan.franchise);
    this.form.reset({
      name: plan.name ?? null,
      regionalId: plan.regionalId ?? null,
      insuranceId: plan.insuranceId ?? null,
      minimumPremium: plan.minimumPremium ?? null,
      rate: plan.rate ?? null,
      ageLimit: plan.ageLimit ?? null,
      discount: plan.discount ?? null,
      interest: plan.interest ?? null,
      segmentId: plan.segmentId ?? this.segmentList.find(s => s.name === plan.segment)?.id ?? null,
      planTypeId: plan.planTypeId ?? this.planTypeList.find(pt => pt.name === plan.planType)?.id ?? null,
      vehicleTypeId: plan.vehicleTypeId ?? this.vehicleTypeList.find(vt => vt.name === plan.vehicleType)?.id ?? null,
      engineType: plan.engineType ?? null,
      franchisePercentage: percentage,
      franchiseMinimum: minimum,
      state: plan.state ?? true,
      brokerId: plan.brokerId ?? null,
      benefits: [...(plan.benefits ?? [])],
    }, { emitEvent: false });

    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity({ emitEvent: false });
  }

  private parseFranchise(value: unknown): { percentage: number | null; minimum: number | null } {
    const text = value != null ? String(value) : '';

    // Percentage: "." is a decimal separator here (e.g. "12.5%").
    const pctMatch = text.match(/([\d.]+)\s*%/);
    const percentage = pctMatch ? this.toNumber(parseFloat(pctMatch[1])) : null;

    // Minimum (Bs): whole bolivianos; "." / "," are thousands separators (e.g. "1.000").
    const minMatch = text.match(/Bs\.?\s*([\d.,]+)/i);
    const minimum = minMatch ? this.toNumber(parseInt(minMatch[1].replace(/[.,]/g, ''), 10)) : null;

    return { percentage, minimum };
  }

  private toNumber(n: number): number | null {
    return isNaN(n) ? null : n;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { franchisePercentage, franchiseMinimum, ...rest } = this.form.getRawValue();

    const parts: string[] = [];
    if (franchisePercentage != null) parts.push(`${franchisePercentage}%`);
    if (franchiseMinimum != null) parts.push(`Min. Bs. ${franchiseMinimum}`);
    const franchise = parts.join(' ');

    const payload = {
      ...rest,
      franchise,
    } as Plan;
    this.submitted.emit(payload);
  }

  onCancel() {
    if (this.planForEdit) this.setFormFromPlan(this.planForEdit);
    this.cancelled.emit();
  }

}
