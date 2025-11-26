import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FormImportsModule } from '../form-imports.module';

import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';
import { HttpService } from 'src/app/core/services/http/http.service';

import { Plan, Vehicle, Region, Insurance, Benefit } from 'src/app/shared/models';
import * as PATH from 'src/app/shared/utils/request-paths.util';

type PlanLevel = 'basic' | 'gold';


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
export class PlanFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() value?: Plan;
  @Input() title?: string | null = 'Datos del Plan';
  @Input() submitLabel?: string | null = 'Guardar';
  @Input() showCancel = false;

  @Output() submitted = new EventEmitter<Plan>();
  @Output() cancelled = new EventEmitter<void>();

  planForEdit: Plan | null = null;
  vehicleList: Vehicle[] = [];
  regionList: Region[] = [];
  insuranceList: Insurance[] = [];
  benefitList: Benefit[] = [];

  form = this.fb.group({
    vehicleId: this.fb.control<number | null>(null, { validators: [] }),
    regionalId: this.fb.control<number | null>(null, { validators: [] }),
    insuranceId: this.fb.control<number | null>(null, { validators: [] }),
    minimumPremium: this.fb.control<number | null>(null),
    rate: this.fb.control<number | null>(null),
    ageLimit: this.fb.control<number | null>(null),
    discount: this.fb.control<number | null>(null),
    level: this.fb.nonNullable.control<PlanLevel>('basic', [Validators.required]),
    franchise: this.fb.control<number | null>(null),
    state: this.fb.control<boolean | true>(true),
    benefits: this.fb.nonNullable.control<Benefit[]>([]),
  });

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private snackbarService: SnackBarService) { }

  ngOnInit(): void {
    this.fetchVehicleList();
    this.fetchRegionalList();
    this.fetchInsuranceList();

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

  ngOnDestroy(): void { }

  fetchVehicleList(): void {
    this.httpService.get<Vehicle[]>(PATH.vehicleList).subscribe(res => {
      this.vehicleList = res;
    });
  }

  fetchRegionalList(): void {
    this.httpService.get<Region[]>(PATH.regionList).subscribe(res => {
      this.regionList = res;
    });
  }

  fetchInsuranceList(): void {
    this.httpService.get<Insurance[]>(PATH.insuranceList).subscribe(res => {
      this.insuranceList = res;
    });
  }

  getVehicleInfo(v: Vehicle): string {
    const result = v.brand + '-' + v.model;
    return result;
  }

  private setFormFromPlan(plan: Plan): void {
    this.form.reset({
      vehicleId: plan.vehicleId ?? null,
      regionalId: plan.regionalId ?? null,
      insuranceId: plan.insuranceId ?? null,
      minimumPremium: plan.minimumPremium ?? null,
      rate: plan.rate ?? null,
      ageLimit: plan.ageLimit ?? null,
      discount: plan.discount ?? null,
      level: this.toLevel(this.value?.level),
      franchise: plan.franchise ?? null,
      state: plan.state ?? true,
      benefits: [...(plan.benefits ?? [])],
    }, { emitEvent: false });

    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity({ emitEvent: false });
  }

  private toLevel(x: any): PlanLevel {
    return x === 'gold' ? 'gold' : 'basic';
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue() as Plan;
    this.submitted.emit(payload);
  }

  onCancel() {
    if (this.planForEdit) this.setFormFromPlan(this.planForEdit);
    this.cancelled.emit();
  }

}
