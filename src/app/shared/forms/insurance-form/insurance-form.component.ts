import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { SharedModule } from '../../shared.module';
import { FormImportsModule } from '../form-imports.module';

import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';

import { Insurance } from '../../models';


@Component({
  selector: 'app-insurance-form',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    FormImportsModule,
    ReactiveFormsModule
  ],
  templateUrl: './insurance-form.component.html',
  styleUrls: ['./insurance-form.component.sass']
})
export class InsuranceFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() value?: Insurance | null;
  @Input() title?: string | null = 'Datos de la Aseguradora';
  @Input() submitLabel?: string | null = 'Guardar';
  @Input() showCancel = false;

  @Output() submitted = new EventEmitter<Insurance>();
  @Output() cancelled = new EventEmitter<void>();

  form = this.fb.group({
    name: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    type: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    email: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] })
  });

  constructor(private fb: FormBuilder, private httpService: HttpService, private snackbar: SnackBarService) { }

  ngOnInit(): void {
    this.applyValueToForm(this.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('value' in changes) {
      this.applyValueToForm(changes['value'].currentValue);
    }
  }

  ngOnDestroy(): void { }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.value as Insurance;
    this.submitted.emit(payload);
  }

  onCancel() {
    this.cancelled.emit();
  }

  private applyValueToForm(v?: Insurance | null) {
    if (v) {
      this.form.reset(
        {
          name: v.name ?? '',
          type: v.type ?? '',
          email: v.email ?? ''
        },
        { emitEvent: false }
      );
    } else {
      this.form.reset(
        {
          name: '',
          type: '',
          email: ''
        },
        { emitEvent: false }
      );
    }
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

}
