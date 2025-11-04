import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { FormImportsModule } from '../form-imports.module';

import { Plan, Vehicle, Region, Insurance } from '../../models';
import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';


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

  vehicleList: Vehicle[] = [];
  regionList: Region[] = [];
  insuranceList: Insurance[] = [];

  private _hasPatchedFromInput = false;

  form = this.fb.group({
    vehicleCatalogId: this.fb.control<number | null>(null, { validators: [] }),
    regionalId: this.fb.control<number | null>(null, { validators: [] }),
    insuranceId: this.fb.control<number | null>(null, { validators: [] }),
    rate: this.fb.control<number | null>(null),
    minimumPremium: this.fb.control<number | null>(null),
    ageLimit: this.fb.control<number | null>(null),
    discount: this.fb.control<number | null>(null),
  });

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private snackbar: SnackBarService) { }

  ngOnInit(): void {
    console.log('plan form', this.value);
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
    this.httpService.get<Vehicle[]>('vehicleCatalog/list').subscribe(res => {
      this.vehicleList = res;
    });
  }

  fetchRegionalList(): void {
    this.httpService.get<Region[]>('regionals/list').subscribe(res => {
      this.regionList = res;
    });
  }

  fetchInsuranceList(): void {
    this.httpService.get<Insurance[]>('insurances/list').subscribe(res => {
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

    this.httpService.post('plans/add', payload).subscribe(res => {
      console.log(res);
      this.snackbar.success('Guardado con éxito');
    })

    this.submitted.emit(payload);
  }

  onCancel() {
    this.cancelled.emit();
  }

}
