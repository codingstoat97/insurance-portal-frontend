import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { FormImportsModule } from '../form-imports.module';
import { SharedModule } from '../../shared.module';

interface NamedEntity {
  id?: any;
  name: string;
}

@Component({
  selector: 'app-simple-name-form',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    FormImportsModule,
    ReactiveFormsModule
  ],
  templateUrl: './simple-name-form.component.html',
  styleUrls: ['./simple-name-form.component.sass']
})
export class SimpleNameFormComponent implements OnInit, OnChanges {

  @Input() value?: NamedEntity | null;
  @Input() title?: string | null = 'Datos';
  @Input() sectionTitle: string = 'Datos';
  @Input() sectionIcon: string = 'tune';
  @Input() fieldLabel: string = 'Nombre';
  @Input() placeholder: string = '';
  @Input() submitLabel?: string | null = 'Guardar';
  @Input() showCancel = false;

  @Output() submitted = new EventEmitter<NamedEntity>();
  @Output() cancelled = new EventEmitter<void>();

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
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

  private applyValueToForm(v: NamedEntity | null | undefined) {
    this.form.reset({ name: v?.name ?? '' }, { emitEvent: false });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: NamedEntity = {
      ...this.value,
      ...this.form.value,
    } as NamedEntity;

    this.submitted.emit(payload);
  }

  onCancel() {
    this.cancelled.emit();
  }

}
