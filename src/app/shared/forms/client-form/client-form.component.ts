import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormImportsModule } from '../form-imports.module';

import { Client } from '../../models';

import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormImportsModule, MatDatepickerModule],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.sass']
})
export class ClientFormComponent implements OnInit, OnChanges {

  @Input() value?: Client | null;
  @Input() title?: string | null = 'Datos del Cliente';
  @Input() submitLabel?: string | null = 'Guardar';
  @Input() showCancel = false;
  @Input() showDescription: boolean = false;

  @Output() submitted = new EventEmitter<Client>();
  @Output() cancelled = new EventEmitter<void>();

  description = '';

  form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    paternalSurname: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    maternalSurname: this.fb.nonNullable.control('', [Validators.minLength(2)]),
    marriedName: this.fb.nonNullable.control(''),
    gender: this.fb.nonNullable.control('', [Validators.required]),
    maritalStatus: this.fb.nonNullable.control('', [Validators.required]),
    birthdate: this.fb.control<Date | null>(null, { validators: [Validators.required] }),
    documentType: this.fb.nonNullable.control('', [Validators.required]),
    ci: this.fb.nonNullable.control('', [Validators.required]),
    phone: this.fb.nonNullable.control('', [Validators.required]),
    cellphone: this.fb.nonNullable.control('', [Validators.required]),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    countryOfBirth: this.fb.nonNullable.control('', [Validators.required]),
    countryOfResidence: this.fb.nonNullable.control('', [Validators.required]),
    area: this.fb.nonNullable.control('', [Validators.required]),
    address: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(5)]),
    profession: this.fb.nonNullable.control(''),
    employmentSituation: this.fb.nonNullable.control(''),
    occupation: this.fb.nonNullable.control(''),
    workPlace: this.fb.nonNullable.control(''),
    salary: this.fb.nonNullable.control(''),
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.applyValueToForm(this.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('value' in changes) {
      this.applyValueToForm(changes['value'].currentValue);
    }
  }

  private applyValueToForm(v: Client | null | undefined) {
    this.form.reset({
      name: v?.name ?? '',
      paternalSurname: v?.paternalSurname ?? '',
      maternalSurname: v?.maternalSurname ?? '',
      marriedName: v?.marriedName ?? '',
      gender: v?.gender ?? '',
      maritalStatus: v?.maritalStatus ?? '',
      birthdate: v?.birthdate ? new Date(v.birthdate) : null,
      documentType: v?.documentType ?? '',
      ci: v?.ci != null ? String(v.ci) : '',
      phone: v?.phone != null ? String(v.phone) : '',
      cellphone: v?.cellphone != null ? String(v.cellphone) : '',
      email: v?.email ?? '',
      countryOfBirth: v?.countryOfBirth ?? '',
      countryOfResidence: v?.countryOfResidence ?? '',
      area: v?.area ?? '',
      address: v?.address ?? '',
      profession: v?.profession ?? '',
      employmentSituation: v?.employmentSituation ?? '',
      occupation: v?.occupation ?? '',
      workPlace: v?.workPlace ?? '',
      salary: v?.salary ?? '',
    }, { emitEvent: false });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formValue = this.form.getRawValue();
    const payload: Client = {
      ...(this.value as Client),
      ...formValue,
      ci: Number(formValue.ci),
      phone: Number(formValue.phone),
      cellphone: Number(formValue.cellphone),
      birthdate: this.toIsoDate(formValue.birthdate!),
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
