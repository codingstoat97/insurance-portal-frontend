import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { SharedModule } from '../../shared.module';
import { FormImportsModule } from '../form-imports.module';

import { Broker } from '../../models';

@Component({
  selector: 'app-broker-form',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    FormImportsModule,
    ReactiveFormsModule
  ],
  templateUrl: './broker-form.component.html',
  styleUrls: ['./broker-form.component.sass']
})
export class BrokerFormComponent implements OnInit, OnChanges {

  @Input() value?: Broker | null;
  @Input() title?: string | null = 'Editar Perfil';
  @Input() submitLabel?: string | null = 'Guardar Cambios';
  @Input() showCancel = false;

  @Output() submitted = new EventEmitter<Broker>();
  @Output() cancelled = new EventEmitter<void>();

  logoPreview: string | null = null;

  form = this.fb.group({
    name: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    ci: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    email: this.fb.control<string>({ value: '', disabled: true }, { nonNullable: true }),
    password: this.fb.control<string>('', { nonNullable: true, validators: [Validators.minLength(6)] }),
    logo: this.fb.control<string>(''),
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

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const payload: Broker = {
      id: this.value?.id,
      name: raw.name,
      ci: raw.ci,
      email: raw.email,
      logo: raw.logo || undefined,
      password: raw.password ? raw.password : undefined,
    };
    this.submitted.emit(payload);
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      this.form.patchValue({ logo: base64 });
      this.logoPreview = base64;
    };

    reader.readAsDataURL(file);
  }

  private applyValueToForm(v?: Broker | null): void {
    this.logoPreview = v?.logo ?? null;
    this.form.reset(
      {
        name: v?.name ?? '',
        ci: v?.ci ?? '',
        email: v?.email ?? '',
        password: '',
        logo: v?.logo ?? '',
      },
      { emitEvent: false }
    );
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

}
