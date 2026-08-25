import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormImportsModule } from '../form-imports.module';

import { ClientPlan, Region } from '../../models';
import { HttpService } from 'src/app/core/services/http/http.service';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { formatThousands, parseThousands } from 'src/app/shared/utils/number-format.util';

@Component({
  selector: 'app-client-purchase-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormImportsModule, MatDatepickerModule],
  templateUrl: './client-purchase-form.component.html',
  styleUrls: ['./client-purchase-form.component.sass']
})
export class ClientPurchaseFormComponent implements OnInit {
  planId!: number;
  @Input() value?: ClientPlan | null;
  @Input() title?: string | null = 'Formulario de Compra de Poliza';
  @Input() submitLabel?: string | null = 'Siguiente';
  @Input() showCancel = false;
  @Input() showDescription: boolean = false;

  @Output() submitted = new EventEmitter<ClientPlan>();
  @Output() cancelled = new EventEmitter<void>();

  regionList: Region[] = [];
  description = "Ingresa los datos requeridos para continuar con la compra de la poliza.";

  vehiclePriceDisplay = '';

  form = this.fb.nonNullable.group({
    vehiclePrice: this.fb.nonNullable.control(0, {
      validators: [Validators.required, Validators.min(0)]
    }),
    vehiclePlate: this.fb.nonNullable.control('', {
      validators: [Validators.required]
    }),
    gender: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    name: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(2)]
    }),
    paternalSurname: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(2)]
    }),
    maternalSurname: this.fb.nonNullable.control('', {
      validators: [Validators.minLength(2)]
    }),
    marriedName: this.fb.nonNullable.control(''),
    documentType: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    documentNumber: this.fb.nonNullable.control(0, {
      validators: [Validators.required, Validators.min(1)]
    }),
    countryOfBirth: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    birthdate: this.fb.control<Date | null>(null, { validators: [Validators.required] }),
    cellphone: this.fb.nonNullable.control(0, {
      validators: [Validators.required, Validators.min(0)]
    }),
    email: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.email]
    }),
    maritalStatus: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    countryOfResidence: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    area: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    address: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(5)]
    }),
    profession: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    employmentSituation: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    occupation: this.fb.nonNullable.control(''),
    workPlace: this.fb.nonNullable.control(''),
    salary: this.fb.nonNullable.control(''),
  });


  constructor(private fb: FormBuilder, private httpService: HttpService, @Inject(MAT_DIALOG_DATA) private data: { planId: number }) { }

  ngOnInit(): void {
    this.planId = this.data.planId;
    this.vehiclePriceDisplay = formatThousands(this.form.controls.vehiclePrice.value);
  }

  onVehiclePriceInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const numericValue = parseThousands(input.value) ?? 0;
    this.form.controls.vehiclePrice.setValue(numericValue);
    this.vehiclePriceDisplay = formatThousands(numericValue);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formValue = this.form.getRawValue();
    const payload: ClientPlan = {
      planId: this.planId,
      ...formValue,
      birthdate: this.toIsoDate(formValue.birthdate!)
    };

    this.submitted.emit(payload);
  }

  onCancel() {
    this.cancelled.emit();
  }

  private toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}
