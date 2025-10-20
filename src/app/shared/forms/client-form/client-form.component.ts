import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Client } from 'src/app/shared/models';

import { FormImportsModule } from '../form-imports.module';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormImportsModule
  ],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.sass']
})
export class ClientFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() value?: Client | null;
  @Input() title?: string | null = 'Ingrese sus Datos';
  @Input() submitLabel?: string | null = 'Siguiente';
  @Input() showCancel = false;

  @Output() submitted = new EventEmitter<Client>();
  @Output() cancelled = new EventEmitter<void>();

  regionList = ['Cochabamba', 'La Paz', 'Santa Cruz'];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    lastname: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    region: ['', [Validators.required]],
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
    const payload = this.form.value as Client;
    this.submitted.emit(payload);
  }

  onCancel() {
    this.cancelled.emit();
  }

}
