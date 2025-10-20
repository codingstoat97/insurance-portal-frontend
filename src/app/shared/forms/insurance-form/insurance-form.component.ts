import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { Insurance, Region } from '../../models';

import { SharedModule } from '../../shared.module';
import { FormImportsModule } from '../form-imports.module';

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

  @Output() submitted = new EventEmitter<Region>();
  @Output() cancelled = new EventEmitter<void>();

  form = this.fb.group({
    name: [''],
    region: ['']
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {

  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.value as Region;
    this.submitted.emit(payload);
  }

  onCancel() {
    this.cancelled.emit();
  }

}
