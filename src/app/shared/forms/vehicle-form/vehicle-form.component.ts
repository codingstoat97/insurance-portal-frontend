import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';

import { FormImportsModule } from '../form-imports.module';

import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';

import { Vehicle } from '../../models';
import * as PATHS from 'src/app/shared/utils/request-paths.util'

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormImportsModule
  ],
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.sass']
})
export class VehicleFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() value?: Vehicle | null;
  @Input() title?: string | null = "Datos del Vehículo";
  @Input() submitLabel: string | null = 'Siguiente';
  @Input() showCancel = false;
  @Input() showDescription: boolean = false;

  @Output() submitted = new EventEmitter<Vehicle>();
  @Output() cancelled = new EventEmitter<void>();

  vehicleClassificationList: string[] = [];
  description = "Con esta información podremos mostrarte planes adaptados al modelo, año y características de tu vehículo. Así evitamos ofrecerte opciones que no se ajusten a lo que realmente necesitas."

  form = this.fb.group({
    classification: this.fb.control<string | null>(null, { validators: [Validators.required] }),
    brand: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(50)] }),
    model: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(50)] }),
    highEnd: this.fb.control<boolean | null>(null),
    electric: this.fb.control<boolean | null>(null),
  });

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService) { }

  ngOnInit(): void {
    this.getVehiculeClassificationList();
    this.applyValueToForm(this.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('value' in changes) {
      this.applyValueToForm(changes['value'].currentValue);
    }
  }

  ngOnDestroy(): void {

  }

  private applyValueToForm(v?: any | null) {
    console.log(v);
    
    if (v) {
      const cls = (v.classifications ?? null) as string | null;
      if (cls && this.vehicleClassificationList.length && !this.vehicleClassificationList.includes(cls)) {
        this.vehicleClassificationList = [...this.vehicleClassificationList, cls];
      }

      this.form.reset(
        {
          classification: cls,
          brand: v.brand ?? '',
          model: v.model ?? '',
          highEnd: v.highEnd ?? null,
          electric: v.electric ?? null,
        },
        { emitEvent: false }
      );
    } else {
      this.form.reset(
        {
          classification: null,
          brand: '',
          model: '',
          highEnd: null,
          electric: null,
        },
        { emitEvent: false }
      );
    }

    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private normalizeClassifications(res: any): string[] {
    const arr = Array.isArray(res) ? res : [];
    const asStrings = arr.map((x: any) =>
      typeof x === 'string' ? x : (x?.value ?? x?.name ?? x?.id ?? '')
    );
    return [...new Set(asStrings.filter(Boolean))];
  }


  private getVehiculeClassificationList(): void {
    this.httpService.get<any>(PATHS.vehicleClassificationList).subscribe(res => {
      this.vehicleClassificationList = this.normalizeClassifications(res);
      const v = this.value?.classification ?? null;
      if (v && !this.vehicleClassificationList.includes(v)) {
        this.vehicleClassificationList = [...this.vehicleClassificationList, v];
      }

      if (this.value) this.applyValueToForm(this.value);
    });

  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: Vehicle = {
      ...this.value,
      ...this.form.getRawValue(),
    } as Vehicle;

    this.submitted.emit(payload);
  }

  onCancel() {
    this.cancelled.emit();
  }

}
