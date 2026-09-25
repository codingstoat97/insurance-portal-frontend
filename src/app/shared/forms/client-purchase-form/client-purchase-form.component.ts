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
import { compressImage } from 'src/app/shared/utils/image-compress.util';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';

type PhotoField =
  | 'docPicFront' | 'docPicBack'
  | 'vehiclePicRuat' | 'vehiclePicFront' | 'vehiclePicBack' | 'vehiclePicRight'
  | 'vehiclePicLeft' | 'vehiclePicChasis' | 'vehiclePicMileage';

interface PhotoSlot {
  field: PhotoField;
  label: string;
}

export interface PurchaseDialogData {
  planId: number;
  vehicleBrand?: string;
  vehicleModel?: string;
  vehiclePrice?: number | null;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: number | null;
}

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
  priceFromQuote = false;

  readonly ciPhotos: PhotoSlot[] = [
    { field: 'docPicFront', label: 'CI - Anverso' },
    { field: 'docPicBack', label: 'CI - Reverso' },
  ];

  readonly vehiclePhotos: PhotoSlot[] = [
    { field: 'vehiclePicRuat', label: 'RUAT' },
    { field: 'vehiclePicFront', label: 'Frontal' },
    { field: 'vehiclePicBack', label: 'Trasera' },
    { field: 'vehiclePicRight', label: 'Lateral derecho' },
    { field: 'vehiclePicLeft', label: 'Lateral izquierdo' },
    { field: 'vehiclePicChasis', label: 'Número de chasis' },
    { field: 'vehiclePicMileage', label: 'Kilometraje' },
  ];

  processingPhotos = new Set<PhotoField>();
  saving = false;

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
    docPicFront: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    docPicBack: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    vehiclePicRuat: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    vehiclePicFront: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    vehiclePicBack: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    vehiclePicRight: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    vehiclePicLeft: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    vehiclePicChasis: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    vehiclePicMileage: this.fb.nonNullable.control('', { validators: [Validators.required] }),
  });


  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private snackbar: SnackBarService,
    @Inject(MAT_DIALOG_DATA) private data: PurchaseDialogData) { }

  ngOnInit(): void {
    this.planId = this.data.planId;
    if (this.data.vehiclePrice != null && this.data.vehiclePrice > 0) {
      this.form.controls.vehiclePrice.setValue(this.data.vehiclePrice);
      this.priceFromQuote = true;
    }
    this.prefillContactFromQuote();
    this.vehiclePriceDisplay = formatThousands(this.form.controls.vehiclePrice.value);
  }

  private prefillContactFromQuote(): void {
    const { clientName, clientEmail, clientPhone } = this.data;
    const words = (clientName ?? '').trim().split(/\s+/).filter(Boolean);
    if (words.length) {
      const surnames = words.length >= 3 ? 2 : words.length - 1;
      const [paternalSurname = '', maternalSurname = ''] = words.slice(words.length - surnames);
      this.form.patchValue({
        name: words.slice(0, words.length - surnames).join(' '),
        paternalSurname,
        maternalSurname,
      });
    }
    if (clientEmail) this.form.patchValue({ email: clientEmail.trim() });
    if (clientPhone) this.form.patchValue({ cellphone: clientPhone });
  }

  onVehiclePriceInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const numericValue = parseThousands(input.value) ?? 0;
    this.form.controls.vehiclePrice.setValue(numericValue);
    this.vehiclePriceDisplay = formatThousands(numericValue);
  }

  async onPhotoSelected(field: PhotoField, event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    const control = this.form.controls[field];
    control.markAsTouched();
    if (!file.type.startsWith('image/')) {
      this.snackbar.error('El archivo debe ser una imagen.');
      return;
    }

    this.processingPhotos.add(field);
    try {
      control.setValue(await compressImage(file));
    } catch {
      this.snackbar.error('No se pudo leer la imagen. Intenta con una foto en formato JPG o PNG.');
    } finally {
      this.processingPhotos.delete(field);
    }
  }

  removePhoto(field: PhotoField): void {
    const control = this.form.controls[field];
    control.setValue('');
    control.markAsTouched();
  }

  photoValue(field: PhotoField): string {
    return this.form.controls[field].value;
  }

  isPhotoMissing(field: PhotoField): boolean {
    const control = this.form.controls[field];
    return control.touched && control.hasError('required');
  }

  onSubmit(): void {
    if (this.saving || this.processingPhotos.size) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackbar.error('Completa todos los campos y fotos obligatorios.');
      return;
    }
    const formValue = this.form.getRawValue();
    const payload: ClientPlan = {
      planId: this.planId,
      vehicleBrand: this.data.vehicleBrand,
      vehicleModel: this.data.vehicleModel,
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
