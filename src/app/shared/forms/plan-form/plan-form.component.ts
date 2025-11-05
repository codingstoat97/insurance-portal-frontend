import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FormImportsModule } from '../form-imports.module';

import { HttpService } from 'src/app/core/services/http/http.service';

import { Plan, Vehicle, Region, Insurance } from 'src/app/shared/models';
import * as PATH from 'src/app/shared/utils/request-paths.util'

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
  @Input() value?: Plan | null;
  @Input() title?: string | null = 'Datos del Plan';
  @Input() submitLabel?: string | null = 'Guardar';
  @Input() showCancel = false;

  @Output() submitted = new EventEmitter<Plan>();
  @Output() cancelled = new EventEmitter<void>();

  planForEdit: Plan | null = null;
  vehicleList: Vehicle[] = [];
  regionList: Region[] = [];
  insuranceList: Insurance[] = [];

  form = this.fb.group({
    vehicleCatalogId: this.fb.control<number | null>(null, { validators: [] }),
    regionalId: this.fb.control<number | null>(null, { validators: [] }),
    insuranceId: this.fb.control<number | null>(null, { validators: [] }),
    rate: this.fb.control<number | null>(null),
    minimumPremium: this.fb.control<number | null>(null),
    ageLimit: this.fb.control<number | null>(null),
    discount: this.fb.control<number | null>(null),
    state: this.fb.control<boolean | true>(true)
  });

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService) { }

  ngOnInit(): void {
    if (this.value) {
      this.form.patchValue(this.value, { emitEvent: false });
    }
    this.fetchVehicleList();
    this.fetchRegionalList();
    this.fetchInsuranceList();
  }

  ngOnChanges(changes: SimpleChanges): void { }

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

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.value as Plan;
    this.submitted.emit(payload);
  }

  onCancel() {
    this.cancelled.emit();
  }

}
