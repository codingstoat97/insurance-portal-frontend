import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';

import { FormImportsModule } from '../form-imports.module';

import { Vehicle } from '../../models';
import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormImportsModule
  ],
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.sass']
})
export class VehicleFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() value?: Vehicle | null;
  @Input() title?: string | null;
  @Input() submitLabel: string | null = 'Siguiente';
  @Input() showCancel = false;

  @Output() submitted = new EventEmitter<Vehicle>();
  @Output() cancelled = new EventEmitter<void>();

  vehicleClassificationList = [];

  form = this.fb.group({
    classifications: this.fb.control<string | null>(null, { validators: [Validators.required] }),
    brand: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(50)] }),
    model: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(50)] }),
    highEnd: this.fb.control<boolean | null>(null),
    electric: this.fb.control<boolean | null>(null),
  });

  constructor(private fb: FormBuilder, private httpService: HttpService, private snackbar: SnackBarService) { }

  ngOnInit(): void {
    this.getVehiculeClassificationList();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {

  }

  private getVehiculeClassificationList(): void {
    this.httpService.get<any>('vehicleCatalog/vehicleClassification').subscribe(res => {
      this.vehicleClassificationList = res;
      console.log(this.vehicleClassificationList);

    })
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.value as Vehicle;

    this.httpService.post('vehicleCatalog', payload).subscribe(res => {
      console.log(res);
      this.snackbar.success('Guardado con éxito');
    })
    this.submitted.emit(payload);
  }

  onCancel() {
    this.cancelled.emit();
  }

}
