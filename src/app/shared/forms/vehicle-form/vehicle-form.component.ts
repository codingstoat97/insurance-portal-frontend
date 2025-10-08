import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Vehicle, VEHICLE_TYPES } from '../../models';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule],
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.sass']
})
export class VehicleFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() value?: Vehicle | null;
  @Input() title?: string | null = 'Datos del Vehiculo';
  @Input() submitLabel = 'Siguiente';
  @Input() showCancel = false;

  @Output() submitted = new EventEmitter<Vehicle>();
  @Output() cancelled = new EventEmitter<void>();

  vehicleTypeList = VEHICLE_TYPES;

  form = this.fb.group({
    type: [''],
    brand: [''],
    model: [''],
    year: [null as number | null, [Validators.required, Validators.min(1900)]],
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
    const payload = this.form.value as Vehicle;
    this.submitted.emit(payload);
  }

  onCancel() {
    this.cancelled.emit();
  }

}
