import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { FormImportsModule } from '../form-imports.module';
import { SharedModule } from '../../shared.module';

import { Region } from '../../models';


@Component({
  selector: 'app-region-form',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    FormImportsModule,
    ReactiveFormsModule
  ],
  templateUrl: './region-form.component.html',
  styleUrls: ['./region-form.component.sass']
})
export class RegionFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() value?: Region | null;
  @Input() title?: string | null = 'Datos de la Región';
  @Input() submitLabel?: string | null = 'Guardar';
  @Input() showCancel = false;

  @Output() submitted = new EventEmitter<Region>();
  @Output() cancelled = new EventEmitter<void>();

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    country: ['', [Validators.required, Validators.minLength(2)]],
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

  ngOnDestroy(): void { }

  private applyValueToForm(v: Region | null | undefined) {
    if (v) {
      this.form.reset(
        {
          name: v.name ?? '',
          country: v.country ?? '',
        },
        { emitEvent: false }
      );
      this.form.markAsPristine();
      this.form.markAsUntouched();
    } else {
      this.form.reset({ name: '', country: '' }, { emitEvent: false });
      this.form.markAsPristine();
      this.form.markAsUntouched();
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: Region = {
      ...this.value,
      ...this.form.value,
    } as Region;

    this.submitted.emit(payload);
  }

  onCancel() {
    this.cancelled.emit();
  }

}
